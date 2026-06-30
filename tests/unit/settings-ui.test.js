import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

function renderSettingsDom() {
  document.body.innerHTML = `
    <textarea id="markdown-editor"></textarea>
    <div id="html-preview"></div>
    <button id="auto-line-break-button" hidden>↩</button>
    <button id="tilde-replacement-button">~</button>
    <input type="checkbox" id="legacy-line-break-mode-checkbox">
    <select id="title-setting"></select>
    <input type="number" id="font-size-setting">
    <select id="mode-setting"></select>
    <button id="auto-add-spaces-button" hidden>⏎</button>
    <input type="checkbox" id="code-block-header-checkbox">
    <input type="checkbox" id="prevent-used-image-deletion-checkbox">
  `;
}

async function loadSettingsModule(globalSettings) {
  vi.resetModules();
  renderSettingsDom();

  const state = await import('../../src/state.js');
  state.setGlobalSettings(globalSettings);

  return import('../../src/settings.js');
}

describe('settings UI helpers', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('hides legacy line-break toolbar buttons when legacy mode is off', async () => {
    const { updateLegacyLineBreakControls } = await loadSettingsModule({
      legacyLineBreakMode: false,
      autoLineBreak: true,
      autoAddSpaces: true,
    });

    updateLegacyLineBreakControls();

    expect(document.getElementById('legacy-line-break-mode-checkbox').checked).toBe(false);
    expect(document.getElementById('auto-line-break-button').hidden).toBe(true);
    expect(document.getElementById('auto-add-spaces-button').hidden).toBe(true);
    expect(document.getElementById('auto-line-break-button').disabled).toBe(true);
    expect(document.getElementById('auto-add-spaces-button').disabled).toBe(true);
  });

  it('shows legacy line-break toolbar buttons when legacy mode is enabled', async () => {
    const { updateLegacyLineBreakControls } = await loadSettingsModule({
      legacyLineBreakMode: true,
      autoLineBreak: true,
      autoAddSpaces: true,
    });

    updateLegacyLineBreakControls();

    expect(document.getElementById('legacy-line-break-mode-checkbox').checked).toBe(true);
    expect(document.getElementById('auto-line-break-button').hidden).toBe(false);
    expect(document.getElementById('auto-add-spaces-button').hidden).toBe(false);
    expect(document.getElementById('auto-line-break-button').textContent).toBe('↩✅');
    expect(document.getElementById('auto-add-spaces-button').textContent).toBe('⏎✅');
    expect(document.getElementById('auto-line-break-button').disabled).toBe(false);
    expect(document.getElementById('auto-add-spaces-button').disabled).toBe(false);
  });

  it('uses the legacy toolbar labels for auto line break and tilde buttons', async () => {
    const { updateAutoLineBreakButton, updateTildeReplacementButton } = await loadSettingsModule({
      legacyLineBreakMode: true,
      autoLineBreak: true,
      tildeReplacement: true,
    });

    updateAutoLineBreakButton();
    updateTildeReplacementButton();

    expect(document.getElementById('auto-line-break-button').textContent).toBe('↩✅');
    expect(document.getElementById('auto-line-break-button').title).toBe('Auto Line Break Enabled');
    expect(document.getElementById('tilde-replacement-button').textContent).toBe('~✅');
    expect(document.getElementById('tilde-replacement-button').title).toBe('Tilde Replacement Enabled');
  });
});
