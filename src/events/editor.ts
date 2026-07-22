import {
  newNoteButton,
  editorTitle,
  markdownEditor,
  toggleViewButton
} from '../dom.js';

import { sortNotes } from '../notes.js';
import {
  openNote,
  togglePreview,
  showImageModal,
  renderNoteList
} from '../notes_view/index.js';
import { saveNote } from '../database/index.js';
import { pushToHistory } from '../history.js';
import { resolveEffectiveSettings } from '../settings.js';

import {
  notes,
  activeNoteId,
  isPreview,
  setIsPreview
} from '../state.js';
import type { WysiwygMarkdownImageActivateDetail } from '../../packages/wysiwyg-markdown/src/index.js';

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
    notes.push(newNote);
    sortNotes();
    await saveNote(newNote);
    const inEditMode = false;
    const noteId = newNote.id;
    pushToHistory({ view: 'editor', params: { noteId, inEditMode } });
    openNote(noteId, inEditMode, false);
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

  // Toggle preview button
  toggleViewButton.addEventListener('click', togglePreview);

  // Keyboard shortcuts
  markdownEditor.addEventListener('keydown', (e) => {
    // WYSIWYG owns Shift+Enter as an inline soft break. Keep the legacy
    // preview shortcut only for the full-document source editor.
    if (e.shiftKey && e.key === 'Enter' && markdownEditor.mode === 'source') {
      e.preventDefault();
      togglePreview();
    }
  });

  markdownEditor.addEventListener('image-activate', (event) => {
    const { displaySource } = (
      event as CustomEvent<WysiwygMarkdownImageActivateDetail>
    ).detail;
    if (displaySource) showImageModal(displaySource);
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
            void finishEditing();
          } else if (e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
            void finishEditing();
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

export {
  initializeEditorEvents
};
