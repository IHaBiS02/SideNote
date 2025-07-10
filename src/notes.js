let notes = [];
let deletedNotes = [];
let activeNoteId = null;
let originalNoteContent = '';

function sortNotes() {
  notes.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    if (a.isPinned && b.isPinned) {
        return (a.pinnedAt || 0) - (b.pinnedAt || 0);
    }
    return b.metadata.lastModified - a.metadata.lastModified;
  });
}

function saveNotes() {
  chrome.storage.local.set({ notes });
}

function saveDeletedNotes() {
  chrome.storage.local.set({ deletedNotes });
}

function deleteNote(noteId) {
  const noteIndex = notes.findIndex(n => n.id === noteId);
  if (noteIndex > -1) {
    const [deletedNote] = notes.splice(noteIndex, 1);
    deletedNote.metadata.deletedAt = Date.now();
    deletedNotes.push(deletedNote);
    saveNotes();
    saveDeletedNotes();
    renderNoteList();
  }
}

function togglePin(noteId) {
    const note = notes.find(n => n.id === noteId);
    if (note) {
        note.isPinned = !note.isPinned;
        if (note.isPinned) {
            note.pinnedAt = Date.now();
        } else {
            delete note.pinnedAt;
        }
        sortNotes();
        saveNotes();
        renderNoteList();
    }
}

function restoreNote(noteId) {
  const noteIndex = deletedNotes.findIndex(n => n.id === noteId);
  if (noteIndex > -1) {
    const [restoredNote] = deletedNotes.splice(noteIndex, 1);
    restoredNote.metadata.lastModified = Date.now();
    delete restoredNote.metadata.deletedAt;
    notes.push(restoredNote);
    sortNotes();
    saveNotes();
    saveDeletedNotes();
    renderDeletedItemsList();
  }
}

function deleteNotePermanently(noteId) {
  deletedNotes = deletedNotes.filter(n => n.id !== noteId);
  saveDeletedNotes();
  renderDeletedItemsList();
}

function cleanupDeletedNotes() {
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  deletedNotes = deletedNotes.filter(note => note.metadata.deletedAt > thirtyDaysAgo);
  saveDeletedNotes();
}