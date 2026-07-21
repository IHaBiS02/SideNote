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
import { resolveEffectiveSettings, resolveLegacyTextProcessingSettings } from '../settings.js';
import {
  processPastedText,
  handleEnterKeyInput,
  toggleMarkdownCheckbox
} from '../text-processors.js';

// Import state from state module
import {
  notes,
  globalSettings,
  activeNoteId,
  isPreview,
  setIsPreview
} from '../state.js';
import type { WysiwygMarkdownElement } from '../../packages/wysiwyg-markdown/src/index.js';

// === Editor utility functions ===

// Insert text at cursor position (replaces deprecated document.execCommand)
function insertTextAtCursor(
  editor: HTMLTextAreaElement | WysiwygMarkdownElement,
  text: string,
): void {
  if ('replaceSelection' in editor && typeof editor.replaceSelection === 'function') {
    editor.replaceSelection(text);
    return;
  }
  if (!(editor instanceof HTMLTextAreaElement)) return;

  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const value = editor.value;
  
  // Insert text
  editor.value = value.substring(0, start) + text + value.substring(end);
  
  // Adjust cursor position
  editor.selectionStart = editor.selectionEnd = start + text.length;
  
  // Trigger input event (for auto-save etc.)
  editor.dispatchEvent(new Event('input', { bubbles: true }));
}

// === Editor Event Listeners ===

function initializeEditorEvents(): void {
  // A double-click in editable or read-only Preview opens the full source editor.
  markdownEditor.addEventListener('mode-change', (event) => {
    const mode = (event as CustomEvent<{ mode?: string }>).detail?.mode;
    if (mode !== 'source' && mode !== 'wysiwyg' && mode !== 'readonly') return;

    const nextIsPreview = mode !== 'source';
    if (nextIsPreview === isPreview) return;

    setIsPreview(nextIsPreview);
    toggleViewButton.textContent = nextIsPreview ? 'Edit' : 'Preview';
    pushToHistory({
      view: 'editor',
      params: { noteId: activeNoteId, inEditMode: !nextIsPreview }
    });
  });

  // New note creation
  newNoteButton.addEventListener('click', async () => {
    const now = Date.now();
    const newNote = {
      id: crypto.randomUUID(),
      title: 'New Note',
      content: '',
      settings: {},
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
    openNote(noteId, inEditMode, false);  // Open directly in editable WYSIWYG Preview
  });

  // Markdown editor input event (auto-save)
  markdownEditor.addEventListener('input', async () => {
    const note = notes.find(n => n.id === activeNoteId);
    if (note) {
      note.content = markdownEditor.value;
      note.metadata.lastModified = Date.now();
      const titleSource = resolveEffectiveSettings(note).title;
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

  // Legacy textarea paste path. The WYSIWYG editor handles this through its adapter.
  if (typeof markdownEditor.replaceSelection !== 'function') {
    markdownEditor.addEventListener('paste', async (e) => {
      const clipboardEvent = e as ClipboardEvent;
      e.preventDefault();

      const items = Array.from(clipboardEvent.clipboardData?.items ?? []);
      const imageItem = items.find(item => item.kind === 'file' && item.type.startsWith('image/'));

      // Handle image paste
      if (imageItem) {
        const imageFile = imageItem.getAsFile();
        if (!imageFile) return;
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
        const rawText = clipboardEvent.clipboardData?.getData('text/plain') ?? '';
        const processedText = processPastedText(rawText, resolveLegacyTextProcessingSettings(globalSettings));
        insertTextAtCursor(markdownEditor, processedText);
      }
    });
  }

  // Toggle preview button
  toggleViewButton.addEventListener('click', togglePreview);

  // Keyboard shortcuts
  markdownEditor.addEventListener('keydown', (e) => {
    // Auto add two spaces at end of line when pressing Enter
    if (typeof markdownEditor.replaceSelection !== 'function' &&
        e.key === 'Enter' && !e.isComposing && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
      const result = handleEnterKeyInput(
        markdownEditor as unknown as HTMLTextAreaElement,
        resolveLegacyTextProcessingSettings(globalSettings),
        insertTextAtCursor,
      );
      if (result.handled) {
        e.preventDefault();
      }
    }

    // WYSIWYG owns Shift+Enter as an inline soft break. Keep the legacy
    // preview shortcut only for the full-document source editor.
    if (e.shiftKey && e.key === 'Enter' && markdownEditor.mode !== 'wysiwyg') {
      e.preventDefault();
      togglePreview();
    }
  });

  // Preview area click events
  htmlPreview.addEventListener('click', async (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    // Handle checkbox clicks
    if (target instanceof HTMLInputElement && target.type === 'checkbox') {
      const checkboxes = Array.from(htmlPreview.querySelectorAll('input[type="checkbox"]'));
      const checkboxIndex = checkboxes.indexOf(target);

      const newMarkdown = toggleMarkdownCheckbox(markdownEditor.value, checkboxIndex);
      if (newMarkdown !== null) {
        markdownEditor.value = newMarkdown;

        // Trigger update and save
        const note = notes.find(n => n.id === activeNoteId);
        if (note) {
          note.content = markdownEditor.value;
          note.metadata.lastModified = Date.now();
          sortNotes();
          await saveNote(note);
          renderMarkdown();
          renderNoteList();
        }
      }
    } else if (target instanceof HTMLImageElement) {
      // Show image modal when clicking on images
      showImageModal(target.src);
    }
  });

  // Double-click on title to edit
  editorTitle.addEventListener('dblclick', () => {
    const note = notes.find(n => n.id === activeNoteId);
    if (note) {
      note.settings = note.settings || {};
      let titleSource = resolveEffectiveSettings(note).title;
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

        const finishEditing = async (): Promise<void> => {
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

        const handleKeyDown = (e: KeyboardEvent): void => {
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
