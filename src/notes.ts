// Import required functions from database
import {
  saveNote,
  deleteNoteDB,
  restoreNoteDB,
  deleteNotePermanentlyDB,
  getAllImageObjectsFromDB,
  deleteImagePermanently
} from './database/index.js';

// Import state from state module
import { notes, deletedNotes, setDeletedNotes } from './state.js';
import type { Note } from './types.js';

function pinnedOrderValue(note: Note): number {
  return note.pinOrder ?? note.pinnedAt ?? 0;
}

/**
 * Sorts the notes array.
 */
function sortNotes(): void {
  notes.sort((a, b) => {
    // 고정된 노트는 항상 위에 표시
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    // 둘 다 고정된 경우 사용자 지정 순서, 기존 데이터는 고정 시간 순서대로
    if (a.isPinned && b.isPinned) {
        return pinnedOrderValue(a) - pinnedOrderValue(b);
    }
    // 일반 노트는 최근 수정 시간 순서대로
    return b.metadata.lastModified - a.metadata.lastModified;
  });
}

/**
 * Deletes a note.
 * @param {string} noteId The ID of the note to delete.
 */
async function deleteNote(noteId: string): Promise<Note | null> {
  const noteIndex = notes.findIndex(n => n.id === noteId);
  if (noteIndex > -1) {
    const [deletedNote] = notes.splice(noteIndex, 1);
    deletedNote.metadata.deletedAt = Date.now();
    deletedNotes.push(deletedNote);
    await deleteNoteDB(noteId);
    return deletedNote;
  }
  return null;
}

/**
 * Toggles the pin status of a note.
 * @param {string} noteId The ID of the note to toggle.
 */
async function togglePin(noteId: string): Promise<Note | null> {
    const note = notes.find(n => n.id === noteId);
    if (note) {
        if (!note.isPinned) {
            const lastPinnedOrder = notes
              .filter(candidate => candidate.isPinned)
              .reduce(
                (maximum, candidate) => Math.max(
                  maximum,
                  pinnedOrderValue(candidate),
                ),
                -1,
              );
            note.isPinned = true;
            note.pinnedAt = Date.now();
            note.pinOrder = lastPinnedOrder + 1;
        } else {
            note.isPinned = false;
            delete note.pinnedAt;
            delete note.pinOrder;
        }
        sortNotes();
        await saveNote(note);
        return note;
    }
    return null;
}

/**
 * Reorders all pinned notes and persists their normalized order values.
 * @param {string[]} orderedNoteIds Pinned note IDs in their desired order.
 */
async function reorderPinnedNotes(
  orderedNoteIds: string[],
): Promise<boolean> {
  const pinnedNotes = notes.filter(note => note.isPinned);
  const uniqueIds = new Set(orderedNoteIds);
  const pinnedById = new Map(pinnedNotes.map(note => [note.id, note]));
  const isCompleteOrder = orderedNoteIds.length === pinnedNotes.length
    && uniqueIds.size === pinnedNotes.length
    && orderedNoteIds.every(noteId => pinnedById.has(noteId));
  if (!isCompleteOrder) return false;

  const currentOrder = pinnedNotes.map(note => note.id);
  const orderChanged = currentOrder.some(
    (noteId, index) => noteId !== orderedNoteIds[index],
  );
  if (!orderChanged) return false;

  const orderedPinnedNotes = orderedNoteIds.map(
    noteId => pinnedById.get(noteId) as Note,
  );
  orderedPinnedNotes.forEach((note, index) => {
    note.pinOrder = index;
  });

  const unpinnedNotes = notes.filter(note => !note.isPinned);
  notes.splice(0, notes.length, ...orderedPinnedNotes, ...unpinnedNotes);
  await Promise.all(orderedPinnedNotes.map(note => saveNote(note)));
  return true;
}

/**
 * Restores a deleted note.
 * @param {string} noteId The ID of the note to restore.
 */
async function restoreNote(noteId: string): Promise<Note | null> {
  const noteIndex = deletedNotes.findIndex(n => n.id === noteId);
  if (noteIndex > -1) {
    const [restoredNote] = deletedNotes.splice(noteIndex, 1);
    restoredNote.metadata.lastModified = Date.now();
    delete restoredNote.metadata.deletedAt;
    notes.push(restoredNote);
    sortNotes();
    await restoreNoteDB(noteId);
    return restoredNote;
  }
  return null;
}

/**
 * Permanently deletes a note.
 * @param {string} noteId The ID of the note to delete permanently.
 */
async function deleteNotePermanently(noteId: string): Promise<void> {
  setDeletedNotes(deletedNotes.filter(n => n.id !== noteId));
  await deleteNotePermanentlyDB(noteId);
}

/**
 * Empties the recycle bin.
 */
async function emptyRecycleBin(): Promise<{
  deletedNotesCount: number;
  deletedImagesCount: number;
}> {
    const deletedNotesCount = deletedNotes.length;
    // 모든 삭제된 노트 영구 삭제
    for (const note of deletedNotes) {
        await deleteNotePermanentlyDB(note.id);
    }
    setDeletedNotes([]);

    // 모든 삭제된 이미지 영구 삭제
    const imageObjects = await getAllImageObjectsFromDB();
    const deletedImages = imageObjects.filter(img => img.deletedAt);
    for (const image of deletedImages) {
        await deleteImagePermanently(image.id);
    }

    return {
        deletedNotesCount,
        deletedImagesCount: deletedImages.length
    };
}

// Export functions
export {
  sortNotes,
  deleteNote,
  togglePin,
  reorderPinnedNotes,
  restoreNote,
  deleteNotePermanently,
  emptyRecycleBin
};
