async function navigateToState(state) {
    if (!state) {
        showListView(false);
        return;
    }

    switch (state.view) {
        case 'list':
            showListView(false);
            break;
        case 'editor':
            openNote(state.params.noteId, state.params.inEditMode, false);
            break;
        case 'settings':
            isGlobalSettings = state.params.isGlobal;
            if (isGlobalSettings) {
                titleSetting.value = globalSettings.title || 'default';
                fontSizeSetting.value = globalSettings.fontSize || 12;
                modeSetting.value = globalSettings.mode || 'system';
                autoAddSpacesCheckbox.checked = globalSettings.autoAddSpaces;
                preventUsedImageDeletionCheckbox.checked = globalSettings.preventUsedImageDeletion;
            } else {
                const note = notes.find(n => n.id === state.params.noteId);
                if (note) {
                    activeNoteId = note.id;
                    titleSetting.value = note.settings.title || 'default';
                    fontSizeSetting.value = note.settings.fontSize || globalSettings.fontSize || 12;
                    modeSetting.value = globalSettings.mode || 'system';
                    autoAddSpacesCheckbox.checked = globalSettings.autoAddSpaces;
                    preventUsedImageDeletionCheckbox.checked = globalSettings.preventUsedImageDeletion;
                } else {
                    showListView(false); // Fallback
                    return;
                }
            }
            showSettingsView(false);
            break;
        case 'license':
            showLicenseView(false);
            break;
        case 'recycleBin':
            showRecycleBinView(false);
            break;
        case 'imageManagement':
            showImageManagementView(false);
            break;
        default:
            showListView(false);
    }
}

async function goBack() {
    const currentState = getCurrentHistoryState();
    if (currentState && currentState.view === 'editor') {
        const note = notes.find(n => n.id === currentState.params.noteId);
        if (note && markdownEditor.value !== originalNoteContent) {
            note.content = markdownEditor.value;
            note.metadata.lastModified = Date.now();
            sortNotes();
            await saveNote(note);
            renderNoteList();
        }
    }

    const previousState = moveBack();
    if (previousState) {
        navigateToState(previousState);

        const existingDropdown = document.querySelector('.history-dropdown');
        if (existingDropdown) {
            const currentIndex = getHistoryIndex();
            const items = existingDropdown.querySelectorAll('div');
            const history = getHistory();
            
            items.forEach((item, reversedIndex) => {
                const originalIndex = history.length - 1 - reversedIndex;
                if (originalIndex === currentIndex) {
                    item.classList.add('current-history-item');
                } else {
                    item.classList.remove('current-history-item');
                }
            });
        }
    }
}

newNoteButton.addEventListener('click', async () => {
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
  await saveNote(newNote);
  openNote(newNote.id, true);
});

const backButtons = [
    backButton,
    settingsBackButton,
    licenseBackButton,
    recycleBinBackButton,
    imageManagementBackButton
];

backButtons.forEach(button => {
    button.addEventListener('click', goBack);
    button.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showHistoryDropdown(e.currentTarget);
    });
});

function populateHistoryDropdown(dropdown) {
    dropdown.innerHTML = ''; // Clear existing items
    const history = getHistory();
    const currentIndex = getHistoryIndex();
    if (history.length === 0) {
        dropdown.remove();
        return;
    }

    // The history is displayed from most recent to oldest, so we reverse it for display
    [...history].reverse().forEach((state, reversedIndex) => {
        const originalIndex = history.length - 1 - reversedIndex;
        const item = document.createElement('div');
        let title = state.view;
        if (state.view === 'editor' && state.params && state.params.noteId) {
            const note = notes.find(n => n.id === state.params.noteId);
            title = note ? `Editor: ${note.title}` : 'Editor: Untitled';
        } else {
            // Capitalize first letter
            title = state.view.charAt(0).toUpperCase() + state.view.slice(1);
        }
        item.textContent = title;
        item.title = title;

        if (originalIndex === currentIndex) {
            item.classList.add('current-history-item');
        }

        item.addEventListener('click', async () => {
            const targetState = history[originalIndex];

            const currentState = getCurrentHistoryState();
            if (currentState && currentState.view === 'editor') {
                const note = notes.find(n => n.id === currentState.params.noteId);
                if (note && markdownEditor.value !== originalNoteContent) {
                    note.content = markdownEditor.value;
                    note.metadata.lastModified = Date.now();
                    sortNotes();
                    await saveNote(note);
                    renderNoteList();
                }
            }
            
            goToHistoryState(originalIndex);
            navigateToState(targetState);
            dropdown.remove();
        });
        dropdown.appendChild(item);
    });
}

function showHistoryDropdown(targetButton) {
    // Close any existing dropdown
    const existingDropdown = document.querySelector('.history-dropdown');
    if (existingDropdown) {
        existingDropdown.remove();
    }

    const history = getHistory();
    if (history.length === 0) return;

    const dropdown = document.createElement('div');
    dropdown.classList.add('history-dropdown');

    populateHistoryDropdown(dropdown);

    document.body.appendChild(dropdown);

    // Close dropdown when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeDropdown(event) {
            if (!dropdown.contains(event.target) && event.target !== targetButton) {
                dropdown.remove();
                document.removeEventListener('click', closeDropdown);
            }
        });
    }, 0);
}

function refreshHistoryDropdown() {
    const existingDropdown = document.querySelector('.history-dropdown');
    if (existingDropdown) {
        populateHistoryDropdown(existingDropdown);
    }
}

document.addEventListener('historytruncated', refreshHistoryDropdown);

markdownEditor.addEventListener('input', async () => {
  const note = notes.find(n => n.id === activeNoteId);
  if (note) {
    note.content = markdownEditor.value;
    note.metadata.lastModified = Date.now();
    const titleSource = note.settings.title || globalSettings.title;
    let titleChanged = false;
    if (titleSource === 'default') {
      const newTitle = note.content.trim().split('\n')[0].substring(0, 30) || 'New Note';
      if (note.title !== newTitle) {
        note.title = newTitle;
        editorTitle.textContent = note.title;
        titleChanged = true;
      }
    }
    sortNotes();
    await saveNote(note);
    if (titleChanged) {
      renderNoteList();
    }
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
      text = text.replace(/~/g, '\~');
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
});

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

htmlPreview.addEventListener('click', async (e) => {
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
        await saveNote(note);
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
      saveNote(note);
    }

    if (titleSource === 'custom') {
      const input = document.createElement('input');
      input.type = 'text';
      input.value = note.title;
      input.classList.add('title-input');

      let editingFinished = false;

      const finishEditing = async () => {
        if (editingFinished) return;
        editingFinished = true;

        note.title = input.value;
        note.metadata.lastModified = Date.now();
        editorTitle.textContent = note.title;
        sortNotes();
        await saveNote(note);
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



licensesButton.addEventListener('click', async () => {
  const response = await fetch('LIBRARY_LICENSES.md');
  const text = await response.text();
  const dirtyHtml = marked.parse(text);
  licenseContent.innerHTML = DOMPurify.sanitize(dirtyHtml);
  showLicenseView();
});



recycleBinButton.addEventListener('click', () => {
  showRecycleBinView();
});



imageManagementButton.addEventListener('click', () => {
  showImageManagementView();
});

emptyRecycleBinButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to permanently delete all items in the recycle bin?')) {
        emptyRecycleBin();
    }
});

modeSetting.addEventListener('change', () => {
  const value = modeSetting.value;
  globalSettings.mode = value;
  saveGlobalSettings();
  applyMode(value);
});

titleSetting.addEventListener('change', async () => {
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
      await saveNote(note);
    }
  }
});

fontSizeSetting.addEventListener('input', async () => {
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
      await saveNote(note);
    }
  }
});

autoLineBreakButton.addEventListener('click', () => {
  globalSettings.autoLineBreak = !globalSettings.autoLineBreak;
  updateAutoLineBreakButton();
  saveGlobalSettings();
});

tildeReplacementButton.addEventListener('click', () => {
  globalSettings.tildeReplacement = !globalSettings.tildeReplacement;
  updateTildeReplacementButton();
  saveGlobalSettings();
});

preventUsedImageDeletionCheckbox.addEventListener('change', () => {
    globalSettings.preventUsedImageDeletion = preventUsedImageDeletionCheckbox.checked;
    saveGlobalSettings();
});

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
      await saveNote(newNote);
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
      newNotes.forEach(async (note, index) => {
        note.metadata.lastModified = now + index;
        notes.push(note);
        await saveNote(note);
      });
      
    }
    sortNotes();
    renderNoteList();
  } catch (error) {
    console.error('Error importing file:', error);
    alert('Failed to import file. It may be corrupted or in the wrong format.');
  }

  globalImportInput.value = '';
});

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
      await saveNote(note);
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
    goBack();
  }
});

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (globalSettings.mode === 'system') {
        applyMode('system');
    }
});

document.addEventListener('click', (e) => {
    if (imageManagementView.style.display === 'block') {
        const openDropdown = document.querySelector('.notes-dropdown');
        if (openDropdown && !e.target.closest('.usage-icon')) {
            openDropdown.remove();
        }
    }
});
