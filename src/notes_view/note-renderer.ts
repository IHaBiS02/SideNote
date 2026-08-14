// Import required DOM elements
import {
  noteList,
  markdownEditor,
  editorTitle
} from '../dom.js';

// Import required functions from other modules
import {
  getNote,
} from '../database/index.js';
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
  hydrateNote,
  setOriginalNoteContent,
  setIsPreview
} from '../state.js';
import { isLoadedNote } from '../note-summary.js';
import type { NoteListEntry } from '../types.js';

// Import view manager functions
import { showEditorView } from './view-manager.js';
import { applyEditorDisplayMode } from './editor-mode.js';

/**
 * Renders the list of notes.
 */
// === 노트 목록 렌더링 ===

let pinnedNoteDragController: PinnedNoteDragController | null = null;
let noteListClickInitialized = false;

function createNoteListItem(note: NoteListEntry): HTMLLIElement {
  const li = document.createElement('li');
  li.dataset.noteId = note.id;
  li.dataset.pinned = note.isPinned ? 'true' : 'false';
  if (note.isPinned) li.title = 'Hold and drag to reorder pinned notes';

  const titleSpan = document.createElement('span');
  titleSpan.textContent = note.title;

  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('button-container');

  const pinSpan = document.createElement('span');
  pinSpan.textContent = note.isPinned ? '📌' : '📎';
  pinSpan.title = note.isPinned ? 'Unpin Note' : 'Pin Note';
  pinSpan.classList.add('pin-note-icon');

  const deleteSpan = document.createElement('span');
  deleteSpan.textContent = '🗑️';
  deleteSpan.title = 'Delete Note';
  deleteSpan.classList.add('delete-note-icon');

  li.appendChild(titleSpan);
  buttonContainer.appendChild(pinSpan);
  buttonContainer.appendChild(deleteSpan);
  li.appendChild(buttonContainer);
  return li;
}

function initializeNoteListClickDelegation(): void {
  if (noteListClickInitialized) return;
  noteListClickInitialized = true;
  noteList.addEventListener('click', async (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const row = target.closest<HTMLElement>('li[data-note-id]');
    const noteId = row?.dataset.noteId;
    if (!row || !noteId) return;

    if (target.closest('.pin-note-icon')) {
      await togglePin(noteId);
      renderNoteList();
      return;
    }
    if (target.closest('.delete-note-icon')) {
      await deleteNote(noteId);
      renderNoteList();
      return;
    }
    await openNote(noteId);
  });
}

function renderNoteList(): void {
  initializeNoteListClickDelegation();
  pinnedNoteDragController?.destroy();
  pinnedNoteDragController = null;
  if (!Array.isArray(notes)) return;
  const fragment = document.createDocumentFragment();
  notes.forEach(note => fragment.appendChild(createNoteListItem(note)));
  noteList.replaceChildren(fragment);

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

async function openNote(
  noteId: string,
  inEditMode = false,
  addToHistory = true,
): Promise<boolean> {
  const entry = notes.find(n => n.id === noteId);
  const note = isLoadedNote(entry) ? entry : await getNote(noteId);
  if (note) {
    hydrateNote(note);
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
    return true;
  }
  return false;
}

// Export functions
export {
  renderNoteList,
  openNote
};
