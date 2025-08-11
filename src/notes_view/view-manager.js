// Import required DOM elements
import {
  listView,
  editorView,
  settingsView,
  licenseView,
  recycleBinView,
  imageManagementView
} from '../dom.js';

// Import required functions from other modules
import { pushToHistory, clearHistory } from '../history.js';

// Import state from state module
import {
  isGlobalSettings,
  activeNoteId,
  isPreview,
  setActiveNoteId
} from '../state.js';

// Import render functions that will be needed
import { renderNoteList } from './note-renderer.js';
import { renderDeletedItemsList } from './recycle-bin-renderer.js';
import { renderImagesList } from './image-manager.js';

// === 뷰 전환 함수들 ===

/**
 * Shows the list view.
 * @param {boolean} addToHistory Whether to add this action to the history.
 */
function showListView(addToHistory = true) {
  setActiveNoteId(null);
  // 모든 뷰 숨기고 노트 목록만 표시
  listView.style.display = 'block';
  editorView.style.display = 'none';
  settingsView.style.display = 'none';
  recycleBinView.style.display = 'none';
  imageManagementView.style.display = 'none';
  licenseView.style.display = 'none';
  if (addToHistory) {
    clearHistory();  // 리스트 뷰로 돌아오면 히스토리 초기화
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

// Export functions
export {
  showListView,
  showEditorView,
  showSettingsView,
  showLicenseView,
  showRecycleBinView,
  showImageManagementView
};