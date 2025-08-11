// Import required DOM elements
import { 
  markdownEditor, 
  htmlPreview, 
  autoLineBreakButton, 
  tildeReplacementButton 
} from './dom.js';

// Import state from state module
import { globalSettings } from './state.js';

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
  autoLineBreakButton.textContent = globalSettings.autoLineBreak ? '↩✅' : '↩❌';
  autoLineBreakButton.title = globalSettings.autoLineBreak ? 'Auto Line Break Enabled' : 'Auto Line Break Disabled';
}

/**
 * Updates the tilde replacement button text and title.
 */
function updateTildeReplacementButton() {
  // 틸데(~) 자동 변환 버튼 아이콘 및 툴팁 업데이트
  tildeReplacementButton.textContent = globalSettings.tildeReplacement ? '~✅' : '~❌';
  tildeReplacementButton.title = globalSettings.tildeReplacement ? 'Tilde Replacement Enabled' : 'Tilde Replacement Disabled';
}

// Export functions
export {
  saveGlobalSettings,
  applyFontSize,
  applyMode,
  updateAutoLineBreakButton,
  updateTildeReplacementButton
};
