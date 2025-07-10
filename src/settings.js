let globalSettings = {};
let isGlobalSettings = false;

function saveGlobalSettings() {
  chrome.storage.local.set({ globalSettings });
}

function applyFontSize(size) {
  const editorElements = [markdownEditor, htmlPreview];
  editorElements.forEach(el => {
    el.style.fontSize = `${size}px`;
  });
}

function applyMode(mode) {
  if (mode === 'dark') {
    document.body.classList.add('dark-mode');
  } else if (mode === 'light') {
    document.body.classList.remove('dark-mode');
  } else {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
}

function updateAutoLineBreakButton() {
  autoLineBreakButton.textContent = globalSettings.autoLineBreak ? '↩✅' : '↩❌';
  autoLineBreakButton.title = globalSettings.autoLineBreak ? 'Auto Line Break Enabled' : 'Auto Line Break Disabled';
}

function updateTildeReplacementButton() {
  tildeReplacementButton.textContent = globalSettings.tildeReplacement ? '~✅' : '~❌';
  tildeReplacementButton.title = globalSettings.tildeReplacement ? 'Tilde Replacement Enabled' : 'Tilde Replacement Disabled';
}