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

/**
 * Sorts the notes array.
 */
function sortNotes(): void {
  notes.sort((a, b) => {
    // 고정된 노트는 항상 위에 표시
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    // 둘 다 고정된 경우 고정된 시간 순서대로
    if (a.isPinned && b.isPinned) {
        return (a.pinnedAt || 0) - (b.pinnedAt || 0);
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
        // 고정 상태 토글
        note.isPinned = !note.isPinned;
        if (note.isPinned) {
            // 고정 시간 기록
            note.pinnedAt = Date.now();
        } else {
            // 고정 해제 시 시간 정보 삭제
            delete note.pinnedAt;
        }
        sortNotes();
        await saveNote(note);
        return note;
    }
    return null;
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
  restoreNote,
  deleteNotePermanently,
  emptyRecycleBin
};
