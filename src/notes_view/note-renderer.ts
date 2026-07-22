// Import required DOM elements
import {
  noteList,
  markdownEditor,
  editorTitle
} from '../dom.js';

// Import required functions from other modules
import { 
  togglePin, 
  deleteNote,
  reorderPinnedNotes,
} from '../notes.js';
import {
  createPinnedNoteDragController,
} from './pinned-note-drag.js';
import type {
  PinnedNoteDragController,
} from './pinned-note-drag.js';

import { 
  applyFontSize,
  applyLineHeightSettings,
  isCodeBlockHeaderEnabled,
  normalizeGlobalSettings,
  resolveEffectiveSettings,
  updateLegacyLineBreakControls,
  updateTildeReplacementButton 
} from '../settings.js';

import { pushToHistory } from '../history.js';

// Import state from state module
import { 
  notes, 
  globalSettings,
  activeNoteId, 
  setActiveNoteId,
  setOriginalNoteContent,
  setIsPreview
} from '../state.js';

// Import view manager functions
import { showEditorView } from './view-manager.js';
import { applyEditorDisplayMode } from './editor-mode.js';

/**
 * Renders the list of notes.
 */
// === 노트 목록 렌더링 ===

let pinnedNoteDragController: PinnedNoteDragController | null = null;

function renderNoteList(): void {
  pinnedNoteDragController?.destroy();
  pinnedNoteDragController = null;
  noteList.innerHTML = '';
  if (!Array.isArray(notes)) return;
  notes.forEach(note => {
    const li = document.createElement('li');
    li.dataset.noteId = note.id;
    li.dataset.pinned = note.isPinned ? 'true' : 'false';
    if (note.isPinned) li.title = 'Hold and drag to reorder pinned notes';
    li.addEventListener('click', () => openNote(note.id));

    const titleSpan = document.createElement('span');
    titleSpan.textContent = note.title;

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');

    const pinSpan = document.createElement('span');
    pinSpan.textContent = note.isPinned ? '📌' : '📎';
    pinSpan.title = note.isPinned ? 'Unpin Note' : 'Pin Note';
    pinSpan.classList.add('pin-note-icon');
    pinSpan.addEventListener('click', async (e) => {
        e.stopPropagation();
        await togglePin(note.id);
        renderNoteList();
    });

    const deleteSpan = document.createElement('span');
    deleteSpan.textContent = '🗑️';
    deleteSpan.title = 'Delete Note';
    deleteSpan.classList.add('delete-note-icon');
    deleteSpan.addEventListener('click', async (e) => {
      e.stopPropagation();
      await deleteNote(note.id);
      renderNoteList();
    });

    li.appendChild(titleSpan);
    buttonContainer.appendChild(pinSpan);
    buttonContainer.appendChild(deleteSpan);
    li.appendChild(buttonContainer);
    noteList.appendChild(li);
  });

  pinnedNoteDragController = createPinnedNoteDragController(
    noteList,
    async (orderedNoteIds) => {
      if (await reorderPinnedNotes(orderedNoteIds)) renderNoteList();
    },
    {
      longPressDelayMs: normalizeGlobalSettings(globalSettings)
        .pinnedNoteDragDelayMs,
    },
  );
}

/**
 * Opens a note in the editor.
 * @param {string} noteId The ID of the note to open.
 * @param {boolean} inEditMode Whether to open the note in edit mode.
 * @param {boolean} addToHistory Whether to add this action to the history.
 */
// === 노트 열기 및 편집 ===

function openNote(
  noteId: string,
  inEditMode = false,
  addToHistory = true,
): void {
  const note = notes.find(n => n.id === noteId);
  if (note) {
    setActiveNoteId(noteId);
    setOriginalNoteContent(note.content); // 원본 내용 저장 (변경 감지용)
    editorTitle.textContent = note.title;
    markdownEditor.value = note.content;
    markdownEditor.showCodeBlockHeader = isCodeBlockHeaderEnabled(note);
    // 노트 설정 적용 (폰트 크기, 줄 간격 등)
    const effectiveSettings = resolveEffectiveSettings(note);
    applyFontSize(effectiveSettings.fontSize);
    applyLineHeightSettings(effectiveSettings);
    updateLegacyLineBreakControls();
    updateTildeReplacementButton();
    showEditorView(false);
    // 모드 설정 (편집/미리보기)
    setIsPreview(!inEditMode);
    applyEditorDisplayMode();
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
