// Import DOM elements for settings
import {
  settingsButton,
  globalSettingsButton,
  licensesButton,
  recycleBinButton,
  imageManagementButton,
  emptyRecycleBinButton,
  titleSetting,
  fontSizeSetting,
  modeSetting,
  autoLineBreakButton,
  tildeReplacementButton,
  autoAddSpacesCheckbox,
  preventUsedImageDeletionCheckbox,
  licenseContent,
  editorTitle
} from '../dom.js';

// Import functions from other modules
import { emptyRecycleBin, sortNotes } from '../notes.js';
import {
  showSettingsView,
  showLicenseView,
  showRecycleBinView,
  showImageManagementView,
  renderNoteList
} from '../notes_view/index.js';
import {
  saveGlobalSettings,
  applyFontSize,
  applyMode,
  updateAutoLineBreakButton,
  updateTildeReplacementButton
} from '../settings.js';
import { saveNote } from '../database/index.js';

// Import state from state module
import {
  notes,
  globalSettings,
  isGlobalSettings,
  activeNoteId,
  setIsGlobalSettings
} from '../state.js';

// === Settings Event Listeners ===

function initializeSettingsEvents() {
  // Open note settings
  settingsButton.addEventListener('click', () => {
    setIsGlobalSettings(false);
    const note = notes.find(n => n.id === activeNoteId);
    titleSetting.value = note.settings.title || 'default';
    fontSizeSetting.value = note.settings.fontSize || globalSettings.fontSize || 12;
    modeSetting.value = globalSettings.mode || 'system';
    autoAddSpacesCheckbox.checked = globalSettings.autoAddSpaces;
    preventUsedImageDeletionCheckbox.checked = globalSettings.preventUsedImageDeletion;
    showSettingsView();
  });

  // Open global settings
  globalSettingsButton.addEventListener('click', () => {
    setIsGlobalSettings(true);
    titleSetting.value = globalSettings.title || 'default';
    fontSizeSetting.value = globalSettings.fontSize || 12;
    modeSetting.value = globalSettings.mode || 'system';
    autoAddSpacesCheckbox.checked = globalSettings.autoAddSpaces;
    preventUsedImageDeletionCheckbox.checked = globalSettings.preventUsedImageDeletion;
    showSettingsView();
  });

  // Licenses button
  licensesButton.addEventListener('click', async () => {
    const response = await fetch('LIBRARY_LICENSES.md');
    const text = await response.text();
    const dirtyHtml = marked.parse(text);
    licenseContent.innerHTML = DOMPurify.sanitize(dirtyHtml);
    showLicenseView();
  });

  // Recycle bin button
  recycleBinButton.addEventListener('click', () => {
    showRecycleBinView();
  });

  // Image management button
  imageManagementButton.addEventListener('click', () => {
    showImageManagementView();
  });

  // Empty recycle bin button (with confirmation dropdown)
  emptyRecycleBinButton.addEventListener('click', (e) => {
      e.stopPropagation();

      const existingDropdown = document.querySelector('.confirmation-dropdown');
      if (existingDropdown) {
          existingDropdown.remove();
          return;
      }

      const dropdown = document.createElement('div');
      dropdown.classList.add('confirmation-dropdown');

      const eraseAction = document.createElement('div');
      eraseAction.textContent = 'Erase All Notes';
      eraseAction.classList.add('delete-action');

      const handleFirstClick = (event) => {
          event.stopPropagation();

          const confirmAction = document.createElement('div');
          confirmAction.textContent = 'Are you sure?';
          confirmAction.classList.add('delete-action', 'confirm');

          confirmAction.addEventListener('click', () => {
              emptyRecycleBin();
              dropdown.remove();
          });

          dropdown.insertBefore(confirmAction, eraseAction);
          eraseAction.removeEventListener('click', handleFirstClick);
      };

      eraseAction.addEventListener('click', handleFirstClick);

      dropdown.appendChild(eraseAction);
      document.body.appendChild(dropdown);

      setTimeout(() => {
          document.addEventListener('click', function closeDropdown(event) {
              if (!dropdown.contains(event.target)) {
                  dropdown.remove();
                  document.removeEventListener('click', closeDropdown);
              }
          });
      }, 0);
  });

  // Mode setting change
  modeSetting.addEventListener('change', () => {
    const value = modeSetting.value;
    globalSettings.mode = value;
    saveGlobalSettings();
    applyMode(value);
  });

  // Title setting change
  titleSetting.addEventListener('change', async () => {
    const value = titleSetting.value;
    if (isGlobalSettings) {
      globalSettings.title = value;
      saveGlobalSettings();
    } else {
      const note = notes.find(n => n.id === activeNoteId);
      if (note) {
        note.settings.title = value;
        note.metadata.lastModified = Date.now();
        if (value === 'default') {
          const firstLine = note.content.trim().split('\n')[0];
          note.title = firstLine.substring(0, 30) || 'New Note';
          editorTitle.textContent = note.title;
        }
        sortNotes();
        await saveNote(note);
      }
    }
  });

  // Font size setting change
  fontSizeSetting.addEventListener('input', async () => {
    const value = parseInt(fontSizeSetting.value, 10);
    if (isNaN(value) || value < 1) {
      return;
    }

    if (isGlobalSettings) {
      globalSettings.fontSize = value;
      saveGlobalSettings();
    } else {
      const note = notes.find(n => n.id === activeNoteId);
      if (note) {
        note.settings.fontSize = value;
        note.metadata.lastModified = Date.now();
        applyFontSize(value);
        sortNotes();
        await saveNote(note);
      }
    }
  });

  // Auto line break button
  autoLineBreakButton.addEventListener('click', () => {
    globalSettings.autoLineBreak = !globalSettings.autoLineBreak;
    updateAutoLineBreakButton();
    saveGlobalSettings();
  });

  // Tilde replacement button
  tildeReplacementButton.addEventListener('click', () => {
    globalSettings.tildeReplacement = !globalSettings.tildeReplacement;
    updateTildeReplacementButton();
    saveGlobalSettings();
  });

  // Auto add spaces checkbox
  autoAddSpacesCheckbox.addEventListener('change', () => {
      globalSettings.autoAddSpaces = autoAddSpacesCheckbox.checked;
      saveGlobalSettings();
  });

  // Prevent used image deletion checkbox
  preventUsedImageDeletionCheckbox.addEventListener('change', () => {
      globalSettings.preventUsedImageDeletion = preventUsedImageDeletionCheckbox.checked;
      saveGlobalSettings();
  });
}

// Export functions
export {
  initializeSettingsEvents
};