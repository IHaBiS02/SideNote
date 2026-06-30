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
});
