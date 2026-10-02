import { getDeletedImageIdsFromDB, deleteImagePermanently } from './database/index.js';
import { notes, deletedNotes, folders, currentFolderId } from './state.js';
import { compareItems, parentOf } from './list-order.js';
import { toggleItemPin, trashItem, restoreItem, purgeItems, reorderItems } from './folders.js';
import type { NoteListEntry } from './types.js';

function sortNotes(): void { notes.sort(compareItems); }
async function deleteNote(id: string): Promise<NoteListEntry | null> {
  await trashItem(id); return deletedNotes.find(n => n.id === id) ?? null;
}
async function restoreNote(id: string): Promise<NoteListEntry | null> {
  await restoreItem(id); return notes.find(n => n.id === id) ?? null;
}
async function togglePin(id: string): Promise<NoteListEntry | null> {
  await toggleItemPin(id); return notes.find(n => n.id === id) ?? null;
}
async function reorderPinnedNotes(ids: string[]): Promise<boolean> {
  const pinned = [...notes, ...folders].filter(n => !n.metadata.deletedAt && parentOf(n) === currentFolderId && n.isPinned).sort(compareItems);
  if (ids.length !== pinned.length || new Set(ids).size !== ids.length || pinned.some(n => !ids.includes(n.id))) return false;
  if (pinned.every((n, i) => n.id === ids[i])) return false;
  await reorderItems(ids); return true;
}
async function deleteNotePermanently(id: string): Promise<void> { await purgeItems([id]); }
async function emptyRecycleBin(): Promise<{ deletedNotesCount: number; deletedImagesCount: number }> {
  const deletedNotesCount = deletedNotes.length;
  const ids = [...deletedNotes, ...folders.filter(f => f.metadata.deletedAt)].map(i => i.id);
  if (ids.length) await purgeItems(ids);
  const imageIds = await getDeletedImageIdsFromDB();
  for (const id of imageIds) await deleteImagePermanently(id);
  return { deletedNotesCount, deletedImagesCount: imageIds.length };
}
export { sortNotes, deleteNote, restoreNote, togglePin, reorderPinnedNotes, deleteNotePermanently, emptyRecycleBin };
