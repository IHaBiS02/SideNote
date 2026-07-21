// Import all event modules
import { initializeNavigationEvents } from './navigation.js';
import { initializeEditorEvents } from './editor.js';
import { initializeSettingsEvents } from './settings-events.js';
import { initializeImportExportEvents } from './import-export-events.js';
import { initializeGlobalEvents } from './global-events.js';
import { initializeWysiwygMarkdownEditor } from '../editor/sidenote-editor-adapter.js';

// Re-export utility functions for compatibility with existing code
export {
  navigateToState,
  goBack,
  populateHistoryDropdown,
  showHistoryDropdown,
  refreshHistoryDropdown
} from './navigation.js';

export {
  insertTextAtCursor
} from './editor.js';

// Initialize all event listeners
function initializeAllEvents(): void {
  initializeWysiwygMarkdownEditor();
  initializeNavigationEvents();
  initializeEditorEvents();
  initializeSettingsEvents();
  initializeImportExportEvents();
  initializeGlobalEvents();
}

// Export the main initialization function
export {
  initializeAllEvents
};
