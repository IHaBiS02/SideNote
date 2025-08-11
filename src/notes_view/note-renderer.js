// Import required DOM elements
import {
  noteList,
  markdownEditor,
  htmlPreview,
  toggleViewButton,
  editorTitle
} from '../dom.js';

// Import required functions from other modules
import { 
  togglePin, 
  deleteNote
} from '../notes.js';

import { 
  applyFontSize,
  updateAutoLineBreakButton,
  updateTildeReplacementButton 
} from '../settings.js';

import { pushToHistory } from '../history.js';

// Import state from state module
import { 
  notes, 
  globalSettings, 
  activeNoteId, 
  isPreview,
  setActiveNoteId,
  setOriginalNoteContent,
  setIsPreview
} from '../state.js';

// Import view manager functions
import { showEditorView } from './view-manager.js';
import { renderMarkdown } from './markdown-renderer.js';

/**
 * Renders the list of notes.
 */
// === 노트 목록 렌더링 ===

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
// === 노트 열기 및 편집 ===

function openNote(noteId, inEditMode = false, addToHistory = true) {
  const note = notes.find(n => n.id === noteId);
  if (note) {
    setActiveNoteId(noteId);
    setOriginalNoteContent(note.content); // 원본 내용 저장 (변경 감지용)
    editorTitle.textContent = note.title;
    markdownEditor.value = note.content;
    // 노트 설정 적용 (폰트 크기 등)
    const fontSize = note.settings.fontSize || globalSettings.fontSize || 12;
    applyFontSize(fontSize);
    updateAutoLineBreakButton();
    updateTildeReplacementButton();
    renderMarkdown();
    showEditorView(false);
    // 모드 설정 (편집/미리보기)
    setIsPreview(!inEditMode);
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

// Export functions
export {
  renderNoteList,
  openNote
};