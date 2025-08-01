let activeNoteId = null;
let originalNoteContent = '';
let isPreview = false;

/**
 * Renders the list of notes.
 */
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

/**
 * Opens a note in the editor.
 * @param {string} noteId The ID of the note to open.
 * @param {boolean} inEditMode Whether to open the note in edit mode.
 * @param {boolean} addToHistory Whether to add this action to the history.
 */
function openNote(noteId, inEditMode = false, addToHistory = true) {
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
    showEditorView(false);
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
    if (addToHistory) {
        pushToHistory({ view: 'editor', params: { noteId, inEditMode } });
    }
  }
}

/**
 * Shows the list view.
 * @param {boolean} addToHistory Whether to add this action to the history.
 */
function showListView(addToHistory = true) {
  activeNoteId = null;
  listView.style.display = 'block';
  editorView.style.display = 'none';
  settingsView.style.display = 'none';
  recycleBinView.style.display = 'none';
  imageManagementView.style.display = 'none';
  licenseView.style.display = 'none';
  if (addToHistory) {
    clearHistory();
    pushToHistory({ view: 'list' });
  }
  renderNoteList();
}

/**
 * Shows the editor view.
 * @param {boolean} addToHistory Whether to add this action to the history.
 */
function showEditorView(addToHistory = true) {
  listView.style.display = 'none';
  editorView.style.display = 'block';
  settingsView.style.display = 'none';
  recycleBinView.style.display = 'none';
  imageManagementView.style.display = 'none';
  licenseView.style.display = 'none';
  if (addToHistory) {
    pushToHistory({ view: 'editor', params: { noteId: activeNoteId, isPreview } });
  }
}

/**
 * Shows the settings view.
 * @param {boolean} addToHistory Whether to add this action to the history.
 */
function showSettingsView(addToHistory = true) {
  listView.style.display = 'none';
  editorView.style.display = 'none';
  settingsView.style.display = 'block';
  licenseView.style.display = 'none';
  recycleBinView.style.display = 'none';
  imageManagementView.style.display = 'none';
  if (addToHistory) {
    pushToHistory({ view: 'settings', params: { isGlobal: isGlobalSettings, noteId: activeNoteId } });
  }
}

/**
 * Shows the license view.
 * @param {boolean} addToHistory Whether to add this action to the history.
 */
function showLicenseView(addToHistory = true) {
  listView.style.display = 'none';
  editorView.style.display = 'none';
  settingsView.style.display = 'none';
  licenseView.style.display = 'block';
  recycleBinView.style.display = 'none';
  imageManagementView.style.display = 'none';
  if (addToHistory) {
    pushToHistory({ view: 'license' });
  }
}

/**
 * Shows the recycle bin view.
 * @param {boolean} addToHistory Whether to add this action to the history.
 */
function showRecycleBinView(addToHistory = true) {
  listView.style.display = 'none';
  editorView.style.display = 'none';
  settingsView.style.display = 'none';
  licenseView.style.display = 'none';
  recycleBinView.style.display = 'block';
  imageManagementView.style.display = 'none';
  if (addToHistory) {
    pushToHistory({ view: 'recycleBin' });
  }
  renderDeletedItemsList();
}

/**
 * Shows the image management view.
 * @param {boolean} addToHistory Whether to add this action to the history.
 */
function showImageManagementView(addToHistory = true) {
  listView.style.display = 'none';
  editorView.style.display = 'none';
  settingsView.style.display = 'none';
  licenseView.style.display = 'none';
  recycleBinView.style.display = 'none';
  imageManagementView.style.display = 'block';
  if (addToHistory) {
    pushToHistory({ view: 'imageManagement' });
  }
  renderImagesList();
}

/**
 * Renders the list of deleted items.
 */
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

/**
 * Renders the markdown content as HTML.
 */
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
    // block(<code>)의 텍스트 컨텐츠를 가져와 줄바꿈(\n)으로 분리하여 줄 수를 계산합니다。
    const lineCount = block.textContent.split('\n').length;
    // 줄 수에 따라 부모 요소인 <pre> 태그에 클래스를 추가합니다。
    if (lineCount === 2) {
      block.parentElement.classList.add('single-line-code');
    } else {
      block.parentElement.classList.add('multi-line-code');
    }

    // 기존 라인 넘버 기능은 그대로 호출합니다。
    hljs.lineNumbersBlock(block);
  });
  hljs.highlightAll();

  renderImages();
}

/**
 * Renders images in the preview.
 */
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

/**
 * Toggles between the editor and preview modes.
 */
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
  pushToHistory({ view: 'editor', params: { noteId: activeNoteId, inEditMode: !isPreview } });
}

/**
 * Shows an image in a modal.
 * @param {string} blobUrl The blob URL of the image to show.
 */
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
  
  modalImg.onload = () => {
      const naturalWidth = modalImg.naturalWidth;
      const naturalHeight = modalImg.naturalHeight;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const paddingPercent = 0.1; // 10% padding
      const availableWidth = viewportWidth * (1 - 2 * paddingPercent);
      const availableHeight = viewportHeight * (1 - 2 * paddingPercent);
      
      const setZoomState = (state) => {
          if (state === 0) { // Fit with 10% L/R padding, minimum 10% T/B padding
              modal.style.justifyContent = 'center';
              modal.style.alignItems = 'center';
              modal.style.overflow = 'auto';
              modalImg.style.cursor = 'zoom-in';
              
              // Try to fit to width with 10% left/right margins
              const scaleWidth = availableWidth / naturalWidth;
              const scaledHeight = naturalHeight * scaleWidth;
              
              // Check if scaled height fits within available height (10% top/bottom margins)
              let finalScale;
              if (scaledHeight <= availableHeight) {
                  // Image fits with width-based scaling
                  finalScale = scaleWidth;
              } else {
                  // Image is too tall, scale down to maintain 10% top/bottom margins
                  finalScale = availableHeight / naturalHeight;
              }
              
              modalImg.style.width = (naturalWidth * finalScale) + 'px';
              modalImg.style.height = (naturalHeight * finalScale) + 'px';
              modalImg.style.maxWidth = 'none';
              modalImg.style.maxHeight = 'none';
          } else { // state === 1, Enlarge with 10% padding on all sides
              modal.style.overflow = 'auto';
              modalImg.style.cursor = 'zoom-out';
              
              // Calculate scale to fit with 10% margins on all sides
              const scaleWidth = availableWidth / naturalWidth;
              const scaleHeight = availableHeight / naturalHeight;
              const scale = Math.min(scaleWidth, scaleHeight);
              
              // For small images: scale up to use available space with 10% margins
              // For large images: show at natural size (never scale down below 1.0)
              const finalScale = Math.max(1.0, scale);
              
              const finalWidth = naturalWidth * finalScale;
              const finalHeight = naturalHeight * finalScale;
              
              // If scaled image fits within available space: center it
              // If scaled image is larger: align to top-left for proper scrolling
              if (finalWidth <= availableWidth && finalHeight <= availableHeight) {
                  modal.style.justifyContent = 'center';
                  modal.style.alignItems = 'center';
              } else {
                  modal.style.justifyContent = 'flex-start';
                  modal.style.alignItems = 'flex-start';
              }
              
              modalImg.style.width = finalWidth + 'px';
              modalImg.style.height = finalHeight + 'px';
              modalImg.style.maxWidth = 'none';
              modalImg.style.maxHeight = 'none';
          }
      };

      setZoomState(zoomState);
      
      modalImg.onclick = () => {
          zoomState = (zoomState + 1) % 2;
          setZoomState(zoomState);
      };
  };

  modal.appendChild(modalImg);
  document.body.appendChild(modal);
}

/**
 * Renders the list of images.
 */
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
      
      // Add click handler for image title dropdown
      imageName.onclick = (e) => {
        e.stopPropagation();
        const currentTarget = e.currentTarget;
        const isAlreadyOpen = currentTarget.querySelector('.image-title-dropdown');

        // Close all dropdowns (both image title and notes dropdowns)
        const allImageDropdowns = document.querySelectorAll('.image-title-dropdown');
        const allNotesDropdowns = document.querySelectorAll('.notes-dropdown');
        allImageDropdowns.forEach(d => d.remove());
        allNotesDropdowns.forEach(d => d.remove());

        if (!isAlreadyOpen) {
          // Create and show the new dropdown
          const dropdown = document.createElement('div');
          dropdown.classList.add('image-title-dropdown');
          
          // Close dropdown when clicking on empty area of dropdown
          dropdown.onclick = (e) => {
            if (e.target === dropdown) {
              dropdown.remove();
            }
          };
          
          const copyMarkdownItem = document.createElement('div');
          copyMarkdownItem.textContent = 'Copy Image Markdown';
          copyMarkdownItem.onclick = async (e) => {
            e.stopPropagation();
            const markdownText = `![Image](images/${imageId}.png)`;
            try {
              await navigator.clipboard.writeText(markdownText);
              dropdown.remove();
            } catch (err) {
              console.error('Failed to copy to clipboard:', err);
              // Fallback for older browsers
              const textArea = document.createElement('textarea');
              textArea.value = markdownText;
              document.body.appendChild(textArea);
              textArea.select();
              document.execCommand('copy');
              document.body.removeChild(textArea);
              dropdown.remove();
            }
          };
          
          dropdown.appendChild(copyMarkdownItem);
          currentTarget.appendChild(dropdown);
        }
      };
      
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
          const currentTarget = e.currentTarget;
          const isAlreadyOpen = currentTarget.querySelector('.notes-dropdown');

          // Close all dropdowns (both notes and image title dropdowns)
          const allNotesDropdowns = document.querySelectorAll('.notes-dropdown');
          const allImageDropdowns = document.querySelectorAll('.image-title-dropdown');
          allNotesDropdowns.forEach(d => d.remove());
          allImageDropdowns.forEach(d => d.remove());

          if (!isAlreadyOpen) {
            // Create and show the new dropdown.
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
            currentTarget.appendChild(dropdown);
          }
        };
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
