// Import DOM elements for navigation
import {
  backButton,
  settingsBackButton,
  licenseBackButton,
  recycleBinBackButton,
  imageManagementBackButton,
  titleSetting,
  fontSizeSetting,
  modeSetting,
  autoAddSpacesCheckbox,
  preventUsedImageDeletionCheckbox,
  markdownEditor
} from '../dom.js';

// Import functions from other modules
import { sortNotes } from '../notes.js';
import { 
  showListView,
  showEditorView,
  showSettingsView,
  showLicenseView,
  showRecycleBinView,
  showImageManagementView,
  openNote,
  renderNoteList
} from '../notes_view/index.js';
import { saveNote } from '../database.js';

// Import state from state module
import {
  notes,
  globalSettings,
  isGlobalSettings,
  activeNoteId,
  originalNoteContent,
  setActiveNoteId,
  setIsGlobalSettings
} from '../state.js';

import {
  pushToHistory,
  moveBack,
  getCurrentHistoryState,
  getHistory,
  getHistoryIndex,
  goToHistoryState
} from '../history.js';

// === Navigation utility functions ===

// Navigate to a given state (view switching)
async function navigateToState(state) {
    if (!state) {
        showListView(false);
        return;
    }

    switch (state.view) {
        case 'list':
            showListView(false);
            break;
        case 'editor':
            openNote(state.params.noteId, state.params.inEditMode, false);
            break;
        case 'settings':
            setIsGlobalSettings(state.params.isGlobal);
            if (isGlobalSettings) {
                titleSetting.value = globalSettings.title || 'default';
                fontSizeSetting.value = globalSettings.fontSize || 12;
                modeSetting.value = globalSettings.mode || 'system';
                autoAddSpacesCheckbox.checked = globalSettings.autoAddSpaces;
                preventUsedImageDeletionCheckbox.checked = globalSettings.preventUsedImageDeletion;
            } else {
                const note = notes.find(n => n.id === state.params.noteId);
                if (note) {
                    setActiveNoteId(note.id);
                    titleSetting.value = note.settings.title || 'default';
                    fontSizeSetting.value = note.settings.fontSize || globalSettings.fontSize || 12;
                    modeSetting.value = globalSettings.mode || 'system';
                    autoAddSpacesCheckbox.checked = globalSettings.autoAddSpaces;
                    preventUsedImageDeletionCheckbox.checked = globalSettings.preventUsedImageDeletion;
                } else {
                    showListView(false); // Fallback
                    return;
                }
            }
            showSettingsView(false);
            break;
        case 'license':
            showLicenseView(false);
            break;
        case 'recycleBin':
            showRecycleBinView(false);
            break;
        case 'imageManagement':
            showImageManagementView(false);
            break;
        default:
            showListView(false);
    }
}

// Go back to previous screen
async function goBack() {
    const currentState = getCurrentHistoryState();
    // If currently in editor, save changes
    if (currentState && currentState.view === 'editor') {
        const note = notes.find(n => n.id === currentState.params.noteId);
        if (note && markdownEditor.value !== originalNoteContent) {
            note.content = markdownEditor.value;
            note.metadata.lastModified = Date.now();
            sortNotes();
            await saveNote(note);
            renderNoteList();
        }
    }

    const previousState = moveBack();
    if (previousState) {
        navigateToState(previousState);

        const existingDropdown = document.querySelector('.history-dropdown');
        if (existingDropdown) {
            const currentIndex = getHistoryIndex();
            const items = existingDropdown.querySelectorAll('div');
            const history = getHistory();
            
            items.forEach((item, reversedIndex) => {
                const originalIndex = history.length - 1 - reversedIndex;
                if (originalIndex === currentIndex) {
                    item.classList.add('current-history-item');
                } else {
                    item.classList.remove('current-history-item');
                }
            });
        }
    }
}

function populateHistoryDropdown(dropdown) {
    dropdown.innerHTML = ''; // Clear existing items
    const history = getHistory();
    const currentIndex = getHistoryIndex();
    if (history.length === 0) {
        dropdown.remove();
        return;
    }

    // The history is displayed from most recent to oldest, so we reverse it for display
    [...history].reverse().forEach((state, reversedIndex) => {
        const originalIndex = history.length - 1 - reversedIndex;
        const item = document.createElement('div');
        let title = state.view;
        if (state.view === 'editor' && state.params && state.params.noteId) {
            const note = notes.find(n => n.id === state.params.noteId);
            title = note ? `Editor: ${note.title}` : 'Editor: Untitled';
        } else {
            // Capitalize first letter
            title = state.view.charAt(0).toUpperCase() + state.view.slice(1);
        }
        item.textContent = title;
        item.title = title;

        if (originalIndex === currentIndex) {
            item.classList.add('current-history-item');
        }

        item.addEventListener('click', async () => {
            const targetState = history[originalIndex];

            const currentState = getCurrentHistoryState();
            if (currentState && currentState.view === 'editor') {
                const note = notes.find(n => n.id === currentState.params.noteId);
                if (note && markdownEditor.value !== originalNoteContent) {
                    note.content = markdownEditor.value;
                    note.metadata.lastModified = Date.now();
                    sortNotes();
                    await saveNote(note);
                    renderNoteList();
                }
            }
            
            goToHistoryState(originalIndex);
            navigateToState(targetState);
            dropdown.remove();
        });
        dropdown.appendChild(item);
    });
}

function showHistoryDropdown(targetButton) {
    // Close any existing dropdown
    const existingDropdown = document.querySelector('.history-dropdown');
    if (existingDropdown) {
        existingDropdown.remove();
    }

    const history = getHistory();
    if (history.length === 0) return;

    const dropdown = document.createElement('div');
    dropdown.classList.add('history-dropdown');

    populateHistoryDropdown(dropdown);

    document.body.appendChild(dropdown);

    // Close dropdown when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeDropdown(event) {
            if (!dropdown.contains(event.target) && event.target !== targetButton) {
                dropdown.remove();
                document.removeEventListener('click', closeDropdown);
            }
        });
    }, 0);
}

function refreshHistoryDropdown() {
    const existingDropdown = document.querySelector('.history-dropdown');
    if (existingDropdown) {
        populateHistoryDropdown(existingDropdown);
    }
}

// === Navigation Event Listeners ===

const backButtons = [
    backButton,
    settingsBackButton,
    licenseBackButton,
    recycleBinBackButton,
    imageManagementBackButton
];

// Add event listeners to all back buttons
function initializeNavigationEvents() {
    backButtons.forEach(button => {
        button.addEventListener('click', goBack);
        // Show history dropdown on right click
        button.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showHistoryDropdown(e.currentTarget);
        });
    });

    document.addEventListener('historytruncated', refreshHistoryDropdown);
}

// Export functions
export {
    navigateToState,
    goBack,
    populateHistoryDropdown,
    showHistoryDropdown,
    refreshHistoryDropdown,
    initializeNavigationEvents
};