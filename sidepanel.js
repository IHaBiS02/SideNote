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
const licensesButton = document.getElementById('licenses-button');
const licenseView = document.getElementById('license-view');
const licenseBackButton = document.getElementById('license-back-button');
const licenseContent = document.getElementById('license-content');
const titleSetting = document.getElementById('title-setting');
const fontSizeSetting = document.getElementById('font-size-setting');
const modeSetting = document.getElementById('mode-setting');
const autoLineBreakButton = document.getElementById('auto-line-break-button');
const tildeReplacementButton = document.getElementById('tilde-replacement-button');
const globalExportButton = document.getElementById('global-export-button');
const globalImportButton = document.getElementById('global-import-button');
const globalImportInput = document.getElementById('global-import-input');
const exportNoteButton = document.getElementById('export-note-button');
const importNoteButton = document.getElementById('import-note-button');
const importNoteInput = document.getElementById('import-note-input');
const recycleBinButton = document.getElementById('recycle-bin-button');
const recycleBinView = document.getElementById('recycle-bin-view');
const recycleBinBackButton = document.getElementById('recycle-bin-back-button');
const deletedNoteList = document.getElementById('deleted-note-list');

let notes = [];
let deletedNotes = [];
let activeNoteId = null;
let isPreview = false;
let globalSettings = {};
let originalNoteContent = '';

// Load notes and settings from storage
chrome.storage.local.get(['notes', 'deletedNotes', 'globalSettings'], (data) => {
  const loadedNotes = data.notes;
  const loadedDeletedNotes = data.deletedNotes;
  const loadedSettings = data.globalSettings;

  if (loadedSettings) {
    globalSettings = loadedSettings;
  } else {
    globalSettings = {
      title: 'default',
      fontSize: 12,
      autoLineBreak: true,
      tildeReplacement: true,
      mode: 'system'
    };
  }

  if (loadedDeletedNotes) {
    deletedNotes = loadedDeletedNotes;
  } else {
    deletedNotes = [];
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
  applyMode(globalSettings.mode);
  cleanupDeletedNotes();
});

function cleanupDeletedNotes() {
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  deletedNotes = deletedNotes.filter(note => note.metadata.deletedAt > thirtyDaysAgo);
  saveDeletedNotes();
}

function sortNotes() {
  notes.sort((a, b) => b.metadata.lastModified - a.metadata.lastModified);
}

function saveNotes() {
  chrome.storage.local.set({ notes });
}

function saveGlobalSettings() {
  chrome.storage.local.set({ globalSettings });
}

function saveDeletedNotes() {
  chrome.storage.local.set({ deletedNotes });
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
    deleteSpan.textContent = '🗑️';
    deleteSpan.title = 'Delete Note';
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
    updateAutoLineBreakButton();
    updateTildeReplacementButton();
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
  recycleBinView.style.display = 'none';
  renderNoteList();
}

function showEditorView() {
  listView.style.display = 'none';
  editorView.style.display = 'block';
  settingsView.style.display = 'none';
  recycleBinView.style.display = 'none';
}

function showSettingsView() {
  listView.style.display = 'none';
  editorView.style.display = 'none';
  settingsView.style.display = 'block';
  licenseView.style.display = 'none';
  recycleBinView.style.display = 'none';
}

function showLicenseView() {
  listView.style.display = 'none';
  editorView.style.display = 'none';
  settingsView.style.display = 'none';
  licenseView.style.display = 'block';
  recycleBinView.style.display = 'none';
}

function showRecycleBinView() {
  listView.style.display = 'none';
  editorView.style.display = 'none';
  settingsView.style.display = 'none';
  licenseView.style.display = 'none';
  recycleBinView.style.display = 'block';
  renderDeletedNoteList();
}

function renderDeletedNoteList() {
  deletedNoteList.innerHTML = '';
  deletedNotes.sort((a, b) => a.metadata.deletedAt - b.metadata.deletedAt);
  deletedNotes.forEach(note => {
    const li = document.createElement('li');
    li.dataset.noteId = note.id;

    const noteInfo = document.createElement('div');
    noteInfo.classList.add('note-info');

    const titleSpan = document.createElement('span');
    titleSpan.textContent = note.title;
    noteInfo.appendChild(titleSpan);

    const deletionDate = new Date(note.metadata.deletedAt + 30 * 24 * 60 * 60 * 1000);
    const deletionDateSpan = document.createElement('span');
    deletionDateSpan.textContent = `Deletes on: ${deletionDate.toLocaleString()}`;
    deletionDateSpan.classList.add('deletion-date');
    noteInfo.appendChild(deletionDateSpan);

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');

    const restoreSpan = document.createElement('span');
    restoreSpan.textContent = '♻️';
    restoreSpan.title = 'Restore Note';
    restoreSpan.classList.add('restore-note-icon');
    restoreSpan.addEventListener('click', (e) => {
      e.stopPropagation();
      restoreNote(note.id);
    });

    const deleteSpan = document.createElement('span');
    deleteSpan.textContent = '🗑️';
    deleteSpan.title = 'Delete Note Permanently';
    deleteSpan.classList.add('delete-note-icon');
    deleteSpan.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteNotePermanently(note.id);
    });

    li.appendChild(noteInfo);
    buttonContainer.appendChild(restoreSpan);
    buttonContainer.appendChild(deleteSpan);
    li.appendChild(buttonContainer);
    deletedNoteList.appendChild(li);
  });
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
    renderDeletedNoteList();
  }
}

function deleteNotePermanently(noteId) {
  deletedNotes = deletedNotes.filter(n => n.id !== noteId);
  saveDeletedNotes();
  renderDeletedNoteList();
}

function renderMarkdown() {
  const renderer = new marked.Renderer();
  renderer.listitem = function(text, task, checked) {
    if (task) {
      return '<li class="task-list-item">' + text + '</li>';
    }
    return '<li>' + text + '</li>';
  };
  renderer.checkbox = function(checked) {
    return `<input type="checkbox" ${checked ? 'checked' : ''}>`;
  };

  marked.setOptions({
    gfm: true,
    renderer: renderer,
    highlight: function(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    }
  });

  const dirtyHtml = marked.parse(markdownEditor.value);
  htmlPreview.innerHTML = DOMPurify.sanitize(dirtyHtml, {
    ADD_TAGS: ['pre', 'code', 'span'],
    ADD_ATTR: ['class']
  });
  htmlPreview.querySelectorAll('pre code').forEach((block) => {
    // block(<code>)의 텍스트 컨텐츠를 가져와 줄바꿈(\n)으로 분리하여 줄 수를 계산합니다.
    const lineCount = block.textContent.split('\n').length;
    console.log(lineCount);
    // 줄 수에 따라 부모 요소인 <pre> 태그에 클래스를 추가합니다.
    if (lineCount === 2) {
      block.parentElement.classList.add('single-line-code');
    } else {
      block.parentElement.classList.add('multi-line-code');
    }

    // 기존 라인 넘버 기능은 그대로 호출합니다.
    hljs.lineNumbersBlock(block);
  });
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

markdownEditor.addEventListener('paste', (e) => {
  e.preventDefault();
  let text = e.clipboardData.getData('text/plain');

  if (globalSettings.tildeReplacement) {
    text = text.replace(/~/g, '\\~');
  }

  if (globalSettings.autoLineBreak) {
    const processedText = text.split('\n').map(line => {
      return line.trim().length > 0 ? line + '  ' : line;
    }).join('\n');
    text = processedText;
  }

  const start = markdownEditor.selectionStart;
  const end = markdownEditor.selectionEnd;
  
  markdownEditor.value = markdownEditor.value.substring(0, start) + text + markdownEditor.value.substring(end);
  
  markdownEditor.selectionStart = markdownEditor.selectionEnd = start + text.length;

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

htmlPreview.addEventListener('click', (e) => {
  if (e.target.tagName === 'INPUT' && e.target.type === 'checkbox') {
    const checkboxes = Array.from(htmlPreview.querySelectorAll('input[type="checkbox"]'));
    const checkboxIndex = checkboxes.indexOf(e.target);

    const markdown = markdownEditor.value;
    const regex = /\[[x ]\]/g;
    let match;
    const matches = [];
    while ((match = regex.exec(markdown)) !== null) {
      matches.push(match);
    }

    if (checkboxIndex < matches.length) {
      const matchToUpdate = matches[checkboxIndex];
      const charIndex = matchToUpdate.index;
      const originalText = matchToUpdate[0];
      const newText = originalText === '[ ]' ? '[x]' : '[ ]';

      const newMarkdown = markdown.substring(0, charIndex) +
                          newText +
                          markdown.substring(charIndex + 3);

      markdownEditor.value = newMarkdown;

      // Trigger update and save
      const note = notes.find(n => n.id === activeNoteId);
      if (note) {
        note.content = markdownEditor.value;
        note.metadata.lastModified = Date.now();
        sortNotes();
        saveNotes();
        renderMarkdown(); // Re-render to show the change immediately
        renderNoteList(); // Update note list if title changes
      }
    }
  }
});

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
          finishEditing();
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

function applyMode(mode) {
  if (mode === 'dark') {
    document.body.classList.add('dark-mode');
  } else if (mode === 'light') {
    document.body.classList.remove('dark-mode');
  } else {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (globalSettings.mode === 'system') {
        applyMode('system');
    }
});

settingsButton.addEventListener('click', () => {
  isGlobalSettings = false;
  const note = notes.find(n => n.id === activeNoteId);
  titleSetting.value = note.settings.title || 'default';
  fontSizeSetting.value = note.settings.fontSize || globalSettings.fontSize || 12;
  modeSetting.value = globalSettings.mode || 'system';
  showSettingsView();
});

globalSettingsButton.addEventListener('click', () => {
  isGlobalSettings = true;
  titleSetting.value = globalSettings.title || 'default';
  fontSizeSetting.value = globalSettings.fontSize || 12;
  modeSetting.value = globalSettings.mode || 'system';
  showSettingsView();
});

settingsBackButton.addEventListener('click', () => {
  if (isGlobalSettings) {
    showListView();
  } else {
    showEditorView();
  }
});

licensesButton.addEventListener('click', async () => {
  const response = await fetch('LIBRARY_LICENSES.md');
  const text = await response.text();
  const dirtyHtml = marked.parse(text);
  licenseContent.innerHTML = DOMPurify.sanitize(dirtyHtml);
  showLicenseView();
});

licenseBackButton.addEventListener('click', () => {
  showSettingsView();
});

recycleBinButton.addEventListener('click', () => {
  showRecycleBinView();
});

recycleBinBackButton.addEventListener('click', () => {
  showSettingsView();
});

modeSetting.addEventListener('change', () => {
  const value = modeSetting.value;
  globalSettings.mode = value;
  saveGlobalSettings();
  applyMode(value);
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

function updateAutoLineBreakButton() {
  autoLineBreakButton.textContent = globalSettings.autoLineBreak ? '↩✅' : '↩❌';
  autoLineBreakButton.title = globalSettings.autoLineBreak ? 'Auto Line Break Enabled' : 'Auto Line Break Disabled';
}

autoLineBreakButton.addEventListener('click', () => {
  globalSettings.autoLineBreak = !globalSettings.autoLineBreak;
  updateAutoLineBreakButton();
  saveGlobalSettings();
});

function updateTildeReplacementButton() {
  tildeReplacementButton.textContent = globalSettings.tildeReplacement ? '~✅' : '~❌';
  tildeReplacementButton.title = globalSettings.tildeReplacement ? 'Tilde Replacement Enabled' : 'Tilde Replacement Disabled';
}

tildeReplacementButton.addEventListener('click', () => {
  globalSettings.tildeReplacement = !globalSettings.tildeReplacement;
  updateTildeReplacementButton();
  saveGlobalSettings();
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
      const importedData = JSON.parse(content);
      if (file.name.endsWith('.snote')) {
        const now = Date.now();
        const newNote = {
          ...importedData,
          id: crypto.randomUUID(),
          metadata: {
            createdAt: importedData.metadata?.createdAt || now,
            lastModified: now
          }
        };
        notes.push(newNote);
        sortNotes();
        saveNotes();
        renderNoteList();
      } else if (file.name.endsWith('.snotes')) {
        if (Array.isArray(importedData)) {
          const now = Date.now();
          
          const importedNotes = importedData.map(note => ({
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
    if (recycleBinView.style.display === 'block') {
      recycleBinBackButton.click();
    } else if (licenseView.style.display === 'block') {
      licenseBackButton.click();
    } else if (settingsView.style.display === 'block') {
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

// Initial setup
updateAutoLineBreakButton();
updateTildeReplacementButton();
applyFontSize(globalSettings.fontSize || 12);
applyMode(globalSettings.mode || 'system');
renderNoteList();