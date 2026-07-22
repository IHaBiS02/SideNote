import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  openNote: vi.fn(),
  togglePreview: vi.fn(),
  showImageModal: vi.fn(),
  renderNoteList: vi.fn(),
  sortNotes: vi.fn(),
  saveNote: vi.fn().mockResolvedValue(),
  pushToHistory: vi.fn(),
}));

vi.mock('../../src/notes.js', () => ({
  sortNotes: mocks.sortNotes,
}));

vi.mock('../../src/notes_view/index.js', () => ({
  openNote: mocks.openNote,
  togglePreview: mocks.togglePreview,
  showImageModal: mocks.showImageModal,
  renderNoteList: mocks.renderNoteList,
}));

vi.mock('../../src/database/index.js', () => ({
  saveNote: mocks.saveNote,
}));

vi.mock('../../src/history.js', () => ({
  pushToHistory: mocks.pushToHistory,
}));

vi.mock('../../src/settings.js', () => ({
  resolveEffectiveSettings: vi.fn(() => ({ title: 'default' })),
}));

describe('editor events', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    document.body.innerHTML = `
      <button id="new-note-button"></button>
      <div id="editor-title"></div>
      <div id="markdown-editor"></div>
      <button id="toggle-view-button"></button>
    `;
  });

  it('opens a newly created note in editable WYSIWYG Preview mode', async () => {
    const state = await import('../../src/state.js');
    state.setNotes([]);
    const { initializeEditorEvents } = await import('../../src/events/editor.js');
    initializeEditorEvents();

    document.getElementById('new-note-button').click();

    await vi.waitFor(() => expect(mocks.saveNote).toHaveBeenCalledOnce());
    const newNote = state.notes[0];
    expect(newNote).toMatchObject({ title: 'New Note', content: '' });
    expect(mocks.pushToHistory).toHaveBeenCalledOnce();
    expect(mocks.pushToHistory).toHaveBeenCalledWith({
      view: 'editor',
      params: { noteId: newNote.id, inEditMode: false },
    });
    expect(mocks.openNote).toHaveBeenCalledWith(newNote.id, false, false);
  });

  it('leaves Shift+Enter to the WYSIWYG soft-break handler', async () => {
    const { initializeEditorEvents } = await import('../../src/events/editor.js');
    const editor = document.getElementById('markdown-editor');
    editor.mode = 'wysiwyg';
    initializeEditorEvents();

    editor.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true, bubbles: true }),
    );

    expect(mocks.togglePreview).not.toHaveBeenCalled();
  });

  it('keeps Shift+Enter as a Preview shortcut in source mode', async () => {
    const { initializeEditorEvents } = await import('../../src/events/editor.js');
    const editor = document.getElementById('markdown-editor');
    editor.mode = 'source';
    initializeEditorEvents();

    editor.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true, bubbles: true }),
    );

    expect(mocks.togglePreview).toHaveBeenCalledOnce();
  });

  it('does not treat Shift+Enter in readonly Preview as a mode shortcut', async () => {
    const { initializeEditorEvents } = await import('../../src/events/editor.js');
    const editor = document.getElementById('markdown-editor');
    editor.mode = 'readonly';
    initializeEditorEvents();

    editor.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true, bubbles: true }),
    );

    expect(mocks.togglePreview).not.toHaveBeenCalled();
  });

  it('treats readonly editor mode as Preview state', async () => {
    const state = await import('../../src/state.js');
    state.setIsPreview(false);
    const { initializeEditorEvents } = await import('../../src/events/editor.js');
    const editor = document.getElementById('markdown-editor');
    initializeEditorEvents();

    editor.dispatchEvent(new CustomEvent('mode-change', {
      bubbles: true,
      detail: { mode: 'readonly' },
    }));

    expect(state.isPreview).toBe(true);
    expect(document.getElementById('toggle-view-button').textContent).toBe('Edit');
    expect(mocks.pushToHistory).toHaveBeenCalledWith({
      view: 'editor',
      params: { noteId: null, inEditMode: false },
    });
  });

  it('opens the image modal from the editor image activation event', async () => {
    const { initializeEditorEvents } = await import('../../src/events/editor.js');
    const editor = document.getElementById('markdown-editor');
    initializeEditorEvents();

    editor.dispatchEvent(new CustomEvent('image-activate', {
      detail: {
        source: 'images/example.png',
        displaySource: 'blob:example',
      },
    }));

    expect(mocks.showImageModal).toHaveBeenCalledWith('blob:example');
  });

  it('finishes title editing on Escape without bubbling to global navigation', async () => {
    const state = await import('../../src/state.js');
    const note = {
      id: 'note-1',
      title: 'Before',
      content: '',
      settings: { title: 'custom' },
      metadata: { createdAt: 1, lastModified: 1 },
      isPinned: false,
    };
    state.setNotes([note]);
    state.setActiveNoteId(note.id);
    const { initializeEditorEvents } = await import('../../src/events/editor.js');
    initializeEditorEvents();

    const title = document.getElementById('editor-title');
    title.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    const input = document.querySelector('.title-input');
    input.value = 'After';
    const globalKeydown = vi.fn();
    document.addEventListener('keydown', globalKeydown);

    const event = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
      cancelable: true,
    });
    input.dispatchEvent(event);
    document.removeEventListener('keydown', globalKeydown);

    expect(event.defaultPrevented).toBe(true);
    expect(globalKeydown).not.toHaveBeenCalled();
    await vi.waitFor(() => expect(document.querySelector('.title-input')).toBeNull());
    expect(document.getElementById('editor-title')?.textContent).toBe('After');
    expect(note.title).toBe('After');
    expect(mocks.saveNote).toHaveBeenCalled();
  });
});
