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
const settingsView = document.getElementById('settings-view');
const settingsButton = document.getElementById('settings-button');
const globalSettingsButton = document.getElementById('global-settings-button');
const settingsBackButton = document.getElementById('settings-back-button');

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
    li.dataset.noteId = note.id;
    li.addEventListener('click', () => openNote(note.id));

    const titleSpan = document.createElement('span');
    titleSpan.textContent = note.title;

    const deleteSpan = document.createElement('span');
    deleteSpan.textContent = '🗑';
    deleteSpan.classList.add('delete-note-icon');
    deleteSpan.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteNote(note.id);
    });

    li.appendChild(titleSpan);
    li.appendChild(deleteSpan);
    noteList.appendChild(li);
  });
}

function deleteNote(noteId) {
  notes = notes.filter(n => n.id !== noteId);
  saveNotes();
  renderNoteList();
}

function openNote(noteId, inEditMode = false) {
  const note = notes.find(n => n.id === noteId);
  if (note) {
    activeNoteId = noteId;
    editorTitle.textContent = note.title;
    markdownEditor.value = note.content;
    renderMarkdown();
    showEditorView();
    isPreview = !inEditMode;
    if (isPreview) {
      htmlPreview.style.display = 'block';
      markdownEditor.style.display = 'none';
      toggleViewButton.textContent = 'Edit';
    } else {
      htmlPreview.style.display = 'none';
      markdownEditor.style.display = 'block';
      toggleViewButton.textContent = 'Preview';
      markdownEditor.focus();
    }
  }
}

function showListView() {
  activeNoteId = null;
  listView.style.display = 'block';
  editorView.style.display = 'none';
  settingsView.style.display = 'none';
  renderNoteList();
}

function showEditorView() {
  listView.style.display = 'none';
  editorView.style.display = 'block';
  settingsView.style.display = 'none';
}

function showSettingsView() {
  listView.style.display = 'none';
  editorView.style.display = 'none';
  settingsView.style.display = 'block';
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
  openNote(newNote.id, true);
});

backButton.addEventListener('click', () => {
  const note = notes.find(n => n.id === activeNoteId);
  if (note) {
    note.content = markdownEditor.value;
    saveNotes();
  }
  showListView();
});

markdownEditor.addEventListener('input', () => {
  const note = notes.find(n => n.id === activeNoteId);
  if (note) {
    note.content = markdownEditor.value;
    saveNotes();
    renderMarkdown();
  }
});

function togglePreview() {
  isPreview = !isPreview;
  if (isPreview) {
    renderMarkdown();
    htmlPreview.style.display = 'block';
    markdownEditor.style.display = 'none';
    toggleViewButton.textContent = 'Edit';
  } else {
    htmlPreview.style.display = 'none';
    markdownEditor.style.display = 'block';
    toggleViewButton.textContent = 'Preview';
    markdownEditor.focus();
  }
}

toggleViewButton.addEventListener('click', togglePreview);

markdownEditor.addEventListener('keydown', (e) => {
  if (e.shiftKey && e.key === 'Enter') {
    e.preventDefault();
    togglePreview();
  }
});

htmlPreview.addEventListener('dblclick', togglePreview);

editorTitle.addEventListener('dblclick', () => {
  const note = notes.find(n => n.id === activeNoteId);
  if (note) {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = note.title;
    input.classList.add('title-input');

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.isComposing) {
        e.preventDefault();
        note.title = input.value;
        editorTitle.textContent = note.title;
        saveNotes();
        renderNoteList();
        input.replaceWith(editorTitle);
      }
    });

    input.addEventListener('blur', () => {
      if (document.body.contains(input)) {
        note.title = input.value;
        editorTitle.textContent = note.title;
        saveNotes();
        renderNoteList();
        input.replaceWith(editorTitle);
      }
    });

    editorTitle.replaceWith(input);
    input.focus();
  }
});

let isGlobalSettings = false;

settingsButton.addEventListener('click', () => {
  isGlobalSettings = false;
  showSettingsView();
});

globalSettingsButton.addEventListener('click', () => {
  isGlobalSettings = true;
  showSettingsView();
});

settingsBackButton.addEventListener('click', () => {
  if (isGlobalSettings) {
    showListView();
  } else {
    showEditorView();
  }
});

showListView();
