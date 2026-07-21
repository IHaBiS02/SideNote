import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

function renderSettingsDom() {
  document.body.innerHTML = `
    <textarea id="markdown-editor"></textarea>
    <button id="auto-line-break-button" hidden>↩</button>
    <button id="tilde-replacement-button" hidden>~</button>
    <input type="checkbox" id="show-tilde-replacement-button-checkbox">
    <input type="checkbox" id="legacy-line-break-mode-checkbox">
    <select id="title-setting"></select>
    <input type="number" id="font-size-setting">
    <select id="mode-setting"></select>
    <input type="checkbox" id="code-block-header-checkbox">
    <input type="checkbox" id="wysiwyg-preview-checkbox">
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

  it('shows legacy line-break controls when legacy mode is enabled', async () => {
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
    expect(document.getElementById('tilde-replacement-button').hidden).toBe(true);
  });

  it('shows the tilde replacement toolbar button only when enabled in settings', async () => {
    const { updateTildeReplacementButton } = await loadSettingsModule({
      showTildeReplacementButton: true,
      tildeReplacement: true,
    });

    updateTildeReplacementButton();

    expect(document.getElementById('tilde-replacement-button').hidden).toBe(false);
    expect(document.getElementById('tilde-replacement-button').textContent).toBe('~✅');
    expect(document.getElementById('tilde-replacement-button').title).toBe('Tilde Replacement Enabled');
  });

  it('enables editable WYSIWYG Preview by default', async () => {
    const { populateSettingsForm } = await loadSettingsModule({});

    expect(populateSettingsForm(true)).toBe(true);
    expect(document.getElementById('wysiwyg-preview-checkbox').checked).toBe(true);
  });
});
