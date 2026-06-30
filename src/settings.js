// Import required DOM elements
import {
  markdownEditor,
  htmlPreview,
  autoLineBreakButton,
  tildeReplacementButton,
  legacyLineBreakModeCheckbox,
  titleSetting,
  fontSizeSetting,
  modeSetting,
  autoAddSpacesButton,
  codeBlockHeaderCheckbox,
  preventUsedImageDeletionCheckbox
} from './dom.js';

// Import state from state module
import { globalSettings, setActiveNoteId } from './state.js';

const DEFAULT_SETTINGS = Object.freeze({
  title: 'default',
  fontSize: 12,
  legacyLineBreakMode: false,
  autoLineBreak: false,
  tildeReplacement: false,
  autoAddSpaces: false,
  codeBlockHeader: true,
  preventUsedImageDeletion: true,
  mode: 'system'
});

const NOTE_SETTING_KEYS = ['title', 'fontSize', 'codeBlockHeader'];

function normalizeGlobalSettings(settings = {}) {
  return {
    ...DEFAULT_SETTINGS,
    ...(settings || {})
  };
}

function resolveEffectiveSettings(note) {
  const effectiveSettings = normalizeGlobalSettings(globalSettings);
  const noteSettings = note?.settings || {};

  for (const key of NOTE_SETTING_KEYS) {
    if (noteSettings[key] !== undefined) {
      effectiveSettings[key] = noteSettings[key];
    }
  }

  return effectiveSettings;
}

function resolveLegacyTextProcessingSettings(settings = globalSettings) {
  const normalizedSettings = normalizeGlobalSettings(settings);
  if (!normalizedSettings.legacyLineBreakMode) {
    return {
      ...normalizedSettings,
      autoLineBreak: false,
      autoAddSpaces: false
    };
  }

  return normalizedSettings;
}

/**
 * Saves the global settings to storage.
 */
// === 설정 저장 함수 ===

function saveGlobalSettings() {
  // chrome.storage.local에 전역 설정 저장
  browser.storage.local.set({ globalSettings });
}

/**
 * Applies the font size to the editor and preview elements.
 * @param {number} size The font size to apply.
 */
// === UI 설정 적용 함수 ===

function applyFontSize(size) {
  // 에디터와 미리보기 모두에 글꼴 크기 적용
  const editorElements = [markdownEditor, htmlPreview];
  editorElements.forEach(el => {
    el.style.fontSize = `${size}px`;
  });
}

/**
 * Applies the color mode to the document body.
 * @param {string} mode The color mode to apply.
 */
function applyMode(mode) {
  const themeStylesheet = document.getElementById('theme-stylesheet');
  if (mode === 'dark') {
    // 다크 모드
    document.body.classList.add('dark-mode');
    themeStylesheet.href = 'vendor/atom-one-dark.css';
  } else if (mode === 'light') {
    // 라이트 모드
    document.body.classList.remove('dark-mode');
    themeStylesheet.href = 'vendor/atom-one-light.css';
  } else {
    // 시스템 모드 (운영체제 설정 따라가기)
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.body.classList.add('dark-mode');
      themeStylesheet.href = 'vendor/atom-one-dark.css';
    } else {
      document.body.classList.remove('dark-mode');
      themeStylesheet.href = 'vendor/atom-one-light.css';
    }
  }
}

/**
 * Updates the auto line break button text and title.
 */
// === 버튼 상태 업데이트 함수 ===

function updateAutoLineBreakButton() {
  // 자동 줄바꿈 버튼 아이콘 및 툴팁 업데이트
  const settings = normalizeGlobalSettings(globalSettings);
  autoLineBreakButton.hidden = !settings.legacyLineBreakMode;
  autoLineBreakButton.disabled = !settings.legacyLineBreakMode;
  autoLineBreakButton.textContent = settings.autoLineBreak ? '↩✅' : '↩❌';
  autoLineBreakButton.title = settings.autoLineBreak ? 'Auto Line Break Enabled' : 'Auto Line Break Disabled';
}

function updateAutoAddSpacesButton() {
  const settings = normalizeGlobalSettings(globalSettings);
  autoAddSpacesButton.hidden = !settings.legacyLineBreakMode;
  autoAddSpacesButton.disabled = !settings.legacyLineBreakMode;
  autoAddSpacesButton.textContent = settings.autoAddSpaces ? '⏎✅' : '⏎❌';
  autoAddSpacesButton.title = settings.autoAddSpaces ? 'Add two spaces on Enter enabled' : 'Add two spaces on Enter disabled';
}

/**
 * Updates the tilde replacement button text and title.
 */
function updateTildeReplacementButton() {
  // 틸데(~) 자동 변환 버튼 아이콘 및 툴팁 업데이트
  const settings = normalizeGlobalSettings(globalSettings);
  tildeReplacementButton.textContent = settings.tildeReplacement ? '~✅' : '~❌';
  tildeReplacementButton.title = settings.tildeReplacement ? 'Tilde Replacement Enabled' : 'Tilde Replacement Disabled';
}

function updateLegacyLineBreakControls() {
  const settings = normalizeGlobalSettings(globalSettings);
  legacyLineBreakModeCheckbox.checked = settings.legacyLineBreakMode;
  updateAutoLineBreakButton();
  updateAutoAddSpacesButton();
}

function isCodeBlockHeaderEnabled(note) {
  return resolveEffectiveSettings(note).codeBlockHeader !== false;
}

/**
 * Populates the settings form fields based on global or note-specific settings.
 * @param {boolean} isGlobal Whether to show global settings.
 * @param {object} [note] The note object (required when isGlobal is false).
 * @returns {boolean} True if form was populated, false if note not found.
 */
function populateSettingsForm(isGlobal, note) {
  const effectiveGlobalSettings = normalizeGlobalSettings(globalSettings);
  if (isGlobal) {
    titleSetting.value = effectiveGlobalSettings.title;
    fontSizeSetting.value = effectiveGlobalSettings.fontSize;
    codeBlockHeaderCheckbox.checked = effectiveGlobalSettings.codeBlockHeader !== false;
  } else {
    if (!note) return false;
    note.settings = note.settings || {};
    const effectiveNoteSettings = resolveEffectiveSettings(note);
    setActiveNoteId(note.id);
    titleSetting.value = effectiveNoteSettings.title;
    fontSizeSetting.value = effectiveNoteSettings.fontSize;
    codeBlockHeaderCheckbox.checked = effectiveNoteSettings.codeBlockHeader !== false;
  }
  modeSetting.value = effectiveGlobalSettings.mode;
  legacyLineBreakModeCheckbox.checked = effectiveGlobalSettings.legacyLineBreakMode;
  updateLegacyLineBreakControls();
  updateTildeReplacementButton();
  preventUsedImageDeletionCheckbox.checked = effectiveGlobalSettings.preventUsedImageDeletion;
  return true;
}

// Export functions
export {
  DEFAULT_SETTINGS,
  normalizeGlobalSettings,
  resolveEffectiveSettings,
  resolveLegacyTextProcessingSettings,
  saveGlobalSettings,
  applyFontSize,
  applyMode,
  updateAutoLineBreakButton,
  updateAutoAddSpacesButton,
  updateTildeReplacementButton,
  updateLegacyLineBreakControls,
  isCodeBlockHeaderEnabled,
  populateSettingsForm
};
