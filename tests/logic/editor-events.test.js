import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  openNote: vi.fn(),
  renderMarkdown: vi.fn(),
  togglePreview: vi.fn(),
  showImageModal: vi.fn(),
  renderNoteList: vi.fn(),
  sortNotes: vi.fn(),
  saveNote: vi.fn().mockResolvedValue(),
  saveImage: vi.fn().mockResolvedValue(),
  pushToHistory: vi.fn(),
}));

vi.mock('../../src/notes.js', () => ({
  sortNotes: mocks.sortNotes,
}));

vi.mock('../../src/notes_view/index.js', () => ({
  openNote: mocks.openNote,
  renderMarkdown: mocks.renderMarkdown,
  togglePreview: mocks.togglePreview,
  showImageModal: mocks.showImageModal,
  renderNoteList: mocks.renderNoteList,
}));

vi.mock('../../src/database/index.js', () => ({
  saveNote: mocks.saveNote,
  saveImage: mocks.saveImage,
}));

vi.mock('../../src/history.js', () => ({
  pushToHistory: mocks.pushToHistory,
}));

vi.mock('../../src/settings.js', () => ({
  resolveEffectiveSettings: vi.fn(() => ({ title: 'default' })),
  resolveLegacyTextProcessingSettings: vi.fn(() => ({})),
}));

vi.mock('../../src/text-processors.js', () => ({
  processPastedText: vi.fn(text => text),
  handleEnterKeyInput: vi.fn(),
  toggleMarkdownCheckbox: vi.fn(),
}));

describe('editor events', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    document.body.innerHTML = `
      <button id="new-note-button"></button>
      <div id="editor-title"></div>
      <div id="markdown-editor"></div>
      <div id="html-preview"></div>
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
});
