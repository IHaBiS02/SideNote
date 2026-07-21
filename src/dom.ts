// === 메인 뷰 요소 ===
import type { WysiwygMarkdownElement } from '../packages/wysiwyg-markdown/src/index.js';

const listView = document.getElementById('list-view') as HTMLDivElement;
const editorView = document.getElementById('editor-view') as HTMLDivElement;
const noteList = document.getElementById('note-list') as HTMLUListElement;
const newNoteButton = document.getElementById('new-note-button') as HTMLButtonElement;
const backButton = document.getElementById('back-button') as HTMLButtonElement;
const deleteNoteButton = document.getElementById('delete-note-button') as HTMLButtonElement;
// === 에디터 관련 요소 ===
const editorTitle = document.getElementById('editor-title') as HTMLHeadingElement;
const markdownEditor = document.getElementById('markdown-editor') as WysiwygMarkdownElement;
const htmlPreview = document.getElementById('html-preview') as HTMLDivElement;
const toggleViewButton = document.getElementById('toggle-view-button') as HTMLButtonElement;
// === 설정 및 라이선스 뷰 요소 ===
const settingsView = document.getElementById('settings-view') as HTMLDivElement;
const settingsButton = document.getElementById('settings-button') as HTMLButtonElement;
const globalSettingsButton = document.getElementById('global-settings-button') as HTMLButtonElement;
const settingsBackButton = document.getElementById('settings-back-button') as HTMLButtonElement;
const licensesButton = document.getElementById('licenses-button') as HTMLButtonElement;
const licenseView = document.getElementById('license-view') as HTMLDivElement;
const licenseBackButton = document.getElementById('license-back-button') as HTMLButtonElement;
const licenseContent = document.getElementById('license-content') as HTMLDivElement;
// === 노트 설정 요소 ===
const titleSetting = document.getElementById('title-setting') as HTMLSelectElement;
const fontSizeSetting = document.getElementById('font-size-setting') as HTMLInputElement;
const modeSetting = document.getElementById('mode-setting') as HTMLSelectElement;
const autoLineBreakButton = document.getElementById('auto-line-break-button') as HTMLButtonElement;
const tildeReplacementButton = document.getElementById('tilde-replacement-button') as HTMLButtonElement;
const showTildeReplacementButtonCheckbox = document.getElementById('show-tilde-replacement-button-checkbox') as HTMLInputElement;
const legacyLineBreakModeCheckbox = document.getElementById('legacy-line-break-mode-checkbox') as HTMLInputElement;
const autoAddSpacesCheckbox = document.getElementById('auto-add-spaces-checkbox') as HTMLInputElement;
const autoAddSpacesSetting = document.getElementById('auto-add-spaces-setting') as HTMLDivElement;
const codeBlockHeaderCheckbox = document.getElementById('code-block-header-checkbox') as HTMLInputElement;
// === 가져오기/내보내기 요소 ===
const globalExportButton = document.getElementById('global-export-button') as HTMLButtonElement;
const globalImportButton = document.getElementById('global-import-button') as HTMLButtonElement;
const globalImportInput = document.getElementById('global-import-input') as HTMLInputElement;
const exportNoteButton = document.getElementById('export-note-button') as HTMLButtonElement;
const importNoteButton = document.getElementById('import-note-button') as HTMLButtonElement;
const importNoteInput = document.getElementById('import-note-input') as HTMLInputElement;
// === 휴지통 관련 요소 ===
const recycleBinButton = document.getElementById('recycle-bin-button') as HTMLButtonElement;
const recycleBinView = document.getElementById('recycle-bin-view') as HTMLDivElement;
const recycleBinBackButton = document.getElementById('recycle-bin-back-button') as HTMLButtonElement;
const deletedNoteList = document.getElementById('deleted-note-list');
// === 이미지 관리 요소 ===
const imageManagementButton = document.getElementById('image-management-button') as HTMLButtonElement;
const imageManagementView = document.getElementById('image-management-view') as HTMLDivElement;
const imageManagementBackButton = document.getElementById('image-management-back-button') as HTMLButtonElement;
const imageList = document.getElementById('image-list') as HTMLUListElement;
const deletedItemsList = document.getElementById('deleted-items-list') as HTMLUListElement;
const emptyRecycleBinButton = document.getElementById('empty-recycle-bin-button') as HTMLButtonElement;
const preventUsedImageDeletionCheckbox = document.getElementById('prevent-used-image-deletion-checkbox') as HTMLInputElement;

// Export all DOM elements
export {
  listView,
  editorView,
  noteList,
  newNoteButton,
  backButton,
  deleteNoteButton,
  editorTitle,
  markdownEditor,
  htmlPreview,
  toggleViewButton,
  settingsView,
  settingsButton,
  globalSettingsButton,
  settingsBackButton,
  licensesButton,
  licenseView,
  licenseBackButton,
  licenseContent,
  titleSetting,
  fontSizeSetting,
  modeSetting,
  autoLineBreakButton,
  tildeReplacementButton,
  showTildeReplacementButtonCheckbox,
  legacyLineBreakModeCheckbox,
  autoAddSpacesCheckbox,
  autoAddSpacesSetting,
  codeBlockHeaderCheckbox,
  globalExportButton,
  globalImportButton,
  globalImportInput,
  exportNoteButton,
  importNoteButton,
  importNoteInput,
  recycleBinButton,
  recycleBinView,
  recycleBinBackButton,
  deletedNoteList,
  imageManagementButton,
  imageManagementView,
  imageManagementBackButton,
  imageList,
  deletedItemsList,
  emptyRecycleBinButton,
  preventUsedImageDeletionCheckbox
};
