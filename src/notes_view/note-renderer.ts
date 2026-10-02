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
import { createFolder, renameFolder, toggleItemPin, trashItem, reorderItems, moveItems, visibleItems, currentTree } from '../folders.js';
import { isFolder, planMove } from '../folder-model.js';
import { currentFolderId, setCurrentFolderId, folders } from '../state.js';
import { createDropdown } from '../ui-helpers.js';
import type { ListItem } from '../types.js';
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
import { showEditorView, showListView } from './view-manager.js';
import { applyEditorDisplayMode } from './editor-mode.js';

/**
 * Renders the list of notes.
 */
// === 노트 목록 렌더링 ===

let pinnedNoteDragController: PinnedNoteDragController | null = null;
let noteListClickInitialized = false;
const selectedIds = new Set<string>();
let anchorId: string | null = null;
let selectionParent: string | null = null;
let busy = false;

function clearSelection(): void { selectedIds.clear(); anchorId = null; }
function paintSelection(): void {
  for (const row of noteList.querySelectorAll<HTMLElement>('li[data-note-id]')) {
    const selected = selectedIds.has(row.dataset.noteId!);
    row.classList.toggle('item-selected', selected);
    row.setAttribute('aria-selected', String(selected));
  }
  const status = document.getElementById('folder-status');
  if (status) status.textContent = selectedIds.size ? `${selectedIds.size} selected` : '';
}
async function runListAction(action: () => Promise<void>): Promise<void> {
  if (busy) return;
  busy = true;
  try { await action(); clearSelection(); }
  catch (error) { console.error(error); alert(error instanceof Error ? error.message : 'Could not update items'); }
  finally { busy = false; renderNoteList(); }
}
function openFolder(id: string | null): void {
  clearSelection(); setCurrentFolderId(id); showListView();
}
function createNoteListItem(note: ListItem): HTMLLIElement {
  const li = document.createElement('li');
  li.dataset.noteId = note.id;
  li.dataset.kind = isFolder(note) ? 'folder' : 'note';
  li.dataset.pinned = String(note.isPinned);
  li.tabIndex = 0;
  li.setAttribute('role', 'option');
  li.title = note.isPinned ? 'Hold and drag to reorder or move into a pinned folder' : 'Hold and drag into an unpinned folder';
  const titleSpan = document.createElement('span');
  titleSpan.className = 'item-title';
  titleSpan.textContent = `${isFolder(note) ? '📁 ' : ''}${note.title}`;
  li.appendChild(titleSpan);
  const controls = document.createElement('div');
  controls.className = 'button-container';
  for (const [className, label, text] of [
    ['pin-note-icon', note.isPinned ? 'Unpin Item' : 'Pin Item', note.isPinned ? '📌' : '📎'],
    ['delete-note-icon', isFolder(note) ? 'Delete Folder and Contents' : 'Delete Note', '🗑️'],
  ]) {
    const button = document.createElement('button');
    button.className = className; button.title = label; button.setAttribute('aria-label', label);
    button.textContent = text; controls.appendChild(button);
  }
  li.appendChild(controls);
  return li;
}

function editFolderTitle(): void {
  const heading = document.getElementById('notes-list-title');
  const folder = folders.find(item => item.id === currentFolderId && !item.metadata.deletedAt);
  if (!heading || !folder || busy || heading.querySelector('input')) return;
  clearSelection(); paintSelection();
  const input = document.createElement('input');
  input.type = 'text';
  input.id = 'folder-title-input';
  input.className = 'title-input';
  input.setAttribute('aria-label', 'Folder name');
  input.value = folder.title;
  let finished = false;
  const finish = (): void => {
    if (finished) return;
    finished = true;
    const name = input.value.trim();
    heading.textContent = folder.title;
    if (name && name !== folder.title) void runListAction(() => renameFolder(folder.id, name));
  };
  input.addEventListener('keydown', event => {
    if (event.isComposing) return;
    if (event.key === 'Enter' || event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      finish();
    }
  });
  input.addEventListener('blur', finish);
  heading.replaceChildren(input);
  input.focus();
  input.select();
}

function initializeNoteListClickDelegation(): void {
  if (noteListClickInitialized) return;
  noteListClickInitialized = true;
  document.getElementById('notes-list-title')?.addEventListener('dblclick', editFolderTitle);
  noteList.setAttribute('role', 'listbox');
  noteList.setAttribute('aria-multiselectable', 'true');
  noteList.setAttribute('aria-label', 'Notes and folders');
  document.getElementById('folder-back-button')?.addEventListener('click', () => {
    if (!busy) openFolder(folders.find(f => f.id === currentFolderId)?.parentId ?? null);
  });
  document.getElementById('new-note-button')?.addEventListener('contextmenu', event => {
    event.preventDefault();
    createDropdown({ className: 'folder-create-menu', populate: menu => {
      const button = document.createElement('button');
      button.textContent = 'Create Folder';
      button.onclick = () => {
        menu.remove();
        void runListAction(() => createFolder('New Folder'));
      };
      menu.appendChild(button);
    } });
  });
  noteList.addEventListener('keydown', event => {
    if ((event.key === 'Enter' || event.key === ' ') && event.target instanceof HTMLElement && event.target.matches('li[data-note-id]')) {
      event.preventDefault(); event.target.click();
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && selectedIds.size) {
      event.preventDefault(); event.stopImmediatePropagation(); clearSelection(); paintSelection();
    }
  }, true);
  noteList.addEventListener('click', async event => {
    if (busy || !(event.target instanceof Element)) return;
    const row = event.target.closest<HTMLElement>('li[data-note-id]');
    const item = visibleItems().find(i => i.id === row?.dataset.noteId);
    if (!item) return;
    if (event.ctrlKey || event.metaKey || event.shiftKey) {
      const items = visibleItems();
      const first = items.find(i => selectedIds.has(i.id));
      if (first && first.isPinned !== item.isPinned) return;
      if (event.shiftKey && anchorId) {
        const start = items.findIndex(i => i.id === anchorId);
        const end = items.indexOf(item);
        if (start >= 0) for (const entry of items.slice(Math.min(start, end), Math.max(start, end) + 1)) {
          if (entry.isPinned === item.isPinned) selectedIds.add(entry.id);
        }
      } else {
        if (selectedIds.has(item.id)) selectedIds.delete(item.id);
        else selectedIds.add(item.id);
        anchorId = item.id;
      }
      if (!selectedIds.size) anchorId = null;
      paintSelection(); return;
    }
    if (event.target.closest('.pin-note-icon')) { await runListAction(() => toggleItemPin(item.id)); return; }
    if (event.target.closest('.delete-note-icon')) { await runListAction(() => trashItem(item.id)); return; }
    clearSelection(); paintSelection();
    if (isFolder(item)) openFolder(item.id);
    else await openNote(item.id);
  });
}

function renderNoteList(): void {
  initializeNoteListClickDelegation();
  pinnedNoteDragController?.destroy();
  pinnedNoteDragController = null;
  if (currentFolderId && !folders.some(f => f.id === currentFolderId && !f.metadata.deletedAt)) setCurrentFolderId(null);
  if (selectionParent !== currentFolderId) { clearSelection(); selectionParent = currentFolderId; }
  const items = visibleItems();
  for (const id of selectedIds) if (!items.some(i => i.id === id)) selectedIds.delete(id);
  const fragment = document.createDocumentFragment();
  items.forEach(item => fragment.appendChild(createNoteListItem(item)));
  noteList.replaceChildren(fragment);
  const back = document.getElementById('folder-back-button');
  if (back) back.hidden = currentFolderId === null;
  const heading = document.getElementById('notes-list-title');
  const path: string[] = [];
  let folder = folders.find(f => f.id === currentFolderId);
  const seen = new Set<string>();
  while (folder && !seen.has(folder.id)) {
    seen.add(folder.id); path.unshift(folder.title); folder = folders.find(f => f.id === folder!.parentId);
  }
  if (heading) {
    heading.textContent = path.at(-1) ?? 'Notes';
    heading.title = currentFolderId ? 'Double-click to rename folder' : 'Notes';
  }
  const breadcrumb = document.getElementById('folder-path');
  if (breadcrumb) { breadcrumb.textContent = path.length ? ['Notes', ...path].join(' / ') : ''; breadcrumb.hidden = !path.length; }
  paintSelection();
  pinnedNoteDragController = createPinnedNoteDragController(noteList,
    ids => runListAction(() => reorderItems(ids)), {
      longPressDelayMs: normalizeGlobalSettings(globalSettings).pinnedNoteDragDelayMs,
      getDragIds: id => {
        if (busy) return [];
        if (!selectedIds.has(id)) { clearSelection(); selectedIds.add(id); anchorId = id; paintSelection(); }
        return items.filter(i => selectedIds.has(i.id)).map(i => i.id);
      },
      upTarget: currentFolderId ? document.getElementById('folder-header') : null,
      canDrop: (ids, target) => {
        try { planMove(structuredClone(currentTree()), ids, currentFolderId, target); return true; }
        catch { return false; }
      },
      onDrop: (ids, target) => runListAction(() => moveItems(ids, target)),
    });
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
    setCurrentFolderId(note.parentId ?? null);
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
