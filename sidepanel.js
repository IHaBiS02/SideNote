const listView = document.getElementById('list-view');
const editorView = document.getElementById('editor-view');
const noteList = document.getElementById('note-list');
const newNoteButton = document.getElementById('new-note-button');
const backButton = document.getElementById('back-button');
const deleteNoteButton = document.getElementById('delete-note-button');
const editorTitle = document.getElementById('editor-title');
const markdownEditor = document.getElementById('markdown-editor');
const htmlPreview = document.getElementById('html-preview');
const toggleViewButton = document.getElementById('toggle-view-button');

let notes = [];
let activeNoteId = null;
let isPreview = false;

// Load notes from storage
chrome.storage.local.get('notes', (data) => {
  const loadedNotes = data.notes;

  if (!loadedNotes) {
    notes = [];
  } else if (typeof loadedNotes === 'string') {
    const content = loadedNotes;
    const title = content.trim().split('\n')[0].substring(0, 30) || 'Imported Note';
    notes = [{
      id: `migrated-${Date.now()}`,
      title: title,
      content: content
    }];
    saveNotes();
  } else if (Array.isArray(loadedNotes)) {
    notes = loadedNotes;
  } else {
    notes = [];
  }
  renderNoteList();
});

function saveNotes() {
  chrome.storage.local.set({ notes });
}

function renderNoteList() {
  noteList.innerHTML = '';
  if (!Array.isArray(notes)) return;
  notes.forEach(note => {
    const li = document.createElement('li');
    li.textContent = note.title;
    li.dataset.noteId = note.id;
    li.addEventListener('click', () => openNote(note.id));
    noteList.appendChild(li);
  });
}

function openNote(noteId) {
  const note = notes.find(n => n.id === noteId);
  if (note) {
    activeNoteId = noteId;
    editorTitle.textContent = note.title;
    markdownEditor.value = note.content;
    renderMarkdown();
    showEditorView();
  }
}

function showListView() {
  activeNoteId = null;
  listView.style.display = 'block';
  editorView.style.display = 'none';
  renderNoteList();
}

function showEditorView() {
  listView.style.display = 'none';
  editorView.style.display = 'block';
}

function renderMarkdown() {
  htmlPreview.innerHTML = marked.parse(markdownEditor.value);
}

newNoteButton.addEventListener('click', () => {
  const newNote = {
    id: Date.now().toString(),
    title: 'New Note',
    content: ''
  };
  notes.unshift(newNote);
  saveNotes();
  openNote(newNote.id);
});

backButton.addEventListener('click', () => {
  const note = notes.find(n => n.id === activeNoteId);
  if (note) {
    note.content = markdownEditor.value;
    const firstLine = note.content.trim().split('\n')[0].substring(0, 30);
    note.title = firstLine || 'New Note';
    saveNotes();
  }
  showListView();
});

deleteNoteButton.addEventListener('click', () => {
  notes = notes.filter(n => n.id !== activeNoteId);
  saveNotes();
  showListView();
});

markdownEditor.addEventListener('input', () => {
  const note = notes.find(n => n.id === activeNoteId);
  if (note) {
    note.content = markdownEditor.value;
    const firstLine = note.content.trim().split('\n')[0].substring(0, 30);
    note.title = firstLine || 'New Note';
    saveNotes();
    renderMarkdown();
    const noteListItem = noteList.querySelector(`[data-note-id="${activeNoteId}"]`);
    if (noteListItem) {
      noteListItem.textContent = note.title;
    }
  }
});

toggleViewButton.addEventListener('click', () => {
  isPreview = !isPreview;
  if (isPreview) {
    htmlPreview.style.display = 'block';
    markdownEditor.style.display = 'none';
    toggleViewButton.textContent = 'Edit';
  } else {
    htmlPreview.style.display = 'none';
    markdownEditor.style.display = 'block';
    toggleViewButton.textContent = 'Preview';
  }
});

showListView();
