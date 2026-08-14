import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getNote: vi.fn(),
  togglePin: vi.fn().mockResolvedValue(),
  deleteNote: vi.fn().mockResolvedValue(),
  reorderPinnedNotes: vi.fn().mockResolvedValue(false),
  createPinnedNoteDragController: vi.fn(() => ({ destroy: vi.fn() })),
  applyFontSize: vi.fn(),
  applyLineHeightSettings: vi.fn(),
  updateLegacyLineBreakControls: vi.fn(),
  updateTildeReplacementButton: vi.fn(),
  showEditorView: vi.fn(),
  applyEditorDisplayMode: vi.fn(),
  pushToHistory: vi.fn(),
}));

vi.mock('../../src/database/index.js', () => ({
  getNote: mocks.getNote,
}));

vi.mock('../../src/notes.js', () => ({
  togglePin: mocks.togglePin,
  deleteNote: mocks.deleteNote,
  reorderPinnedNotes: mocks.reorderPinnedNotes,
}));

vi.mock('../../src/notes_view/pinned-note-drag.js', () => ({
  createPinnedNoteDragController: mocks.createPinnedNoteDragController,
}));

vi.mock('../../src/settings.js', () => ({
  applyFontSize: mocks.applyFontSize,
  applyLineHeightSettings: mocks.applyLineHeightSettings,
  isCodeBlockHeaderEnabled: vi.fn(() => true),
  normalizeGlobalSettings: vi.fn(() => ({ pinnedNoteDragDelayMs: 150 })),
  resolveEffectiveSettings: vi.fn(() => ({ fontSize: 14 })),
  updateLegacyLineBreakControls: mocks.updateLegacyLineBreakControls,
  updateTildeReplacementButton: mocks.updateTildeReplacementButton,
}));

vi.mock('../../src/history.js', () => ({
  pushToHistory: mocks.pushToHistory,
}));

vi.mock('../../src/notes_view/view-manager.js', () => ({
  showEditorView: mocks.showEditorView,
}));

vi.mock('../../src/notes_view/editor-mode.js', () => ({
  applyEditorDisplayMode: mocks.applyEditorDisplayMode,
}));

function summary(id, title, isPinned = false) {
  return {
    id,
    title,
    isPinned,
    metadata: { createdAt: 1, lastModified: 2 },
  };
}

describe('note list renderer', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    document.body.innerHTML = `
      <ul id="note-list"></ul>
      <div id="markdown-editor"></div>
      <h1 id="editor-title"></h1>
    `;
    const editor = document.getElementById('markdown-editor');
    editor.value = '';
    editor.showCodeBlockHeader = false;
  });

  it('renders all rows through one fragment and keeps one delegated click handler', async () => {
    const state = await import('../../src/state.js');
    state.setNotes([summary('one', 'One'), summary('two', 'Two', true)]);
    const fragmentSpy = vi.spyOn(document, 'createDocumentFragment');
    const { renderNoteList } = await import('../../src/notes_view/note-renderer.js');

    renderNoteList();
    renderNoteList();

    expect(fragmentSpy).toHaveBeenCalledTimes(2);
    expect(document.querySelectorAll('#note-list > li')).toHaveLength(2);
    document.querySelector('[data-note-id="one"] .pin-note-icon').click();
    await Promise.resolve();
    await Promise.resolve();
    expect(mocks.togglePin).toHaveBeenCalledTimes(1);
    expect(mocks.togglePin).toHaveBeenCalledWith('one');
  });

  it('hydrates Markdown only when a summary row is opened', async () => {
    const fullNote = {
      ...summary('one', 'One'),
      content: '# Body',
      settings: {},
    };
    mocks.getNote.mockResolvedValue(fullNote);
    const state = await import('../../src/state.js');
    state.setNotes([summary('one', 'One')]);
    const { renderNoteList } = await import('../../src/notes_view/note-renderer.js');
    renderNoteList();

    document.querySelector('[data-note-id="one"] > span').click();
    await Promise.resolve();
    await Promise.resolve();

    expect(mocks.getNote).toHaveBeenCalledWith('one');
    expect(state.notes[0]).toBe(fullNote);
    expect(document.getElementById('markdown-editor').value).toBe('# Body');
    expect(mocks.showEditorView).toHaveBeenCalledTimes(1);
  });
});
