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
const autoAddSpacesCheckbox = document.getElementById('auto-add-spaces-checkbox');
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
const imageManagementButton = document.getElementById('image-management-button');
const imageManagementView = document.getElementById('image-management-view');
const imageManagementBackButton = document.getElementById('image-management-back-button');
const imageList = document.getElementById('image-list');
const deletedItemsList = document.getElementById('deleted-items-list');
const preventUsedImageDeletionCheckbox = document.getElementById('prevent-used-image-deletion-checkbox');

let notes = [];
let deletedNotes = [];
let activeNoteId = null;
let isPreview = false;
let globalSettings = {};
let originalNoteContent = '';

// =================================================================
// IndexedDB for Image Storage
// =================================================================

let db;

function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('SimpleNotesDB', 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('images')) {
        db.createObjectStore('images', { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      console.log('Database initialized');
      resolve(db);
    };

    request.onerror = (event) => {
      console.error('Database error:', event.target.errorCode);
      reject(event.target.error);
    };
  });
}

function _getImageObject(id) {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject('DB not initialized');
      return;
    }
    const transaction = db.transaction(['images'], 'readonly');
    const store = transaction.objectStore('images');
    const request = store.get(id);

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

function saveImage(id, blob) {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject('DB not initialized');
      return;
    }
    const transaction = db.transaction(['images'], 'readwrite');
    const store = transaction.objectStore('images');
    const request = store.put({ id: id, blob: blob, deletedAt: null });

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

function getImage(id) {
  return new Promise((resolve, reject) => {
    _getImageObject(id).then(imageObject => {
      if (imageObject && !imageObject.deletedAt) {
        resolve(imageObject.blob);
      } else {
        resolve(null);
      }
    }).catch(reject);
  });
}

function deleteImage(id) {
  return new Promise(async (resolve, reject) => {
    if (!db) {
      reject('DB not initialized');
      return;
    }
    try {
      const imageObject = await _getImageObject(id);
      if (imageObject) {
        imageObject.deletedAt = Date.now();
        const transaction = db.transaction(['images'], 'readwrite');
        const store = transaction.objectStore('images');
        const request = store.put(imageObject);
        request.onsuccess = () => resolve();
        request.onerror = (event) => reject(event.target.error);
      } else {
        resolve(); // Image not found, nothing to do
      }
    } catch (err) {
      reject(err);
    }
  });
}

function restoreImage(id) {
  return new Promise(async (resolve, reject) => {
    if (!db) {
      reject('DB not initialized');
      return;
    }
    try {
      const imageObject = await _getImageObject(id);
      if (imageObject) {
        imageObject.deletedAt = null;
        const transaction = db.transaction(['images'], 'readwrite');
        const store = transaction.objectStore('images');
        const request = store.put(imageObject);
        request.onsuccess = () => resolve();
        request.onerror = (event) => reject(event.target.error);
      } else {
        resolve();
      }
    } catch (err) {
      reject(err);
    }
  });
}

function deleteImagePermanently(id) {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject('DB not initialized');
      return;
    }
    const transaction = db.transaction(['images'], 'readwrite');
    const store = transaction.objectStore('images');
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

// Initialize the database when the script loads
initDB().then(() => {
  cleanupDeletedNotes();
  cleanupDeletedImages();
}).catch(err => console.error("Failed to initialize DB:", err));

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
      autoAddSpaces: true,
      preventUsedImageDeletion: true,
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
      },
      isPinned: false
    }];
  } else if (Array.isArray(loadedNotes)) {
    notes = loadedNotes.map(note => {
      note.isPinned = note.isPinned || false;
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

async function cleanupDeletedImages() {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const imageObjects = await getAllImageObjectsFromDB();
    const imagesToDelete = imageObjects.filter(img => img.deletedAt && img.deletedAt < thirtyDaysAgo);
    for (const image of imagesToDelete) {
        await deleteImagePermanently(image.id);
    }
}

function cleanupDeletedNotes() {
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  deletedNotes = deletedNotes.filter(note => note.metadata.deletedAt > thirtyDaysAgo);
  saveDeletedNotes();
}

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

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');

    const pinSpan = document.createElement('span');
    pinSpan.textContent = note.isPinned ? '📌' : '📎';
    pinSpan.title = note.isPinned ? 'Unpin Note' : 'Pin Note';
    pinSpan.classList.add('pin-note-icon');
    pinSpan.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePin(note.id);
    });

    const deleteSpan = document.createElement('span');
    deleteSpan.textContent = '🗑️';
    deleteSpan.title = 'Delete Note';
    deleteSpan.classList.add('delete-note-icon');
    deleteSpan.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteNote(note.id);
    });

    li.appendChild(titleSpan);
    buttonContainer.appendChild(pinSpan);
    buttonContainer.appendChild(deleteSpan);
    li.appendChild(buttonContainer);
    noteList.appendChild(li);
  });
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
  imageManagementView.style.display = 'none';
  renderNoteList();
}

function showEditorView() {
  listView.style.display = 'none';
  editorView.style.display = 'block';
  settingsView.style.display = 'none';
  recycleBinView.style.display = 'none';
  imageManagementView.style.display = 'none';
}

function showSettingsView() {
  listView.style.display = 'none';
  editorView.style.display = 'none';
  settingsView.style.display = 'block';
  licenseView.style.display = 'none';
  recycleBinView.style.display = 'none';
  imageManagementView.style.display = 'none';
}

function showLicenseView() {
  listView.style.display = 'none';
  editorView.style.display = 'none';
  settingsView.style.display = 'none';
  licenseView.style.display = 'block';
  recycleBinView.style.display = 'none';
  imageManagementView.style.display = 'none';
}

function showRecycleBinView() {
  listView.style.display = 'none';
  editorView.style.display = 'none';
  settingsView.style.display = 'none';
  licenseView.style.display = 'none';
  recycleBinView.style.display = 'block';
  imageManagementView.style.display = 'none';
  renderDeletedItemsList();
}

function showImageManagementView() {
  listView.style.display = 'none';
  editorView.style.display = 'none';
  settingsView.style.display = 'none';
  licenseView.style.display = 'none';
  recycleBinView.style.display = 'none';
  imageManagementView.style.display = 'block';
  renderImagesList();
}

async function renderDeletedItemsList() {
  deletedItemsList.innerHTML = '';

  // 1. Get deleted notes and images
  const deletedImageObjects = (await getAllImageObjectsFromDB()).filter(img => img.deletedAt);
  
  // 2. Combine and sort
  const deletedItems = [
    ...deletedNotes.map(n => ({ ...n, type: 'note', deletedAt: n.metadata.deletedAt })),
    ...deletedImageObjects.map(i => ({ ...i, type: 'image', deletedAt: i.deletedAt }))
  ];
  deletedItems.sort((a, b) => b.deletedAt - a.deletedAt);

  // 3. Render list
  deletedItems.forEach(item => {
    const li = document.createElement('li');
    li.dataset.itemId = item.id;
    li.dataset.itemType = item.type;

    const itemInfo = document.createElement('div');
    itemInfo.classList.add('item-info');

    if (item.type === 'note') {
      itemInfo.classList.add('note-info');
      const titleSpan = document.createElement('span');
      titleSpan.textContent = item.title;
      itemInfo.appendChild(titleSpan);

      const deletionDate = new Date(item.deletedAt + 30 * 24 * 60 * 60 * 1000);
      const deletionDateSpan = document.createElement('span');
      deletionDateSpan.textContent = `Deletes on: ${deletionDate.toLocaleString()}`;
      deletionDateSpan.classList.add('deletion-date');
      itemInfo.appendChild(deletionDateSpan);
    } else { // type === 'image'
      itemInfo.classList.add('image-info');
      const img = document.createElement('img');
      const imageBlob = item.blob;
      if (imageBlob) {
          const blobUrl = URL.createObjectURL(imageBlob);
          img.src = blobUrl;
          img.onclick = () => showImageModal(blobUrl);
      }
      itemInfo.appendChild(img);

      const textContainer = document.createElement('div');
      textContainer.classList.add('text-container');

      const imageName = document.createElement('span');
      imageName.classList.add('image-name');
      imageName.textContent = `image_${item.id.substring(0, 8)}.png`;
      textContainer.appendChild(imageName);

      const deletionDate = new Date(item.deletedAt + 30 * 24 * 60 * 60 * 1000);
      const deletionDateSpan = document.createElement('span');
      deletionDateSpan.textContent = `Deletes on: ${deletionDate.toLocaleString()}`;
      deletionDateSpan.classList.add('deletion-date');
      textContainer.appendChild(deletionDateSpan);

      itemInfo.appendChild(textContainer);
    }

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');

    const restoreSpan = document.createElement('span');
    restoreSpan.textContent = '♻️';
    restoreSpan.title = `Restore ${item.type === 'note' ? 'Note' : 'Image'}`;
    restoreSpan.classList.add('restore-item-icon');
    restoreSpan.addEventListener('click', (e) => {
      e.stopPropagation();
      if (item.type === 'note') {
        restoreNote(item.id);
      } else {
        restoreImage(item.id).then(renderDeletedItemsList);
      }
    });

    const deleteSpan = document.createElement('span');
    deleteSpan.textContent = '🗑️';
    deleteSpan.title = `Delete ${item.type === 'note' ? 'Note' : 'Image'} Permanently`;
    deleteSpan.classList.add('delete-item-icon');
    deleteSpan.addEventListener('click', (e) => {
      e.stopPropagation();
      if (item.type === 'note') {
        deleteNotePermanently(item.id);
      } else {
        deleteImagePermanently(item.id).then(renderDeletedItemsList);
      }
    });

    li.appendChild(itemInfo);
    buttonContainer.appendChild(restoreSpan);
    buttonContainer.appendChild(deleteSpan);
    li.appendChild(buttonContainer);
    deletedItemsList.appendChild(li);
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
    renderDeletedItemsList();
  }
}

function deleteNotePermanently(noteId) {
  deletedNotes = deletedNotes.filter(n => n.id !== noteId);
  saveDeletedNotes();
  renderDeletedItemsList();
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
    // 줄 수에 따라 부모 요소인 <pre> 태그에 클래스를 추가합니다.
    if (lineCount === 2) {
      block.parentElement.classList.add('single-line-code');
    } else {
      block.parentElement.classList.add('multi-line-code');
    }

    // 기존 라인 넘버 기능은 그대로 호출합니다.
    hljs.lineNumbersBlock(block);
  });

  renderImages();
}

async function renderImages() {
  const images = htmlPreview.querySelectorAll('img');
  for (const img of images) {
    const src = img.getAttribute('src');
    if (src && src.startsWith('images/')) {
      const imageId = src.substring(7, src.lastIndexOf('.'));
      img.dataset.imageId = imageId; // Add data-id for scrolling
      try {
        const imageBlob = await getImage(imageId);
        if (imageBlob) {
          const blobUrl = URL.createObjectURL(imageBlob);
          img.src = blobUrl;
        } else {
          img.alt = `Image not found: ${imageId}`;
        }
      } catch (err) {
        console.error(`Failed to load image ${imageId} from DB:`, err);
        img.alt = `Error loading image: ${imageId}`;
      }
    }
  }
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
    },
    isPinned: false
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

markdownEditor.addEventListener('paste', async (e) => {
  e.preventDefault();

  const items = Array.from(e.clipboardData.items);
  const imageItem = items.find(item => item.kind === 'file' && item.type.startsWith('image/'));

  if (imageItem) {
    const imageFile = imageItem.getAsFile();
    const imageId = crypto.randomUUID();
    
    try {
      await saveImage(imageId, imageFile);
      const markdownImageText = `![Image](images/${imageId}.png)`;
      document.execCommand('insertText', false, markdownImageText);
    } catch (err) {
      console.error('Failed to save image:', err);
      return; 
    }
  } else {
    let text = e.clipboardData.getData('text/plain');

    if (globalSettings.tildeReplacement) {
      text = text.replace(/~/g, '\\~');
    }

    if (globalSettings.autoLineBreak) {
      const lines = text.split(/\r?\n/);
      if (lines.length > 1) {
        const processedText = lines.map((line, index) => {
          if (index < lines.length - 1 && line.trim().length > 0) {
            return line.trimEnd() + '  ';
          }
          return line;
        }).join('\n');
        text = processedText;
      }
    }
    document.execCommand('insertText', false, text);
  }

  // Common logic to update note after paste
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
  if (e.key === 'Enter' && !e.isComposing && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
    if (globalSettings.autoAddSpaces) {
      const start = markdownEditor.selectionStart;
      const end = markdownEditor.selectionEnd;
      const currentLine = markdownEditor.value.substring(0, start).split('\n').pop();
      if (currentLine.trim().length > 0) {
        e.preventDefault();
        document.execCommand('insertText', false, '  \n');
      }
    }
  }


  if (e.shiftKey && e.key === 'Enter') {
    e.preventDefault();
    togglePreview();
  }
});

htmlPreview.addEventListener('dblclick', togglePreview);

function showImageModal(blobUrl) {
  const modal = document.createElement('div');
  modal.classList.add('image-preview-modal');
  modal.style.position = 'fixed';
  modal.style.left = '0';
  modal.style.top = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
  modal.style.display = 'flex';
  modal.style.boxSizing = 'border-box';
  modal.style.padding = '10%';
  modal.style.zIndex = '1000';
  modal.onclick = (event) => {
      if (event.target === modal) {
          document.body.removeChild(modal);
      }
  };

  const modalImg = document.createElement('img');
  modalImg.src = blobUrl;
  
  let zoomState = 0; // 0: fit-to-screen, 1: full-size
  const setZoomState = (state) => {
      if (state === 0) { // Fit-to-screen
          modal.style.justifyContent = 'center';
          modal.style.alignItems = 'center';
          modal.style.overflow = 'hidden';
          modalImg.style.cursor = 'zoom-in';
          modalImg.style.maxWidth = '90%';
          modalImg.style.maxHeight = '90%';
          modalImg.style.width = 'auto';
          modalImg.style.height = 'auto';
      } else { // state === 1, Full-size
          modal.style.justifyContent = 'flex-start';
          modal.style.alignItems = 'flex-start';
          modal.style.overflow = 'auto';
          modalImg.style.cursor = 'zoom-out';
          modalImg.style.maxWidth = 'none';
          modalImg.style.maxHeight = 'none';
          modalImg.style.width = 'auto';
          modalImg.style.height = 'auto';
      }
  };

  setZoomState(zoomState);
  
  modalImg.onclick = () => {
      zoomState = (zoomState + 1) % 2;
      setZoomState(zoomState);
  };

  modal.appendChild(modalImg);
  document.body.appendChild(modal);
}

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
  } else if (e.target.tagName === 'IMG') {
    showImageModal(e.target.src);
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
  autoAddSpacesCheckbox.checked = globalSettings.autoAddSpaces;
  preventUsedImageDeletionCheckbox.checked = globalSettings.preventUsedImageDeletion;
  showSettingsView();
});

globalSettingsButton.addEventListener('click', () => {
  isGlobalSettings = true;
  titleSetting.value = globalSettings.title || 'default';
  fontSizeSetting.value = globalSettings.fontSize || 12;
  modeSetting.value = globalSettings.mode || 'system';
  autoAddSpacesCheckbox.checked = globalSettings.autoAddSpaces;
  preventUsedImageDeletionCheckbox.checked = globalSettings.preventUsedImageDeletion;
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

imageManagementButton.addEventListener('click', () => {
  showImageManagementView();
});

imageManagementBackButton.addEventListener('click', () => {
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


preventUsedImageDeletionCheckbox.addEventListener('change', () => {
    globalSettings.preventUsedImageDeletion = preventUsedImageDeletionCheckbox.checked;
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

function downloadFile(blob, fileName) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
}

function extractImageIds(content) {
  const imageRegex = /!\[.*?\]\(images\/(.*?)\.png\)/g;
  const ids = new Set();
  let match;
  while ((match = imageRegex.exec(content)) !== null) {
    ids.add(match[1]);
  }
  return Array.from(ids);
}

globalExportButton.addEventListener('click', async () => {
  const zip = new JSZip();
  const timestamp = getTimestamp();

  for (const note of notes) {
    const noteFolder = zip.folder(note.id);
    
    const metadata = {
      title: note.title,
      settings: note.settings,
      metadata: note.metadata
    };
    noteFolder.file('metadata.json', JSON.stringify(metadata, null, 2));
    noteFolder.file('note.md', note.content);

    const imageIds = extractImageIds(note.content);
    if (imageIds.length > 0) {
      const imagesFolder = noteFolder.folder('images');
      for (const imageId of imageIds) {
        try {
          const imageBlob = await getImage(imageId);
          if (imageBlob) {
            imagesFolder.file(`${imageId}.png`, imageBlob);
          }
        } catch (err) {
          console.error(`Failed to get image ${imageId} for export:`, err);
        }
      }
    }
  }

  zip.generateAsync({ type: 'blob' }).then(blob => {
    downloadFile(blob, `notes_${timestamp}.snotes`);
  });
});

exportNoteButton.addEventListener('click', async () => {
  const note = notes.find(n => n.id === activeNoteId);
  if (note) {
    const zip = new JSZip();
    const sanitizedTitle = sanitizeFilename(note.title);

    const metadata = {
      title: note.title,
      settings: note.settings,
      metadata: note.metadata
    };
    zip.file('metadata.json', JSON.stringify(metadata, null, 2));
    zip.file('note.md', note.content);

    const imageIds = extractImageIds(note.content);
    if (imageIds.length > 0) {
      const imagesFolder = zip.folder('images');
      for (const imageId of imageIds) {
        try {
          const imageBlob = await getImage(imageId);
          if (imageBlob) {
            imagesFolder.file(`${imageId}.png`, imageBlob);
          }
        } catch (err) {
          console.error(`Failed to get image ${imageId} for export:`, err);
        }
      }
    }

    zip.generateAsync({ type: 'blob' }).then(blob => {
      downloadFile(blob, `${sanitizedTitle}.snote`);
    });
  }
});

globalImportButton.addEventListener('click', () => {
  globalImportInput.click();
});

importNoteButton.addEventListener('click', () => {
  importNoteInput.click();
});

globalImportInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) {
    return;
  }

  try {
    const zip = await JSZip.loadAsync(file);
    if (file.name.endsWith('.snote')) {
      const newNote = await processSnote(zip);
      newNote.metadata.lastModified = Date.now();
      notes.push(newNote);
    } else if (file.name.endsWith('.snotes')) {
      const newNotes = [];
      const topLevelFolders = new Set();
      
      for (const path in zip.files) {
        if (path.endsWith('/') && path.split('/').length === 2) {
          topLevelFolders.add(path);
        }
      }

      for (const noteFolder of topLevelFolders) {
        const newNote = await processSnote(zip.folder(noteFolder));
        newNotes.push(newNote);
      }

      newNotes.sort((a, b) => a.metadata.lastModified - b.metadata.lastModified);
      
      const now = Date.now();
      newNotes.forEach((note, index) => {
        note.metadata.lastModified = now + index;
      });
      
      notes.push(...newNotes);
    }
    sortNotes();
    saveNotes();
    renderNoteList();
  } catch (error) {
    console.error('Error importing file:', error);
    alert('Failed to import file. It may be corrupted or in the wrong format.');
  }

  globalImportInput.value = '';
});

async function processSnote(zip) {
  const metadataFile = zip.file('metadata.json');
  const noteFile = zip.file('note.md');

  if (!metadataFile || !noteFile) {
    throw new Error('Invalid .snote format: missing metadata.json or note.md');
  }

  const metadata = JSON.parse(await metadataFile.async('string'));
  const content = await noteFile.async('string');
  
  const imagesFolder = zip.folder('images');
  if (imagesFolder) {
    const imagePromises = [];
    imagesFolder.forEach((relativePath, imageFile) => {
        if (!imageFile.dir) {
            const imageId = imageFile.name.split('/').pop().replace('.png', '');
            const promise = imageFile.async('blob').then(blob => {
                return saveImage(imageId, blob);
            });
            imagePromises.push(promise);
        }
    });
    await Promise.all(imagePromises);
  }

  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    title: metadata.title,
    content: content,
    settings: metadata.settings,
    metadata: {
      createdAt: metadata.metadata?.createdAt || now,
      lastModified: metadata.metadata?.lastModified || now
    },
    isPinned: false
  };
}

importNoteInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) {
    return;
  }
  
  try {
    const zip = await JSZip.loadAsync(file);
    const importedNote = await processSnote(zip);
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
    console.error('Error importing note:', error);
    alert('Failed to import note. It may be corrupted or in the wrong format.');
  }

  importNoteInput.value = '';
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const imagePreviewModal = document.querySelector('.image-preview-modal');
    if (imagePreviewModal) {
      document.body.removeChild(imagePreviewModal);
      return;
    }

    if (imageManagementView.style.display === 'block') {
      imageManagementBackButton.click();
    } else if (recycleBinView.style.display === 'block') {
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

function getAllImageObjectsFromDB() {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject('DB not initialized');
      return;
    }
    const transaction = db.transaction(['images'], 'readonly');
    const store = transaction.objectStore('images');
    const request = store.getAll();

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

async function renderImagesList() {
  imageList.innerHTML = '';
  try {
    const imageObjects = await getAllImageObjectsFromDB();
    const allNoteContent = notes.map(n => n.content).join('\n');

    const activeImages = imageObjects.filter(img => !img.deletedAt);

    for (const imageObject of activeImages) {
      const imageId = imageObject.id;
      const li = document.createElement('li');
      li.dataset.imageId = imageId;

      const imageInfo = document.createElement('div');
      imageInfo.classList.add('image-info');

      const img = document.createElement('img');
      const imageBlob = imageObject.blob;
      if (imageBlob) {
        const blobUrl = URL.createObjectURL(imageBlob);
        img.src = blobUrl;
        img.onclick = () => showImageModal(blobUrl);
      }
      imageInfo.appendChild(img);

      const imageName = document.createElement('span');
      imageName.classList.add('image-name');
      imageName.textContent = `image_${imageId.substring(0, 8)}.png`;
      imageInfo.appendChild(imageName);

      li.appendChild(imageInfo);

      const usageIcon = document.createElement('span');
      usageIcon.classList.add('usage-icon');
      const isUsed = allNoteContent.includes(imageId);
      const notesUsingImage = isUsed ? notes.filter(n => n.content.includes(imageId)) : [];
      
      usageIcon.textContent = isUsed ? '✅' : '❌';
      usageIcon.title = isUsed ? 'Image is used in one or more notes' : 'Image is not used in any note';
      
      if (isUsed) {
        usageIcon.onclick = (e) => {
          e.stopPropagation();
          const existingDropdown = e.currentTarget.querySelector('.notes-dropdown');
          if (existingDropdown) {
            existingDropdown.remove();
            return;
          }

          const dropdown = document.createElement('div');
          dropdown.classList.add('notes-dropdown');
          notesUsingImage.forEach(note => {
            const noteItem = document.createElement('div');
            noteItem.textContent = note.title;
            noteItem.onclick = () => {
              openNote(note.id, false);
              setTimeout(() => {
                const imageInNote = htmlPreview.querySelector(`img[data-image-id="${imageId}"]`);
                if (imageInNote) {
                  imageInNote.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }, 200); // Delay to allow rendering
            };
            dropdown.appendChild(noteItem);
          });
          e.currentTarget.appendChild(dropdown);
        };
        
        document.addEventListener('click', (e) => {
            const dropdown = usageIcon.querySelector('.notes-dropdown');
            if (dropdown && !usageIcon.contains(e.target)) {
                dropdown.remove();
            }
        }, { once: true });
      }

      li.appendChild(usageIcon);

      const deleteIcon = document.createElement('span');
      deleteIcon.textContent = '🗑️';
      deleteIcon.classList.add('delete-image-icon');
      deleteIcon.title = 'Move Image to Recycle Bin';
      deleteIcon.onclick = async (e) => {
        e.stopPropagation();
        if (globalSettings.preventUsedImageDeletion && isUsed) {
            return;
        }
        try {
          await deleteImage(imageId);
          renderImagesList(); // Refresh the list
        } catch (err) {
          console.error('Failed to delete image:', err);
        }
      };
      li.appendChild(deleteIcon);

      imageList.appendChild(li);
    }
  } catch (err) {
    console.error('Failed to render image list:', err);
    imageList.innerHTML = '<li>Error loading images. See console for details.</li>';
  }
}

showListView();


// Initial setup
updateAutoLineBreakButton();
updateTildeReplacementButton();
applyFontSize(globalSettings.fontSize || 12);
applyMode(globalSettings.mode || 'system');
renderNoteList();