// Import DOM elements for navigation
import {
  backButton,
  settingsBackButton,
  licenseBackButton,
  recycleBinBackButton,
  imageManagementBackButton,
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
import { saveNote } from '../database/index.js';
import { populateSettingsForm } from '../settings.js';
import { createDropdown } from '../ui-helpers.js';

// Import state from state module
import {
  notes,
  isGlobalSettings,
  originalNoteContent,
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

// Save editor content if changed before navigating away
async function saveCurrentEditorIfChanged() {
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
}

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
                populateSettingsForm(true);
            } else {
                const note = notes.find(n => n.id === state.params.noteId);
                if (!note || !populateSettingsForm(false, note)) {
                    showListView(false);
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
    await saveCurrentEditorIfChanged();

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
            const noteTitle = note ? note.title : 'Untitled';
            const mode = state.params.inEditMode ? 'Edit' : 'Preview';
            title = `${mode}: ${noteTitle}`;
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

            await saveCurrentEditorIfChanged();

            goToHistoryState(originalIndex);
            navigateToState(targetState);
            dropdown.remove();
        });
        dropdown.appendChild(item);
    });
}

function showHistoryDropdown(targetButton) {
    const history = getHistory();
    if (history.length === 0) return;

    createDropdown({
        className: 'history-dropdown',
        populate: (dropdown) => populateHistoryDropdown(dropdown),
        excludeFromClose: [],
    });
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