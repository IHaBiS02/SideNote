import type JSZipType from 'jszip';
import { addNoteToZip, createNoteFolderName, parseSnote, createNoteFromParsedSnote } from './import_export.js';
import { mutateTree } from './database/tree.js';
import { updateFolderDates } from './folder-model.js';
import { compareItems, parentOf, pinValue } from './list-order.js';
import type { Folder, Note, StoredImage } from './types.js';

interface ArchiveNote {
  id: string;
  folder: string;
  parentId: string | null;
  isPinned: boolean;
  pinOrder?: number;
  pinnedAt?: number;
}
interface TreeManifest { formatVersion: 2; folders: Folder[]; notes: ArchiveNote[]; }
export async function createTreeArchive(notes: Note[], folders: Folder[], options: {
  addTwoSpaceLineBreaks?: boolean; useTitleFolderNames?: boolean;
} = {}): Promise<JSZipType> {
  const zip = new JSZip();
  const manifest: TreeManifest = { formatVersion: 2, folders: structuredClone(folders.filter(f => !f.metadata.deletedAt)), notes: [] };
  const used = new Set<string>();
  for (const note of notes) {
    const path = createNoteFolderName(note, used, options);
    const target = zip.folder(path);
    if (!target) throw new Error('Could not create archive folder');
    await addNoteToZip(target, note, options);
    manifest.notes.push({ id: note.id, folder: path, parentId: parentOf(note), isPinned: note.isPinned,
      ...(note.pinOrder === undefined ? {} : { pinOrder: note.pinOrder }),
      ...(note.pinnedAt === undefined ? {} : { pinnedAt: note.pinnedAt }) });
  }
  zip.file('manifest.json', JSON.stringify(manifest, null, 2));
  return zip;
}

export async function isTreeArchive(zip: JSZipType): Promise<boolean> {
  const manifest = zip.file('manifest.json');
  return manifest ? JSON.parse(await manifest.async('string')).formatVersion === 2 : false;
}

/** Validate everything before writing. Remap item and image IDs for lossless merging. */
export async function importTreeArchive(zip: JSZipType): Promise<void> {
  const manifestFile = zip.file('manifest.json');
  if (!manifestFile) throw new Error('Missing manifest');
  const data = JSON.parse(await manifestFile.async('string')) as TreeManifest;
  if (data.formatVersion !== 2 || !Array.isArray(data.notes) || !Array.isArray(data.folders)) throw new Error('Invalid tree manifest');
  const ids = new Map<string, string>();
  const folderIds = new Set(data.folders.map(f => f?.id));
  const paths = new Set<string>();
  for (const entry of [...data.folders, ...data.notes]) {
    if (!entry || typeof entry.id !== 'string' || !entry.id || ids.has(entry.id)
      || (entry.parentId !== null && (typeof entry.parentId !== 'string' || !folderIds.has(entry.parentId)))
      || typeof entry.isPinned !== 'boolean'
      || (entry.pinOrder !== undefined && !Number.isFinite(entry.pinOrder))
      || (entry.pinnedAt !== undefined && !Number.isFinite(entry.pinnedAt))) throw new Error('Invalid item or parent');
    ids.set(entry.id, crypto.randomUUID());
  }
  const folders: Folder[] = data.folders.map(folder => {
    if (folder.kind !== 'folder' || typeof folder.title !== 'string' || !folder.title.trim()
      || !Number.isFinite(folder.ownModifiedAt) || !Number.isFinite(folder.metadata?.createdAt)
      || !Number.isFinite(folder.metadata?.lastModified) || folder.metadata.deletedAt) throw new Error('Invalid folder');
    return { kind: 'folder', id: ids.get(folder.id)!, title: folder.title,
      parentId: folder.parentId === null ? null : ids.get(folder.parentId)!,
      ownModifiedAt: folder.ownModifiedAt, metadata: { createdAt: folder.metadata.createdAt, lastModified: folder.metadata.lastModified },
      isPinned: folder.isPinned, pinOrder: folder.pinOrder, pinnedAt: folder.pinnedAt };
  });
  updateFolderDates({ notes: [], folders }); // Reject cycles before decompressing bodies/images.
  const notes: Note[] = [];
  const images = new Map<string, StoredImage>();
  const imageIds = new Map<string, string>();
  for (const entry of data.notes) {
    if (typeof entry.folder !== 'string' || !entry.folder || /[\\/]/.test(entry.folder)
      || entry.folder === '.' || entry.folder === '..' || paths.has(entry.folder)) throw new Error('Invalid note archive path');
    paths.add(entry.folder);
    if (!zip.file(`${entry.folder}/metadata.json`) || !zip.file(`${entry.folder}/note.md`)) throw new Error('Missing note files');
    const parsed = await parseSnote(zip.folder(entry.folder)!);
    if (typeof parsed.title !== 'string') throw new Error('Invalid note title');
    for (const image of parsed.images) {
      let newId = imageIds.get(image.id);
      if (!newId) { newId = crypto.randomUUID(); imageIds.set(image.id, newId); }
      parsed.content = parsed.content.split(`images/${image.id}.png`).join(`images/${newId}.png`);
      images.set(newId, { id: newId, blob: image.blob, deletedAt: null });
    }
    const note = createNoteFromParsedSnote(parsed, { id: ids.get(entry.id), isPinned: entry.isPinned,
      pinOrder: entry.pinOrder, pinnedAt: entry.pinnedAt });
    note.parentId = entry.parentId === null ? null : ids.get(entry.parentId)!;
    notes.push(note);
  }
  await mutateTree(tree => {
    const imported = [...notes, ...folders].filter(i => parentOf(i) === null && i.isPinned).sort(compareItems);
    const importedIds = new Set(notes.map(n => n.id));
    const last = [...tree.notes.filter(n => !importedIds.has(n.id)), ...tree.folders]
      .filter(i => !i.metadata.deletedAt && parentOf(i) === null && i.isPinned)
      .reduce((v, i) => Math.max(v, pinValue(i)), -1);
    imported.forEach((item, index) => {
      item.pinOrder = last + index + 1;
      const summary = tree.notes.find(n => n.id === item.id);
      if (summary) summary.pinOrder = item.pinOrder;
    });
    tree.folders.push(...folders);
  }, { notes, images: [...images.values()] });
}
