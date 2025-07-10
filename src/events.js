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
    saveNotes();
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
      }
      else {
        togglePreview();
      }
    }
  }
});

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (globalSettings.mode === 'system') {
        applyMode('system');
    }
});