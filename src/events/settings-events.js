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
  showTildeReplacementButtonCheckbox,
  legacyLineBreakModeCheckbox,
  autoAddSpacesCheckbox,
  codeBlockHeaderCheckbox,
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
  renderDeletedItemsList,
  renderMarkdown
} from '../notes_view/index.js';
import {
  saveGlobalSettings,
  applyFontSize,
  applyMode,
  updateAutoLineBreakButton,
  updateTildeReplacementButton,
  updateLegacyLineBreakControls,
  populateSettingsForm
} from '../settings.js';
import { saveNote } from '../database/index.js';
import { createDropdown } from '../ui-helpers.js';

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
    populateSettingsForm(false, note);
    showSettingsView();
  });

  // Open global settings
  globalSettingsButton.addEventListener('click', () => {
    setIsGlobalSettings(true);
    populateSettingsForm(true);
    showSettingsView();
  });

  // Licenses button
  licensesButton.addEventListener('click', async () => {
    const licenseFiles = [
      'LIBRARY_LICENSES.md',
      'WYSIWYG_MARKDOWN_LICENSES.md'
    ];
    const texts = await Promise.all(licenseFiles.map(async (file) => {
      const response = await fetch(file);
      if (!response.ok) {
        throw new Error(`Failed to load ${file}: ${response.status}`);
      }
      return response.text();
    }));
    const text = texts.join('\n\n---\n\n');
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

      createDropdown({
          className: 'confirmation-dropdown',
          populate: (dropdown) => {
              const eraseAction = document.createElement('div');
              eraseAction.textContent = 'Erase All Notes';
              eraseAction.classList.add('delete-action');

              const handleFirstClick = (event) => {
                  event.stopPropagation();

                  const confirmAction = document.createElement('div');
                  confirmAction.textContent = 'Are you sure?';
                  confirmAction.classList.add('delete-action', 'confirm');

                  confirmAction.addEventListener('click', async () => {
                      await emptyRecycleBin();
                      renderDeletedItemsList();
                      dropdown.remove();
                  });

                  dropdown.insertBefore(confirmAction, eraseAction);
                  eraseAction.removeEventListener('click', handleFirstClick);
              };

              eraseAction.addEventListener('click', handleFirstClick);
              dropdown.appendChild(eraseAction);
          },
      });
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
        note.settings = note.settings || {};
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
        note.settings = note.settings || {};
        note.settings.fontSize = value;
        note.metadata.lastModified = Date.now();
        applyFontSize(value);
        sortNotes();
        await saveNote(note);
      }
    }
  });

  // Code block header setting
  codeBlockHeaderCheckbox.addEventListener('change', async () => {
    const value = codeBlockHeaderCheckbox.checked;
    if (isGlobalSettings) {
      globalSettings.codeBlockHeader = value;
      saveGlobalSettings();
    } else {
      const note = notes.find(n => n.id === activeNoteId);
      if (note) {
        note.settings = note.settings || {};
        note.settings.codeBlockHeader = value;
        note.metadata.lastModified = Date.now();
        sortNotes();
        await saveNote(note);
      }
    }
    renderMarkdown();
  });

  // Legacy Markdown line break mode
  legacyLineBreakModeCheckbox.addEventListener('change', () => {
    globalSettings.legacyLineBreakMode = legacyLineBreakModeCheckbox.checked;
    updateLegacyLineBreakControls();
    saveGlobalSettings();
    renderMarkdown();
  });

  // Auto line break legacy toolbar button
  autoLineBreakButton.addEventListener('click', () => {
    globalSettings.autoLineBreak = !globalSettings.autoLineBreak;
    updateAutoLineBreakButton();
    saveGlobalSettings();
  });

  // Tilde replacement toolbar visibility setting
  showTildeReplacementButtonCheckbox.addEventListener('change', () => {
    globalSettings.showTildeReplacementButton = showTildeReplacementButtonCheckbox.checked;
    updateTildeReplacementButton();
    saveGlobalSettings();
  });

  // Tilde replacement toolbar button
  tildeReplacementButton.addEventListener('click', () => {
    globalSettings.tildeReplacement = !globalSettings.tildeReplacement;
    updateTildeReplacementButton();
    saveGlobalSettings();
  });

  // Auto add spaces on Enter legacy setting
  autoAddSpacesCheckbox.addEventListener('change', () => {
      globalSettings.autoAddSpaces = autoAddSpacesCheckbox.checked;
      updateLegacyLineBreakControls();
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
