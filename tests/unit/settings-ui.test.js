import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

function renderSettingsDom() {
  document.body.innerHTML = `
    <textarea id="markdown-editor"></textarea>
    <div id="html-preview"></div>
    <input type="checkbox" id="auto-line-break-button">
    <div id="auto-line-break-setting" hidden></div>
    <input type="checkbox" id="tilde-replacement-button">
    <input type="checkbox" id="legacy-line-break-mode-checkbox">
    <select id="title-setting"></select>
    <input type="number" id="font-size-setting">
    <select id="mode-setting"></select>
    <input type="checkbox" id="auto-add-spaces-checkbox">
    <div id="auto-add-spaces-setting" hidden></div>
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

  it('hides legacy line-break sub-options when legacy mode is off', async () => {
    const { updateLegacyLineBreakControls } = await loadSettingsModule({
      legacyLineBreakMode: false,
      autoLineBreak: true,
      autoAddSpaces: true,
    });

    updateLegacyLineBreakControls();

    expect(document.getElementById('legacy-line-break-mode-checkbox').checked).toBe(false);
    expect(document.getElementById('auto-line-break-setting').hidden).toBe(true);
    expect(document.getElementById('auto-add-spaces-setting').hidden).toBe(true);
    expect(document.getElementById('auto-line-break-button').disabled).toBe(true);
    expect(document.getElementById('auto-add-spaces-checkbox').disabled).toBe(true);
  });

  it('shows legacy line-break sub-options below legacy mode when enabled', async () => {
    const { updateLegacyLineBreakControls } = await loadSettingsModule({
      legacyLineBreakMode: true,
      autoLineBreak: true,
      autoAddSpaces: true,
    });

    updateLegacyLineBreakControls();

    expect(document.getElementById('legacy-line-break-mode-checkbox').checked).toBe(true);
    expect(document.getElementById('auto-line-break-setting').hidden).toBe(false);
    expect(document.getElementById('auto-add-spaces-setting').hidden).toBe(false);
    expect(document.getElementById('auto-line-break-button').checked).toBe(true);
    expect(document.getElementById('auto-add-spaces-checkbox').checked).toBe(true);
    expect(document.getElementById('auto-line-break-button').disabled).toBe(false);
    expect(document.getElementById('auto-add-spaces-checkbox').disabled).toBe(false);
  });
});
