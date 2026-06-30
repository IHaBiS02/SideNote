import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

function renderSettingsDom() {
  document.body.innerHTML = `
    <textarea id="markdown-editor"></textarea>
    <div id="html-preview"></div>
    <button id="auto-line-break-button" hidden>↩</button>
    <input type="checkbox" id="tilde-replacement-button">
    <input type="checkbox" id="legacy-line-break-mode-checkbox">
    <select id="title-setting"></select>
    <input type="number" id="font-size-setting">
    <select id="mode-setting"></select>
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

  it('hides the legacy auto line break toolbar button when legacy mode is off', async () => {
    const { updateLegacyLineBreakControls } = await loadSettingsModule({
      legacyLineBreakMode: false,
      autoLineBreak: true,
    });

    updateLegacyLineBreakControls();

    expect(document.getElementById('legacy-line-break-mode-checkbox').checked).toBe(false);
    expect(document.getElementById('auto-line-break-button').hidden).toBe(true);
    expect(document.getElementById('auto-line-break-button').disabled).toBe(true);
  });

  it('shows the legacy auto line break toolbar button when legacy mode is enabled', async () => {
    const { updateLegacyLineBreakControls } = await loadSettingsModule({
      legacyLineBreakMode: true,
      autoLineBreak: true,
    });

    updateLegacyLineBreakControls();

    expect(document.getElementById('legacy-line-break-mode-checkbox').checked).toBe(true);
    expect(document.getElementById('auto-line-break-button').hidden).toBe(false);
    expect(document.getElementById('auto-line-break-button').textContent).toBe('↩✅');
    expect(document.getElementById('auto-line-break-button').disabled).toBe(false);
  });

  it('uses the legacy toolbar label for auto line break', async () => {
    const { updateAutoLineBreakButton, updateTildeReplacementButton } = await loadSettingsModule({
      legacyLineBreakMode: true,
      autoLineBreak: true,
      tildeReplacement: true,
    });

    updateAutoLineBreakButton();
    updateTildeReplacementButton();

    expect(document.getElementById('auto-line-break-button').textContent).toBe('↩✅');
    expect(document.getElementById('auto-line-break-button').title).toBe('Auto Line Break Enabled');
    expect(document.getElementById('tilde-replacement-button').checked).toBe(true);
    expect(document.getElementById('tilde-replacement-button').title).toBe('Tilde Replacement Enabled');
  });
});
