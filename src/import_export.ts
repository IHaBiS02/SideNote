// Import required functions from database
import { getImage, saveImage, saveNote } from './database/index.js';
import { extractImageIds, sanitizeFilename } from './utils.js';
import { addAutoLineBreaks } from './text-processors.js';
import type JSZipType from 'jszip';
import type { Note, NoteMetadata, NoteSettings } from './types.js';

interface ParsedImage {
  id: string;
  blob: Blob;
}

export interface ParsedSnote {
  title: string;
  content: string;
  settings: NoteSettings;
  metadata: Pick<NoteMetadata, 'createdAt' | 'lastModified'>;
  images: ParsedImage[];
  archiveOrder?: number;
  isPinned?: boolean;
  pinOrder?: number;
}

interface ParsedSnoteOverrides {
  id?: string;
  metadata?: Partial<NoteMetadata>;
  isPinned?: boolean;
  pinnedAt?: number;
  pinOrder?: number;
}

interface ExportOptions {
  addTwoSpaceLineBreaks?: boolean;
  useTitleFolderNames?: boolean;
}

interface ArchivedNoteMetadata {
  title: string;
  settings?: NoteSettings;
  metadata?: Partial<NoteMetadata>;
}

interface SnotesManifestEntry {
  folder: string;
  order: number;
  isPinned: boolean;
  pinOrder?: number;
}

interface SnotesManifest {
  formatVersion: 1;
  notes: SnotesManifestEntry[];
}

const SNOTES_FORMAT_VERSION = 1;

/**
 * Parses a .snote zip without saving notes or images.
 * @param {JSZip} zip The JSZip object representing one note archive.
 * @returns {Promise<object>} Parsed note data and image blobs.
 */
async function parseSnote(zip: JSZipType): Promise<ParsedSnote> {
  // 필수 파일 확인: metadata.json과 note.md
  const metadataFile = zip.file('metadata.json');
  const noteFile = zip.file('note.md');

  // 필수 파일이 없으면 오류 발생
  if (!metadataFile || !noteFile) {
    throw new Error('Invalid .snote format: missing metadata.json or note.md');
  }

  // 메타데이터와 노트 내용 읽기
  const metadata = JSON.parse(
    await metadataFile.async('string'),
  ) as ArchivedNoteMetadata;
  const content = await noteFile.async('string');
  const now = Date.now();
  const images: ParsedImage[] = [];
  
  // 이미지 폴더가 있으면 모든 이미지 처리
  const imagesFolder = zip.folder('images');
  if (imagesFolder) {
    const imagePromises: Promise<void>[] = [];
    imagesFolder.forEach((relativePath, imageFile) => {
        if (!imageFile.dir) {  // 파일일 경우만 처리 (폴더 제외)
            // 이미지 ID 추출 (images/[id].png 형식)
            const fileName = imageFile.name.split('/').pop();
            if (!fileName) return;
            const imageId = fileName.replace('.png', '');
            const promise = imageFile.async('blob').then(blob => {
                images.push({ id: imageId, blob });
            });
            imagePromises.push(promise);
        }
    });
    await Promise.all(imagePromises);
  }

  return {
    title: metadata.title,
    content,
    settings: metadata.settings || {},
    metadata: {
      createdAt: metadata.metadata?.createdAt || now,
      lastModified: metadata.metadata?.lastModified || now
    },
    images
  };
}

function topLevelNoteFolders(zip: JSZipType): string[] {
  const folders = new Set<string>();
  for (const path of Object.keys(zip.files)) {
    const separatorIndex = path.indexOf('/');
    if (separatorIndex <= 0) continue;
    folders.add(path.slice(0, separatorIndex));
  }
  return Array.from(folders);
}

async function readSnotesManifest(
  zip: JSZipType,
): Promise<SnotesManifest | null> {
  const manifestFile = zip.file('manifest.json');
  if (!manifestFile) return null;

  const parsed = JSON.parse(await manifestFile.async('string')) as Partial<SnotesManifest>;
  if (
    parsed.formatVersion !== SNOTES_FORMAT_VERSION
    || !Array.isArray(parsed.notes)
  ) {
    throw new Error('Unsupported or invalid .snotes manifest');
  }

  const entries = parsed.notes.map((entry, index) => {
    if (!entry || typeof entry.folder !== 'string' || entry.folder.length === 0) {
      throw new Error(`Invalid .snotes manifest entry at index ${index}`);
    }

    return {
      folder: entry.folder,
      order: Number.isFinite(entry.order) ? Number(entry.order) : index,
      isPinned: entry.isPinned === true,
      ...(Number.isFinite(entry.pinOrder)
        ? { pinOrder: Number(entry.pinOrder) }
        : {}),
    };
  });

  return {
    formatVersion: SNOTES_FORMAT_VERSION,
    notes: entries,
  };
}

async function parseSnotesArchive(zip: JSZipType): Promise<ParsedSnote[]> {
  const manifest = await readSnotesManifest(zip);
  const availableFolders = topLevelNoteFolders(zip);
  const seenFolders = new Set<string>();
  const parsedNotes: ParsedSnote[] = [];

  if (manifest) {
    const orderedEntries = manifest.notes
      .map((entry, manifestIndex) => ({ entry, manifestIndex }))
      .sort((left, right) => (
        left.entry.order - right.entry.order
        || left.manifestIndex - right.manifestIndex
      ));

    for (const { entry } of orderedEntries) {
      if (seenFolders.has(entry.folder)) continue;
      const folder = zip.folder(entry.folder);
      if (!folder) {
        throw new Error(`Missing note folder from .snotes manifest: ${entry.folder}`);
      }
      const parsedNote = await parseSnote(folder);
      parsedNote.archiveOrder = entry.order;
      parsedNote.isPinned = entry.isPinned;
      parsedNote.pinOrder = entry.pinOrder;
      parsedNotes.push(parsedNote);
      seenFolders.add(entry.folder);
    }
  }

  let nextArchiveOrder = parsedNotes.reduce(
    (maximum, note) => Math.max(maximum, note.archiveOrder ?? -1),
    -1,
  ) + 1;
  for (const folderName of availableFolders) {
    if (seenFolders.has(folderName)) continue;
    const folder = zip.folder(folderName);
    if (!folder) continue;
    const parsedNote = await parseSnote(folder);
    if (manifest) parsedNote.archiveOrder = nextArchiveOrder++;
    parsedNotes.push(parsedNote);
  }

  return parsedNotes;
}

async function saveParsedSnoteImages(parsedNote: ParsedSnote): Promise<void> {
  const imagePromises = (parsedNote.images || []).map(image => saveImage(image.id, image.blob));
  await Promise.all(imagePromises);
}

function createNoteFromParsedSnote(
  parsedNote: ParsedSnote,
  overrides: ParsedSnoteOverrides = {},
): Note {
  const now = Date.now();
  const metadata = {
    createdAt: parsedNote.metadata?.createdAt || now,
    lastModified: parsedNote.metadata?.lastModified || now,
    ...(overrides.metadata || {})
  };

  // 새 노트 객체 생성
  const isPinned = overrides.isPinned ?? false;
  const newNote: Note = {
    id: overrides.id || crypto.randomUUID(),  // 새 UUID 생성 (중복 방지)
    title: parsedNote.title,
    content: parsedNote.content,
    settings: parsedNote.settings || {},
    metadata,
    isPinned
  };

  if (isPinned) {
    newNote.pinnedAt = overrides.pinnedAt ?? now;
    if (overrides.pinOrder !== undefined) {
      newNote.pinOrder = overrides.pinOrder;
    }
  }

  return newNote;
}

async function saveParsedSnote(
  parsedNote: ParsedSnote,
  overrides: ParsedSnoteOverrides = {},
): Promise<Note> {
  await saveParsedSnoteImages(parsedNote);
  const newNote = createNoteFromParsedSnote(parsedNote, overrides);
  // 데이터베이스에 저장
  await saveNote(newNote);
  return newNote;
}

async function processSnote(zip: JSZipType): Promise<Note> {
  const parsedNote = await parseSnote(zip);
  return saveParsedSnote(parsedNote);
}

function importedAfterPinOrder(note: Note): number {
  const order = note.pinOrder ?? note.pinnedAt;
  return Number.isFinite(order) ? Number(order) : -1;
}

async function saveImportedNotes(
  parsedNotes: ParsedSnote[],
  existingNotes: readonly Note[] = [],
): Promise<Note[]> {
  const hasArchiveOrder = parsedNotes.some(note => (
    Number.isFinite(note.archiveOrder)
  ));
  parsedNotes.sort((a, b) => {
    if (hasArchiveOrder) {
      const leftOrder = Number.isFinite(a.archiveOrder)
        ? Number(a.archiveOrder)
        : Number.MAX_SAFE_INTEGER;
      const rightOrder = Number.isFinite(b.archiveOrder)
        ? Number(b.archiveOrder)
        : Number.MAX_SAFE_INTEGER;
      return leftOrder - rightOrder;
    }
    return b.metadata.lastModified - a.metadata.lastModified;
  });

  const maximumExistingPinOrder = existingNotes
    .filter(note => note.isPinned)
    .reduce((maximum, note) => Math.max(
      maximum,
      importedAfterPinOrder(note),
    ), -1);
  const maximumExistingLastModified = existingNotes.reduce(
    (maximum, note) => Math.max(maximum, note.metadata.lastModified),
    0,
  );
  const timestampCeiling = Math.max(Date.now(), maximumExistingLastModified)
    + parsedNotes.length + 1;
  let nextPinOrder = maximumExistingPinOrder + 1;
  let pinnedIndex = 0;
  const savedNotes: Note[] = [];
  for (let i = 0; i < parsedNotes.length; i++) {
    const isPinned = parsedNotes[i].isPinned === true;
    const savedNote = await saveParsedSnote(parsedNotes[i], {
      isPinned,
      ...(isPinned
        ? {
          pinOrder: nextPinOrder++,
          pinnedAt: timestampCeiling + pinnedIndex++,
        }
        : {}),
      metadata: {
        ...parsedNotes[i].metadata,
        lastModified: timestampCeiling - i,
      }
    });
    savedNotes.push(savedNote);
  }
  return savedNotes;
}

function getExportContent(note: Note, options: ExportOptions = {}): string {
  const content = note.content;
  if (options.addTwoSpaceLineBreaks) {
    return addAutoLineBreaks(content);
  }

  return content;
}

function createNoteFolderName(
  note: Note,
  usedFolderNames: Set<string>,
  options: ExportOptions = {},
): string {
  if (!options.useTitleFolderNames) {
    return note.id;
  }

  const title = sanitizeFilename(note.title || '').trim();
  const baseName = title || note.id;
  let folderName = baseName;
  let suffix = 2;

  while (usedFolderNames.has(folderName)) {
    folderName = `${baseName}_${suffix}`;
    suffix++;
  }

  usedFolderNames.add(folderName);
  return folderName;
}

async function addNoteToZip(
  zipTarget: JSZipType,
  note: Note,
  options: ExportOptions = {},
): Promise<void> {
  const metadata = {
    title: note.title,
    settings: note.settings,
    metadata: note.metadata
  };
  zipTarget.file('metadata.json', JSON.stringify(metadata, null, 2));
  zipTarget.file('note.md', getExportContent(note, options));

  const imageIds = extractImageIds(note.content);
  if (imageIds.length === 0) {
    return;
  }

  const imagesFolder = zipTarget.folder('images');
  if (!imagesFolder) return;
  for (const imageId of imageIds) {
    try {
      const imageBlob = await getImage(imageId);
      if (imageBlob) {
        imagesFolder.file(`${imageId}.png`, imageBlob);
      }
    } catch (err) {
      console.error(`Failed to get image ${imageId} for export:`, err);
    }
  }
}

async function createSingleNoteArchive(
  note: Note,
  options: ExportOptions = {},
): Promise<JSZipType> {
  const zip = new JSZip();
  await addNoteToZip(zip, note, options);
  return zip;
}

async function createAllNotesArchive(
  notes: Note[],
  options: ExportOptions = {},
): Promise<JSZipType> {
  const zip = new JSZip();
  const usedFolderNames = new Set<string>();
  const manifest: SnotesManifest = {
    formatVersion: SNOTES_FORMAT_VERSION,
    notes: [],
  };
  for (let index = 0; index < notes.length; index++) {
    const note = notes[index];
    const folderName = createNoteFolderName(note, usedFolderNames, options);
    const noteFolder = zip.folder(folderName);
    if (!noteFolder) throw new Error(`Could not create ZIP folder: ${folderName}`);
    await addNoteToZip(noteFolder, note, options);
    manifest.notes.push({
      folder: folderName,
      order: index,
      isPinned: note.isPinned === true,
      ...(note.isPinned && Number.isFinite(note.pinOrder)
        ? { pinOrder: Number(note.pinOrder) }
        : {}),
    });
  }
  zip.file('manifest.json', JSON.stringify(manifest, null, 2));
  return zip;
}

// Export the function
export {
  parseSnote,
  parseSnotesArchive,
  saveParsedSnoteImages,
  createNoteFromParsedSnote,
  saveParsedSnote,
  processSnote,
  saveImportedNotes,
  getExportContent,
  createNoteFolderName,
  addNoteToZip,
  createSingleNoteArchive,
  createAllNotesArchive
};
