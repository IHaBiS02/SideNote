// Import DOM elements for global events
import {
  imageManagementView
} from '../dom.js';

// Import functions from other modules
import { applyMode } from '../settings.js';
import { goBack } from './navigation.js';

// Import state from state module
import {
  globalSettings
} from '../state.js';

// === Global Event Listeners ===

function initializeGlobalEvents() {
  // ESC key to close/go back
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // Close image modal if open first
      const imagePreviewModal = document.querySelector('.image-preview-modal');
      if (imagePreviewModal) {
        document.body.removeChild(imagePreviewModal);
        return;
      }
      // Otherwise go back
      goBack();
    }
  });

  // System theme change detection
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (globalSettings.mode === 'system') {
          applyMode('system');
      }
  });

  // Close dropdowns in image management screen
  document.addEventListener('click', (e) => {
      if (imageManagementView.style.display === 'block') {
          // Close notes dropdown when clicking outside usage icon
          const openNotesDropdown = document.querySelector('.notes-dropdown');
          if (openNotesDropdown && !e.target.closest('.usage-icon')) {
              openNotesDropdown.remove();
          }
          
          // Close image title dropdown when clicking outside image name
          const openImageTitleDropdown = document.querySelector('.image-title-dropdown');
          if (openImageTitleDropdown && !e.target.closest('.image-name')) {
              openImageTitleDropdown.remove();
          }
      }
  });
}

// Export functions
export {
  initializeGlobalEvents
};