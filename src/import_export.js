// Import required functions from database
import { getImage, saveImage, saveNote } from './database/index.js';
import { extractImageIds, sanitizeFilename } from './utils.js';
import { addAutoLineBreaks } from './text-processors.js';

/**
 * Parses a .snote zip without saving notes or images.
 * @param {JSZip} zip The JSZip object representing one note archive.
 * @returns {Promise<object>} Parsed note data and image blobs.
 */
async function parseSnote(zip) {
  // 필수 파일 확인: metadata.json과 note.md
  const metadataFile = zip.file('metadata.json');
  const noteFile = zip.file('note.md');

  // 필수 파일이 없으면 오류 발생
  if (!metadataFile || !noteFile) {
    throw new Error('Invalid .snote format: missing metadata.json or note.md');
  }

  // 메타데이터와 노트 내용 읽기
  const metadata = JSON.parse(await metadataFile.async('string'));
  const content = await noteFile.async('string');
  const now = Date.now();
  const images = [];
  
  // 이미지 폴더가 있으면 모든 이미지 처리
  const imagesFolder = zip.folder('images');
  if (imagesFolder) {
    const imagePromises = [];
    imagesFolder.forEach((relativePath, imageFile) => {
        if (!imageFile.dir) {  // 파일일 경우만 처리 (폴더 제외)
            // 이미지 ID 추출 (images/[id].png 형식)
            const imageId = imageFile.name.split('/').pop().replace('.png', '');
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

async function saveParsedSnoteImages(parsedNote) {
  const imagePromises = (parsedNote.images || []).map(image => saveImage(image.id, image.blob));
  await Promise.all(imagePromises);
}

function createNoteFromParsedSnote(parsedNote, overrides = {}) {
  const now = Date.now();
  const metadata = {
    createdAt: parsedNote.metadata?.createdAt || now,
    lastModified: parsedNote.metadata?.lastModified || now,
    ...(overrides.metadata || {})
  };

  // 새 노트 객체 생성
  const newNote = {
    id: overrides.id || crypto.randomUUID(),  // 새 UUID 생성 (중복 방지)
    title: parsedNote.title,
    content: parsedNote.content,
    settings: parsedNote.settings || {},
    metadata,
    isPinned: overrides.isPinned ?? false  // 가져온 노트는 기본적으로 고정되지 않음
  };

  return newNote;
}

async function saveParsedSnote(parsedNote, overrides = {}) {
  await saveParsedSnoteImages(parsedNote);
  const newNote = createNoteFromParsedSnote(parsedNote, overrides);
  // 데이터베이스에 저장
  await saveNote(newNote);
  return newNote;
}

async function processSnote(zip) {
  const parsedNote = await parseSnote(zip);
  return saveParsedSnote(parsedNote);
}

async function saveImportedNotes(parsedNotes) {
  parsedNotes.sort((a, b) => a.metadata.lastModified - b.metadata.lastModified);
  const now = Date.now();
  const savedNotes = [];
  for (let i = 0; i < parsedNotes.length; i++) {
    const savedNote = await saveParsedSnote(parsedNotes[i], {
      metadata: {
        ...parsedNotes[i].metadata,
        lastModified: now + i
      }
    });
    savedNotes.push(savedNote);
  }
  return savedNotes;
}

function getExportContent(note, options = {}) {
  const content = note.content;
  if (options.addTwoSpaceLineBreaks) {
    return addAutoLineBreaks(content);
  }

  return content;
}

function createNoteFolderName(note, usedFolderNames, options = {}) {
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

async function addNoteToZip(zipTarget, note, options = {}) {
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

async function createSingleNoteArchive(note, options = {}) {
  const zip = new JSZip();
  await addNoteToZip(zip, note, options);
  return zip;
}

async function createAllNotesArchive(notes, options = {}) {
  const zip = new JSZip();
  const usedFolderNames = new Set();
  for (const note of notes) {
    const folderName = createNoteFolderName(note, usedFolderNames, options);
    await addNoteToZip(zip.folder(folderName), note, options);
  }
  return zip;
}

// Export the function
export {
  parseSnote,
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
