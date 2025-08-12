// Import DOM elements for editor
import {
  newNoteButton,
  editorTitle,
  markdownEditor,
  htmlPreview,
  toggleViewButton
} from '../dom.js';

// Import functions from other modules
import { sortNotes } from '../notes.js';
import { 
  openNote,
  renderMarkdown,
  togglePreview,
  showImageModal,
  renderNoteList
} from '../notes_view/index.js';
import { saveNote, saveImage } from '../database/index.js';
import { pushToHistory } from '../history.js';
import { extractImageIds } from '../utils.js';
import { 
  processPastedText, 
  handleEnterKeyInput 
} from '../text-processors.js';

// Import state from state module
import {
  notes,
  globalSettings,
  activeNoteId,
  setActiveNoteId,
  setOriginalNoteContent
} from '../state.js';

// === Editor utility functions ===

// Insert text at cursor position (replaces deprecated document.execCommand)
function insertTextAtCursor(textarea, text) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const value = textarea.value;
  
  // Insert text
  textarea.value = value.substring(0, start) + text + value.substring(end);
  
  // Adjust cursor position
  textarea.selectionStart = textarea.selectionEnd = start + text.length;
  
  // Trigger input event (for auto-save etc.)
  textarea.dispatchEvent(new Event('input', { bubbles: true }));
}

// === Editor Event Listeners ===

function initializeEditorEvents() {
  // New note creation
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
    notes.push(newNote);  // Add to notes array
    sortNotes();  // Sort to proper position (pinned notes first, then by lastModified)
    await saveNote(newNote);
    const inEditMode = false;
    const noteId = newNote.id;
    pushToHistory({ view: 'editor', params: { noteId, inEditMode } });
    openNote(noteId, true);  // Open in edit mode
  });

  // Markdown editor input event (auto-save)
  markdownEditor.addEventListener('input', async () => {
    const note = notes.find(n => n.id === activeNoteId);
    if (note) {
      note.content = markdownEditor.value;
      note.metadata.lastModified = Date.now();
      const titleSource = note.settings.title || globalSettings.title;
      let titleChanged = false;
      // Use first line as title when default title setting is used
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

  // Paste event (handles images and text)
  markdownEditor.addEventListener('paste', async (e) => {
    e.preventDefault();

    const items = Array.from(e.clipboardData.items);
    const imageItem = items.find(item => item.kind === 'file' && item.type.startsWith('image/'));

    // Handle image paste
    if (imageItem) {
      const imageFile = imageItem.getAsFile();
      const imageId = crypto.randomUUID();
      
      try {
        await saveImage(imageId, imageFile);
        const markdownImageText = `![Image](images/${imageId}.png)`;
        insertTextAtCursor(markdownEditor, markdownImageText);
      } catch (err) {
        console.error('Failed to save image:', err);
        return; 
      }
    } else {
      // Handle text paste
      const rawText = e.clipboardData.getData('text/plain');
      const processedText = processPastedText(rawText, globalSettings);
      insertTextAtCursor(markdownEditor, processedText);
    }
  });

  // Toggle preview button
  toggleViewButton.addEventListener('click', togglePreview);

  // Keyboard shortcuts
  markdownEditor.addEventListener('keydown', (e) => {
    // Auto add two spaces at end of line when pressing Enter
    if (e.key === 'Enter' && !e.isComposing && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
      const result = handleEnterKeyInput(markdownEditor, globalSettings, insertTextAtCursor);
      if (result.handled) {
        e.preventDefault();
      }
    }

    // Shift+Enter to toggle preview
    if (e.shiftKey && e.key === 'Enter') {
      e.preventDefault();
      togglePreview();
    }
  });

  // Double-click on preview to toggle edit mode
  htmlPreview.addEventListener('dblclick', togglePreview);

  // Preview area click events
  htmlPreview.addEventListener('click', async (e) => {
    // Handle checkbox clicks
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
      // Show image modal when clicking on images
      showImageModal(e.target.src);
    }
  });

  // Double-click on title to edit
  editorTitle.addEventListener('dblclick', () => {
    const note = notes.find(n => n.id === activeNoteId);
    if (note) {
      let titleSource = note.settings.title || globalSettings.title;
      // Change from default to custom title when double-clicking
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
}

// Export functions
export {
  insertTextAtCursor,
  initializeEditorEvents
};