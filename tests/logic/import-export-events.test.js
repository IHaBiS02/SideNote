import { describe, it, expect, beforeEach, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  saveNote: vi.fn().mockResolvedValue(),
  sortNotes: vi.fn(),
  renderMarkdown: vi.fn(),
  renderNoteList: vi.fn(),
  createAllNotesArchive: vi.fn(),
  createSingleNoteArchive: vi.fn(),
  parseSnote: vi.fn(),
  saveImportedNotes: vi.fn(),
  saveParsedSnote: vi.fn(),
  saveParsedSnoteImages: vi.fn().mockResolvedValue(),
}));

vi.mock('../../src/database/index.js', () => ({
  saveNote: mocks.saveNote,
}));

vi.mock('../../src/notes.js', () => ({
  sortNotes: mocks.sortNotes,
}));

vi.mock('../../src/notes_view/index.js', () => ({
  renderMarkdown: mocks.renderMarkdown,
  renderNoteList: mocks.renderNoteList,
}));

vi.mock('../../src/import_export.js', () => ({
  createAllNotesArchive: mocks.createAllNotesArchive,
  createSingleNoteArchive: mocks.createSingleNoteArchive,
  parseSnote: mocks.parseSnote,
  saveImportedNotes: mocks.saveImportedNotes,
  saveParsedSnote: mocks.saveParsedSnote,
  saveParsedSnoteImages: mocks.saveParsedSnoteImages,
}));

describe('import/export events', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    document.body.innerHTML = `
      <button id="global-export-button"></button>
      <button id="global-import-button"></button>
      <input id="global-import-input" type="file" />
      <button id="export-note-button"></button>
      <button id="import-note-button"></button>
      <input id="import-note-input" type="file" />
      <h1 id="editor-title"></h1>
      <textarea id="markdown-editor"></textarea>
    `;
    globalThis.JSZip = {
      loadAsync: vi.fn().mockResolvedValue({}),
    };
  });

  it('imports a .snote into the active note without creating an extra saved note', async () => {
    const parsedNote = {
      title: 'Imported',
      content: '# Imported',
      settings: { fontSize: 18 },
      metadata: { createdAt: 100, lastModified: 200 },
      images: [{ id: 'img1', blob: new Blob(['image'], { type: 'image/png' }) }],
    };
    mocks.parseSnote.mockResolvedValue(parsedNote);

    const state = await import('../../src/state.js');
    state.setNotes([{
      id: 'active-note',
      title: 'Old',
      content: 'Old content',
      settings: {},
      metadata: { createdAt: 1, lastModified: 2 },
      isPinned: false,
    }]);
    state.setActiveNoteId('active-note');

    const { initializeImportExportEvents } = await import('../../src/events/import-export-events.js');
    initializeImportExportEvents();

    const importInput = document.getElementById('import-note-input');
    Object.defineProperty(importInput, 'files', {
      value: [new File(['zip'], 'import.snote')],
      configurable: true,
    });
    importInput.dispatchEvent(new Event('change'));
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(mocks.parseSnote).toHaveBeenCalledTimes(1);
    expect(mocks.saveParsedSnoteImages).toHaveBeenCalledWith(parsedNote);
    expect(mocks.saveParsedSnote).not.toHaveBeenCalled();
    expect(mocks.saveNote).toHaveBeenCalledTimes(1);
    expect(state.notes).toHaveLength(1);
    expect(state.notes[0].title).toBe('Imported');
    expect(state.notes[0].content).toBe('# Imported');
    expect(document.getElementById('markdown-editor').value).toBe('# Imported');
    expect(mocks.renderMarkdown).toHaveBeenCalled();
  });
});
