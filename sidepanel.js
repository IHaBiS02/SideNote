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
const fontSizeSetting = document.getElementById('font-size-setting');
const globalExportButton = document.getElementById('global-export-button');
const globalImportButton = document.getElementById('global-import-button');
const globalImportInput = document.getElementById('global-import-input');
const exportNoteButton = document.getElementById('export-note-button');
const importNoteButton = document.getElementById('import-note-button');
const importNoteInput = document.getElementById('import-note-input');

let notes = [];
let activeNoteId = null;
let isPreview = false;
let globalSettings = {};
let originalNoteContent = '';

// Load notes and settings from storage
chrome.storage.local.get(['notes', 'globalSettings'], (data) => {
  const loadedNotes = data.notes;
  const loadedSettings = data.globalSettings;

  if (loadedSettings) {
    globalSettings = loadedSettings;
  } else {
    globalSettings = {
      title: 'default',
      fontSize: 12
    };
  }

  if (!loadedNotes) {
    notes = [];
  } else if (typeof loadedNotes === 'string') {
    const now = Date.now();
    const content = loadedNotes;
    const title = content.trim().split('\n')[0].substring(0, 30) || 'Imported Note';
    notes = [{
      id: crypto.randomUUID(),
      title: title,
      content: content,
      settings: {},
      metadata: {
        createdAt: now,
        lastModified: now
      }
    }];
  } else if (Array.isArray(loadedNotes)) {
    notes = loadedNotes.map(note => {
      if (note.metadata && note.metadata.createdAt && note.metadata.lastModified) {
        return note;
      }
      const now = Date.now();
      let timestamp = now;
      if (typeof note.id === 'string') {
        const idNumber = parseInt(note.id.replace('migrated-', ''));
        if (!isNaN(idNumber)) {
          timestamp = idNumber;
        }
      }
      return {
        ...note,
        id: note.id || crypto.randomUUID(),
        settings: note.settings || {},
        metadata: {
          createdAt: timestamp,
          lastModified: timestamp
        }
      };
    });
  } else {
    notes = [];
  }
  sortNotes();
  renderNoteList();
});

function sortNotes() {
  notes.sort((a, b) => b.metadata.lastModified - a.metadata.lastModified);
}

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

function applyFontSize(size) {
  const editorElements = [markdownEditor, htmlPreview];
  editorElements.forEach(el => {
    el.style.fontSize = `${size}px`;
  });
}

function openNote(noteId, inEditMode = false) {
  const note = notes.find(n => n.id === noteId);
  if (note) {
    activeNoteId = noteId;
    originalNoteContent = note.content; // Store original content
    editorTitle.textContent = note.title;
    markdownEditor.value = note.content;
    const fontSize = note.settings.fontSize || globalSettings.fontSize || 12;
    applyFontSize(fontSize);
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
  const dirtyHtml = marked.parse(markdownEditor.value);
  htmlPreview.innerHTML = DOMPurify.sanitize(dirtyHtml);
}

newNoteButton.addEventListener('click', () => {
  const now = Date.now();
  const newNote = {
    id: crypto.randomUUID(),
    title: 'New Note',
    content: '',
    settings: {
      fontSize: globalSettings.fontSize || 12
    },
    metadata: {
      createdAt: now,
      lastModified: now
    }
  };
  notes.unshift(newNote);
  saveNotes();
  openNote(newNote.id, true);
});

backButton.addEventListener('click', () => {
  const note = notes.find(n => n.id === activeNoteId);
  if (note) {
    if (markdownEditor.value !== originalNoteContent) {
      note.content = markdownEditor.value;
      note.metadata.lastModified = Date.now();
      sortNotes();
      saveNotes();
    }
  }
  showListView();
});

markdownEditor.addEventListener('input', () => {
  const note = notes.find(n => n.id === activeNoteId);
  if (note) {
    note.content = markdownEditor.value;
    note.metadata.lastModified = Date.now();
    const titleSource = note.settings.title || globalSettings.title;
    if (titleSource === 'default') {
      const firstLine = note.content.trim().split('\n')[0];
      note.title = firstLine.substring(0, 30) || 'New Note';
      editorTitle.textContent = note.title;
    }
    sortNotes();
    saveNotes();
    renderMarkdown();
    renderNoteList();
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
    let titleSource = note.settings.title || globalSettings.title;
    if (titleSource === 'default') {
      note.settings.title = 'custom';
      titleSource = 'custom';
      saveNotes();
    }

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
        note.metadata.lastModified = Date.now();
        editorTitle.textContent = note.title;
        sortNotes();
        saveNotes();
        renderNoteList();
        input.replaceWith(editorTitle);
      };

      const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.isComposing) {
          e.preventDefault();
          finishEditing();
        } else if (e.key === 'Escape') {
          e.stopPropagation();
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
  fontSizeSetting.value = note.settings.fontSize || globalSettings.fontSize || 12;
  showSettingsView();
});

globalSettingsButton.addEventListener('click', () => {
  isGlobalSettings = true;
  titleSetting.value = globalSettings.title || 'default';
  fontSizeSetting.value = globalSettings.fontSize || 12;
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
      note.metadata.lastModified = Date.now();
      if (value === 'default') {
        const firstLine = note.content.trim().split('\n')[0];
        note.title = firstLine.substring(0, 30) || 'New Note';
        editorTitle.textContent = note.title;
      }
      sortNotes();
      saveNotes();
    }
  }
});

fontSizeSetting.addEventListener('input', () => {
  const value = parseInt(fontSizeSetting.value, 10);
  if (isNaN(value) || value < 1) {
    return;
  }

  if (isGlobalSettings) {
    globalSettings.fontSize = value;
    saveGlobalSettings();
  } else {
    const note = notes.find(n => n.id === activeNoteId);
    if (note) {
      note.settings.fontSize = value;
      note.metadata.lastModified = Date.now();
      applyFontSize(value);
      sortNotes();
      saveNotes();
    }
  }
});

function getTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}_${month}_${day}_${hours}_${minutes}_${seconds}`;
}

function sanitizeFilename(filename) {
  return filename.replace(/[\/\\?%*:|"<>]/g, '_');
}

function downloadFile(content, fileName) {
  const a = document.createElement('a');
  const file = new Blob([content], { type: 'text/plain' });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
}

globalExportButton.addEventListener('click', () => {
  const data = JSON.stringify(notes, null, 2);
  const timestamp = getTimestamp();
  downloadFile(data, `notes_${timestamp}.snotes`);
});

exportNoteButton.addEventListener('click', () => {
  const note = notes.find(n => n.id === activeNoteId);
  if (note) {
    const data = JSON.stringify(note, null, 2);
    const sanitizedTitle = sanitizeFilename(note.title);
    downloadFile(data, `${sanitizedTitle}.snote`);
  }
});

globalImportButton.addEventListener('click', () => {
  globalImportInput.click();
});

importNoteButton.addEventListener('click', () => {
  importNoteInput.click();
});

globalImportInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) {
    return;
  }
  const reader = new FileReader();
  reader.onload = (event) => {
    const content = event.target.result;
    try {
      let importedNotes = JSON.parse(content);
      if (Array.isArray(importedNotes)) {
        const now = Date.now();
        
        importedNotes = importedNotes.map(note => ({
          ...note,
          metadata: note.metadata || { createdAt: now, lastModified: now }
        })).sort((a, b) => a.metadata.lastModified - b.metadata.lastModified);

        const newNotes = importedNotes.map((note, index) => ({
          ...note,
          id: crypto.randomUUID(),
          metadata: {
            createdAt: note.metadata.createdAt || now,
            lastModified: now + index
          }
        }));

        notes.push(...newNotes);
        sortNotes();
        saveNotes();
        renderNoteList();
      }
    } catch (error) {
      console.error('Error parsing JSON file:', error);
    }
  };
  reader.readAsText(file);
  globalImportInput.value = '';
});

importNoteInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) {
    return;
  }
  const reader = new FileReader();
  reader.onload = (event) => {
    const content = event.target.result;
    try {
      const importedNote = JSON.parse(content);
      const note = notes.find(n => n.id === activeNoteId);
      if (note) {
        note.title = importedNote.title;
        note.content = importedNote.content;
        note.settings = importedNote.settings;
        note.metadata.lastModified = Date.now();
        editorTitle.textContent = note.title;
        markdownEditor.value = note.content;
        sortNotes();
        saveNotes();
        renderMarkdown();
      }
    } catch (error) {
      console.error('Error parsing JSON file:', error);
    }
  };
  reader.readAsText(file);
  importNoteInput.value = '';
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (settingsView.style.display === 'block') {
      settingsBackButton.click();
    } else if (editorView.style.display === 'block') {
      if (isPreview) {
        showListView();
      } else {
        togglePreview();
      }
    }
  }
});

showListView();