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
const titleSetting = document.getElementById('title-setting');

let notes = [];
let activeNoteId = null;
let isPreview = false;
let globalSettings = {};

// Load notes and settings from storage
chrome.storage.local.get(['notes', 'globalSettings'], (data) => {
  const loadedNotes = data.notes;
  const loadedSettings = data.globalSettings;

  if (loadedSettings) {
    globalSettings = loadedSettings;
  } else {
    globalSettings = {
      title: 'default'
    };
  }

  if (!loadedNotes) {
    notes = [];
  } else if (typeof loadedNotes === 'string') {
    const content = loadedNotes;
    const title = content.trim().split('\n')[0].substring(0, 30) || 'Imported Note';
    notes = [{
      id: `migrated-${Date.now()}`,
      title: title,
      content: content,
      settings: {}
    }];
    saveNotes();
  } else if (Array.isArray(loadedNotes)) {
    notes = loadedNotes.map(note => ({
      ...note,
      settings: note.settings || {}
    }));
  } else {
    notes = [];
  }
  renderNoteList();
});

function saveNotes() {
  chrome.storage.local.set({ notes });
}

function saveGlobalSettings() {
  chrome.storage.local.set({ globalSettings });
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
    content: '',
    settings: {}
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
    const titleSource = note.settings.title || globalSettings.title;
    if (titleSource === 'default') {
      const firstLine = note.content.trim().split('\n')[0];
      note.title = firstLine.substring(0, 30) || 'New Note';
      editorTitle.textContent = note.title;
    }
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
    const titleSource = note.settings.title || globalSettings.title;
    if (titleSource === 'custom') {
      const input = document.createElement('input');
      input.type = 'text';
      input.value = note.title;
      input.classList.add('title-input');

      let editingFinished = false;

      const finishEditing = () => {
        if (editingFinished) return;
        editingFinished = true;

        note.title = input.value;
        editorTitle.textContent = note.title;
        saveNotes();
        renderNoteList();
        input.replaceWith(editorTitle);
      };

      const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.isComposing) {
          e.preventDefault();
          finishEditing();
        } else if (e.key === 'Escape') {
          if (editingFinished) return;
          editingFinished = true;
          input.replaceWith(editorTitle);
        }
      };

      input.addEventListener('keydown', handleKeyDown);
      input.addEventListener('blur', finishEditing);

      editorTitle.replaceWith(input);
      input.focus();
    }
  }
});

let isGlobalSettings = false;

settingsButton.addEventListener('click', () => {
  isGlobalSettings = false;
  const note = notes.find(n => n.id === activeNoteId);
  titleSetting.value = note.settings.title || 'default';
  showSettingsView();
});

globalSettingsButton.addEventListener('click', () => {
  isGlobalSettings = true;
  titleSetting.value = globalSettings.title || 'default';
  showSettingsView();
});

settingsBackButton.addEventListener('click', () => {
  if (isGlobalSettings) {
    showListView();
  } else {
    showEditorView();
  }
});

titleSetting.addEventListener('change', () => {
  const value = titleSetting.value;
  if (isGlobalSettings) {
    globalSettings.title = value;
    saveGlobalSettings();
  } else {
    const note = notes.find(n => n.id === activeNoteId);
    if (note) {
      note.settings.title = value;
      if (value === 'default') {
        const firstLine = note.content.trim().split('\n')[0];
        note.title = firstLine.substring(0, 30) || 'New Note';
        editorTitle.textContent = note.title;
      }
      saveNotes();
    }
  }
});

document.addEventListener('keydown', (e) => {

  if (e.key === 'Escape') {
    if (editorView.style.display === 'block') {
      if (isPreview) {
        showListView();
      } else {
        togglePreview();
      }
    }
  }
});

showListView();
