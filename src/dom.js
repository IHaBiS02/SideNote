// === 메인 뷰 요소 ===
const listView = document.getElementById('list-view');
const editorView = document.getElementById('editor-view');
const noteList = document.getElementById('note-list');
const newNoteButton = document.getElementById('new-note-button');
const backButton = document.getElementById('back-button');
const deleteNoteButton = document.getElementById('delete-note-button');
// === 에디터 관련 요소 ===
const editorTitle = document.getElementById('editor-title');
const markdownEditor = document.getElementById('markdown-editor');
const htmlPreview = document.getElementById('html-preview');
const toggleViewButton = document.getElementById('toggle-view-button');
// === 설정 및 라이선스 뷰 요소 ===
const settingsView = document.getElementById('settings-view');
const settingsButton = document.getElementById('settings-button');
const globalSettingsButton = document.getElementById('global-settings-button');
const settingsBackButton = document.getElementById('settings-back-button');
const licensesButton = document.getElementById('licenses-button');
const licenseView = document.getElementById('license-view');
const licenseBackButton = document.getElementById('license-back-button');
const licenseContent = document.getElementById('license-content');
// === 노트 설정 요소 ===
const titleSetting = document.getElementById('title-setting');
const fontSizeSetting = document.getElementById('font-size-setting');
const modeSetting = document.getElementById('mode-setting');
const autoLineBreakButton = document.getElementById('auto-line-break-button');
const tildeReplacementButton = document.getElementById('tilde-replacement-button');
const autoAddSpacesCheckbox = document.getElementById('auto-add-spaces-checkbox');
// === 가져오기/내보내기 요소 ===
const globalExportButton = document.getElementById('global-export-button');
const globalImportButton = document.getElementById('global-import-button');
const globalImportInput = document.getElementById('global-import-input');
const exportNoteButton = document.getElementById('export-note-button');
const importNoteButton = document.getElementById('import-note-button');
const importNoteInput = document.getElementById('import-note-input');
// === 휴지통 관련 요소 ===
const recycleBinButton = document.getElementById('recycle-bin-button');
const recycleBinView = document.getElementById('recycle-bin-view');
const recycleBinBackButton = document.getElementById('recycle-bin-back-button');
const deletedNoteList = document.getElementById('deleted-note-list');
// === 이미지 관리 요소 ===
const imageManagementButton = document.getElementById('image-management-button');
const imageManagementView = document.getElementById('image-management-view');
const imageManagementBackButton = document.getElementById('image-management-back-button');
const imageList = document.getElementById('image-list');
const deletedItemsList = document.getElementById('deleted-items-list');
const emptyRecycleBinButton = document.getElementById('empty-recycle-bin-button');
const preventUsedImageDeletionCheckbox = document.getElementById('prevent-used-image-deletion-checkbox');