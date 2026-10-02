import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getNote: vi.fn(),
  visibleItems: vi.fn(),
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

vi.mock('../../src/folders.js', async importOriginal => ({
  ...await importOriginal(),
  visibleItems: mocks.visibleItems,
  toggleItemPin: mocks.togglePin,
  trashItem: mocks.deleteNote,
  reorderItems: mocks.reorderPinnedNotes,
}));

vi.mock('../../src/notes_view/pinned-note-drag.js', () => ({
  createPinnedNoteDragController: mocks.createPinnedNoteDragController,
}));

vi.mock('../../src/settings.js', () => ({
  applyFontSize: mocks.applyFontSize,
  applyLineHeightSettings: mocks.applyLineHeightSettings,
  isCodeBlockHeaderEnabled: vi.fn(() => true),
  normalizeGlobalSettings: vi.fn(() => ({ pinnedNoteDragDelayMs: 350 })),
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
  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();
    const state = await import('../../src/state.js');
    const { children } = await import('../../src/folder-model.js');
    mocks.visibleItems.mockImplementation(() => children({ notes: state.notes, folders: state.folders }, state.currentFolderId));
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
  it('locks Ctrl/Shift selection to the initial pin section and preserves selection order for dragging', async () => {
    const state = await import('../../src/state.js');
    state.setNotes([summary('p1', 'P1', true), summary('p2', 'P2', true), summary('u1', 'U1'), summary('u2', 'U2')]);
    const { renderNoteList } = await import('../../src/notes_view/note-renderer.js');
    renderNoteList();
    const click = (id, modifiers) => document.querySelector(`[data-note-id="${id}"]`).dispatchEvent(new MouseEvent('click', { bubbles: true, ...modifiers }));
    click('p1', { ctrlKey: true });
    click('u1', { ctrlKey: true });
    click('u2', { shiftKey: true });
    expect([...document.querySelectorAll('.item-selected')].map(e => e.dataset.noteId)).toEqual(['p1']);
    click('p2', { shiftKey: true });
    expect([...document.querySelectorAll('.item-selected')].map(e => e.dataset.noteId)).toEqual(['p1', 'p2']);
    const options = mocks.createPinnedNoteDragController.mock.calls.at(-1)[2];
    expect(options.getDragIds('p2')).toEqual(['p1', 'p2']);
    click('p1', { ctrlKey: true }); click('p2', { ctrlKey: true });
    click('u2', { metaKey: true }); click('u1', { shiftKey: true });
    expect(options.getDragIds('u1')).toEqual(['u1', 'u2']);
  });

  it('renders only direct children and clears selection after changing folder', async () => {
    const state = await import('../../src/state.js');
    state.setFolders([{ ...summary('folder', 'Folder'), kind: 'folder', parentId: null, ownModifiedAt: 1 }]);
    state.setNotes([summary('root', 'Root'), { ...summary('child', 'Child'), parentId: 'folder' }]);
    const { renderNoteList } = await import('../../src/notes_view/note-renderer.js');
    renderNoteList();
    expect([...document.querySelectorAll('[data-note-id]')].map(e => e.dataset.noteId)).toEqual(['root', 'folder']);
    document.querySelector('[data-note-id="root"]').dispatchEvent(new MouseEvent('click', { bubbles: true, ctrlKey: true }));
    state.setCurrentFolderId('folder'); renderNoteList();
    expect(document.querySelectorAll('[data-note-id]')).toHaveLength(1);
    expect(document.querySelector('[data-note-id]').dataset.noteId).toBe('child');
    expect(document.querySelector('.item-selected')).toBeNull();
  });

});
