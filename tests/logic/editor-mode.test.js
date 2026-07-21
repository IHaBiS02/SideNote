import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('editor display modes', () => {
  beforeEach(() => {
    vi.resetModules();
    document.body.innerHTML = `
      <div id="markdown-editor"></div>
      <button id="toggle-view-button"></button>
    `;
  });

  async function setup(settings = {}) {
    const state = await import('../../src/state.js');
    state.setGlobalSettings(settings);
    state.setIsPreview(false);
    const editor = document.getElementById('markdown-editor');
    editor.setMode = vi.fn();
    editor.focus = vi.fn();
    const mode = await import('../../src/notes_view/editor-mode.js');
    return { editor, mode, state };
  }

  it('toggles between editable Preview and full Markdown source mode', async () => {
    const { editor, mode } = await setup();

    mode.togglePreview();
    expect(editor.setMode).toHaveBeenLastCalledWith('wysiwyg');
    expect(document.getElementById('toggle-view-button').textContent).toBe('Edit');

    mode.togglePreview();
    expect(editor.setMode).toHaveBeenLastCalledWith('source');
    expect(document.getElementById('toggle-view-button').textContent).toBe('Preview');
    expect(editor.focus).toHaveBeenCalled();
  });

  it('uses the same editor in readonly mode when editable Preview is disabled', async () => {
    const { editor, mode } = await setup({ wysiwygPreview: false });

    mode.togglePreview();

    expect(editor.setMode).toHaveBeenLastCalledWith('readonly');
    expect(editor.style.display).toBe('block');
    expect(document.getElementById('toggle-view-button').textContent).toBe('Edit');
  });
});
