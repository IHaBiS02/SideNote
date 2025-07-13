let globalSettings = {};
let isGlobalSettings = false;

/**
 * Saves the global settings to storage.
 */
function saveGlobalSettings() {
  browser.storage.local.set({ globalSettings });
}

/**
 * Applies the font size to the editor and preview elements.
 * @param {number} size The font size to apply.
 */
function applyFontSize(size) {
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
    document.body.classList.add('dark-mode');
    themeStylesheet.href = 'vendor/atom-one-dark.css';
  } else if (mode === 'light') {
    document.body.classList.remove('dark-mode');
    themeStylesheet.href = 'vendor/atom-one-light.css';
  } else {
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
function updateAutoLineBreakButton() {
  autoLineBreakButton.textContent = globalSettings.autoLineBreak ? '↩✅' : '↩❌';
  autoLineBreakButton.title = globalSettings.autoLineBreak ? 'Auto Line Break Enabled' : 'Auto Line Break Disabled';
}

/**
 * Updates the tilde replacement button text and title.
 */
function updateTildeReplacementButton() {
  tildeReplacementButton.textContent = globalSettings.tildeReplacement ? '~✅' : '~❌';
  tildeReplacementButton.title = globalSettings.tildeReplacement ? 'Tilde Replacement Enabled' : 'Tilde Replacement Disabled';
}
