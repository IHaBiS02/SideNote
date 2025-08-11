// Re-export all functions from sub-modules for backward compatibility

export {
  showListView,
  showEditorView,
  showSettingsView,
  showLicenseView,
  showRecycleBinView,
  showImageManagementView
} from './view-manager.js';

export {
  renderNoteList,
  openNote
} from './note-renderer.js';

export {
  renderMarkdown,
  renderImages,
  togglePreview
} from './markdown-renderer.js';

export {
  renderDeletedItemsList
} from './recycle-bin-renderer.js';

export {
  showImageModal,
  renderImagesList
} from './image-manager.js';