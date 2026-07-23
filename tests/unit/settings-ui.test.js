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
    <input type="number" id="line-height-setting">
    <input type="number" id="source-line-height-setting">
    <input type="number" id="code-line-height-setting">
    <div id="pinned-note-drag-delay-container">
      <input type="number" id="pinned-note-drag-delay-setting">
    </div>
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

  it('shows the pinned-note hold delay only in global settings', async () => {
    const { populateSettingsForm } = await loadSettingsModule({});
    const container = document.getElementById('pinned-note-drag-delay-container');
    const input = document.getElementById('pinned-note-drag-delay-setting');

    expect(populateSettingsForm(true)).toBe(true);
    expect(container.hidden).toBe(false);
    expect(input.value).toBe('150');

    expect(populateSettingsForm(false, {
      id: 'note-1',
      settings: {},
    })).toBe(true);
    expect(container.hidden).toBe(true);
  });

  it('populates and applies all configured editor line spacing values', async () => {
    const { applyLineHeightSettings, populateSettingsForm } = await loadSettingsModule({
      lineHeight: 1.8,
      sourceLineHeight: 1.3,
      codeLineHeight: 1.4,
    });

    expect(populateSettingsForm(true)).toBe(true);
    expect(document.getElementById('line-height-setting').value).toBe('1.8');
    expect(document.getElementById('source-line-height-setting').value).toBe('1.3');
    expect(document.getElementById('code-line-height-setting').value).toBe('1.4');

    applyLineHeightSettings({
      lineHeight: 2.2,
      sourceLineHeight: 1.6,
      codeLineHeight: 1.7,
    });
    const editorStyle = document.getElementById('markdown-editor').style;
    expect(editorStyle.getPropertyValue('--sidenote-line-height')).toBe('2.2');
    expect(editorStyle.getPropertyValue('--editor-line-height')).toBe('2.2');
    expect(editorStyle.getPropertyValue('--editor-heading-line-height')).toBe('2.2');
    expect(editorStyle.getPropertyValue('--editor-source-line-height')).toBe('1.6');
    expect(editorStyle.getPropertyValue('--editor-code-line-height')).toBe('1.7');
  });

  it('uses note-specific line spacing values when present', async () => {
    const { populateSettingsForm } = await loadSettingsModule({
      lineHeight: 1.6,
      sourceLineHeight: 1.2,
      codeLineHeight: 1.2,
    });

    expect(populateSettingsForm(false, {
      id: 'note-1',
      settings: {
        lineHeight: 2.4,
        sourceLineHeight: 1.8,
        codeLineHeight: 1.9,
      },
    })).toBe(true);
    expect(document.getElementById('line-height-setting').value).toBe('2.4');
    expect(document.getElementById('source-line-height-setting').value).toBe('1.8');
    expect(document.getElementById('code-line-height-setting').value).toBe('1.9');
  });
});
