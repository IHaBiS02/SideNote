// Import required DOM elements
import {
  markdownEditor,
  autoLineBreakButton,
  tildeReplacementButton,
  showTildeReplacementButtonCheckbox,
  legacyLineBreakModeCheckbox,
  titleSetting,
  fontSizeSetting,
  modeSetting,
  codeBlockHeaderCheckbox,
  wysiwygPreviewCheckbox,
  preventUsedImageDeletionCheckbox
} from './dom.js';

// Import state from state module
import { globalSettings, setActiveNoteId } from './state.js';
import type { GlobalSettings, Note, ThemeMode } from './types.js';

const DEFAULT_SETTINGS: Readonly<GlobalSettings> = Object.freeze({
  title: 'default',
  fontSize: 12,
  wysiwygPreview: true,
  legacyLineBreakMode: false,
  autoLineBreak: false,
  showTildeReplacementButton: false,
  tildeReplacement: false,
  codeBlockHeader: true,
  preventUsedImageDeletion: true,
  mode: 'system'
});

function normalizeGlobalSettings(settings: Partial<GlobalSettings> = {}): GlobalSettings {
  const normalizedSettings = {
    ...DEFAULT_SETTINGS,
    ...(settings || {})
  };
  // Remove the retired textarea-only setting from data saved by older versions.
  delete (normalizedSettings as GlobalSettings & { autoAddSpaces?: unknown }).autoAddSpaces;
  return normalizedSettings;
}

function resolveEffectiveSettings(note?: Note | null): GlobalSettings {
  const effectiveSettings = normalizeGlobalSettings(globalSettings);
  const noteSettings = note?.settings || {};

  if (noteSettings.title !== undefined) effectiveSettings.title = noteSettings.title;
  if (noteSettings.fontSize !== undefined) effectiveSettings.fontSize = noteSettings.fontSize;
  if (noteSettings.codeBlockHeader !== undefined) {
    effectiveSettings.codeBlockHeader = noteSettings.codeBlockHeader;
  }

  return effectiveSettings;
}

function resolveLegacyTextProcessingSettings(
  settings: Partial<GlobalSettings> = globalSettings,
): GlobalSettings {
  const normalizedSettings = normalizeGlobalSettings(settings);
  const tildeReplacement = normalizedSettings.showTildeReplacementButton && normalizedSettings.tildeReplacement;
  if (!normalizedSettings.legacyLineBreakMode) {
    return {
      ...normalizedSettings,
      autoLineBreak: false,
      tildeReplacement
    };
  }

  return {
    ...normalizedSettings,
    tildeReplacement
  };
}

/**
 * Saves the global settings to storage.
 */
// === 설정 저장 함수 ===

function saveGlobalSettings(): void {
  // chrome.storage.local에 전역 설정 저장
  browser.storage.local.set({ globalSettings });
}

/**
 * Applies the font size to the editor and preview elements.
 * @param {number} size The font size to apply.
 */
// === UI 설정 적용 함수 ===

function applyFontSize(size: number): void {
  markdownEditor.style.fontSize = `${size}px`;
  markdownEditor.style.setProperty('--editor-font-size', `${size}px`);
}

/**
 * Applies the color mode to the document body.
 * @param {string} mode The color mode to apply.
 */
function applyMode(mode: ThemeMode): void {
  const followsDarkSystemTheme =
    mode === 'system'
    && Boolean(window.matchMedia?.('(prefers-color-scheme: dark)').matches);
  document.body.classList.toggle('dark-mode', mode === 'dark' || followsDarkSystemTheme);
}

/**
 * Updates the auto line break button text and title.
 */
// === 버튼 상태 업데이트 함수 ===

function updateAutoLineBreakButton(): void {
  // 자동 줄바꿈 버튼 아이콘 및 툴팁 업데이트
  const settings = normalizeGlobalSettings(globalSettings);
  autoLineBreakButton.hidden = !settings.legacyLineBreakMode;
  autoLineBreakButton.disabled = !settings.legacyLineBreakMode;
  autoLineBreakButton.textContent = settings.autoLineBreak ? '↩✅' : '↩❌';
  autoLineBreakButton.title = settings.autoLineBreak ? 'Auto Line Break Enabled' : 'Auto Line Break Disabled';
}

/**
 * Updates the tilde replacement checkbox state and title.
 */
function updateTildeReplacementButton(): void {
  // 틸데(~) 자동 변환 버튼 아이콘 및 툴팁 업데이트
  const settings = normalizeGlobalSettings(globalSettings);
  tildeReplacementButton.hidden = !settings.showTildeReplacementButton;
  tildeReplacementButton.disabled = !settings.showTildeReplacementButton;
  tildeReplacementButton.textContent = settings.tildeReplacement ? '~✅' : '~❌';
  tildeReplacementButton.title = settings.tildeReplacement ? 'Tilde Replacement Enabled' : 'Tilde Replacement Disabled';
}

function updateLegacyLineBreakControls(): void {
  const settings = normalizeGlobalSettings(globalSettings);
  legacyLineBreakModeCheckbox.checked = settings.legacyLineBreakMode;
  updateAutoLineBreakButton();
}

function isCodeBlockHeaderEnabled(note?: Note | null): boolean {
  return resolveEffectiveSettings(note).codeBlockHeader !== false;
}

/**
 * Populates the settings form fields based on global or note-specific settings.
 * @param {boolean} isGlobal Whether to show global settings.
 * @param {object} [note] The note object (required when isGlobal is false).
 * @returns {boolean} True if form was populated, false if note not found.
 */
function populateSettingsForm(isGlobal: boolean, note?: Note | null): boolean {
  const effectiveGlobalSettings = normalizeGlobalSettings(globalSettings);
  if (isGlobal) {
    titleSetting.value = effectiveGlobalSettings.title;
    fontSizeSetting.value = String(effectiveGlobalSettings.fontSize);
    codeBlockHeaderCheckbox.checked = effectiveGlobalSettings.codeBlockHeader !== false;
  } else {
    if (!note) return false;
    note.settings = note.settings || {};
    const effectiveNoteSettings = resolveEffectiveSettings(note);
    setActiveNoteId(note.id);
    titleSetting.value = effectiveNoteSettings.title;
    fontSizeSetting.value = String(effectiveNoteSettings.fontSize);
    codeBlockHeaderCheckbox.checked = effectiveNoteSettings.codeBlockHeader !== false;
  }
  wysiwygPreviewCheckbox.checked = effectiveGlobalSettings.wysiwygPreview !== false;
  modeSetting.value = effectiveGlobalSettings.mode;
  legacyLineBreakModeCheckbox.checked = effectiveGlobalSettings.legacyLineBreakMode;
  showTildeReplacementButtonCheckbox.checked = effectiveGlobalSettings.showTildeReplacementButton;
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
  updateTildeReplacementButton,
  updateLegacyLineBreakControls,
  isCodeBlockHeaderEnabled,
  populateSettingsForm
};
