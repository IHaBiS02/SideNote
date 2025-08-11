// Import required functions from database
import {
  saveNote,
  deleteNoteDB,
  restoreNoteDB,
  deleteNotePermanentlyDB,
  getAllImageObjectsFromDB,
  deleteImagePermanently
} from './database/index.js';

// Import required functions from notes_view
import { renderNoteList, renderDeletedItemsList } from './notes_view/index.js';

// Import state from state module
import { notes, deletedNotes, setNotes, setDeletedNotes } from './state.js';

/**
 * Sorts the notes array.
 */
function sortNotes() {
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
async function deleteNote(noteId) {
  const noteIndex = notes.findIndex(n => n.id === noteId);
  if (noteIndex > -1) {
    // 활성 목록에서 제거
    const [deletedNote] = notes.splice(noteIndex, 1);
    // 삭제 시간 기록 (소프트 삭제)
    deletedNote.metadata.deletedAt = Date.now();
    // 휴지통으로 이동
    const newDeletedNotes = [...deletedNotes, deletedNote];
    setNotes([...notes]); // Update state
    setDeletedNotes(newDeletedNotes);
    await deleteNoteDB(noteId);
    renderNoteList();
  }
}

/**
 * Toggles the pin status of a note.
 * @param {string} noteId The ID of the note to toggle.
 */
async function togglePin(noteId) {
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
        renderNoteList();
    }
}

/**
 * Restores a deleted note.
 * @param {string} noteId The ID of the note to restore.
 */
async function restoreNote(noteId) {
  const noteIndex = deletedNotes.findIndex(n => n.id === noteId);
  if (noteIndex > -1) {
    // 휴지통에서 제거
    const [restoredNote] = deletedNotes.splice(noteIndex, 1);
    // 복원 시간으로 업데이트
    restoredNote.metadata.lastModified = Date.now();
    // 삭제 타임스탬프 제거
    delete restoredNote.metadata.deletedAt;
    // 활성 목록으로 이동
    const newNotes = [...notes, restoredNote];
    setDeletedNotes([...deletedNotes]); // Update state
    setNotes(newNotes);
    sortNotes();
    await restoreNoteDB(noteId);
    renderDeletedItemsList();
  }
}

/**
 * Permanently deletes a note.
 * @param {string} noteId The ID of the note to delete permanently.
 */
async function deleteNotePermanently(noteId) {
  setDeletedNotes(deletedNotes.filter(n => n.id !== noteId));
  await deleteNotePermanentlyDB(noteId);
  renderDeletedItemsList();
}

/**
 * Empties the recycle bin.
 */
async function emptyRecycleBin() {
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

    renderDeletedItemsList();
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