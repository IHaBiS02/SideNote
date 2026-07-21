import { describe, it, expect, beforeEach, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  saveNote: vi.fn().mockResolvedValue(),
  sortNotes: vi.fn(),
  renderNoteList: vi.fn(),
  createAllNotesArchive: vi.fn(),
  createSingleNoteArchive: vi.fn(),
  downloadFile: vi.fn(),
  getTimestamp: vi.fn(() => '2026_01_02_03_04_05'),
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

vi.mock('../../src/utils.js', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    downloadFile: mocks.downloadFile,
    getTimestamp: mocks.getTimestamp,
  };
});

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
    URL.createObjectURL = vi.fn(() => 'blob:export');
    URL.revokeObjectURL = vi.fn();
    HTMLAnchorElement.prototype.click = vi.fn();
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
  });

  it('keeps the default all-notes export as .snotes on left click', async () => {
    const blob = new Blob(['snotes'], { type: 'application/zip' });
    const generateAsync = vi.fn().mockResolvedValue(blob);
    mocks.createAllNotesArchive.mockResolvedValue({ generateAsync });

    const state = await import('../../src/state.js');
    state.setNotes([{
      id: 'note-1',
      title: 'Note',
      content: 'line 1\nline 2',
      settings: {},
      metadata: { createdAt: 1, lastModified: 2 },
      isPinned: false,
    }]);

    const { initializeImportExportEvents } = await import('../../src/events/import-export-events.js');
    initializeImportExportEvents();

    document.getElementById('global-export-button').dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    );
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(mocks.createAllNotesArchive).toHaveBeenCalledWith(
      state.notes,
      { addTwoSpaceLineBreaks: false, useTitleFolderNames: false }
    );
    expect(generateAsync).toHaveBeenCalledWith({ type: 'blob' });
    expect(mocks.downloadFile).toHaveBeenCalledWith(
      blob,
      'notes_2026_01_02_03_04_05.snotes'
    );
  });

  it('shows zip above the archive format and exports original markdown on zip click', async () => {
    const blob = new Blob(['zip'], { type: 'application/zip' });
    const generateAsync = vi.fn().mockResolvedValue(blob);
    mocks.createAllNotesArchive.mockResolvedValue({ generateAsync });

    const state = await import('../../src/state.js');
    state.setNotes([{
      id: 'note-1',
      title: 'Note',
      content: 'line 1\nline 2',
      settings: {},
      metadata: { createdAt: 1, lastModified: 2 },
      isPinned: false,
    }]);

    const { initializeImportExportEvents } = await import('../../src/events/import-export-events.js');
    initializeImportExportEvents();

    const globalExportButton = document.getElementById('global-export-button');
    globalExportButton.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }));

    const menuItems = document.querySelectorAll('.export-options-dropdown > div');
    expect(menuItems[0].textContent).toBe('Export as .zip');
    expect(menuItems[1].textContent).toBe('Export as .snotes');

    menuItems[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(mocks.createAllNotesArchive).toHaveBeenCalledWith(
      state.notes,
      { addTwoSpaceLineBreaks: false, useTitleFolderNames: true }
    );
    expect(mocks.downloadFile).toHaveBeenCalledWith(
      blob,
      'notes_2026_01_02_03_04_05.zip'
    );
  });

  it('exports all notes as zip with two-space line breaks from options inserted above the zip item', async () => {
    const generateAsync = vi.fn().mockResolvedValue(new Blob(['zip'], { type: 'application/zip' }));
    mocks.createAllNotesArchive.mockResolvedValue({ generateAsync });

    const state = await import('../../src/state.js');
    state.setNotes([{
      id: 'note-1',
      title: 'Note',
      content: 'line 1\nline 2',
      settings: {},
      metadata: { createdAt: 1, lastModified: 2 },
      isPinned: false,
    }]);

    const { initializeImportExportEvents } = await import('../../src/events/import-export-events.js');
    initializeImportExportEvents();

    const globalExportButton = document.getElementById('global-export-button');
    globalExportButton.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }));

    const zipItem = document.querySelector('.export-options-dropdown .export-zip-option');
    zipItem.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }));

    const menuItems = document.querySelectorAll('.export-options-dropdown > div');
    expect(menuItems[0].textContent).toBe('Export original');
    expect(menuItems[1].textContent).toBe('Export with two-space line breaks');
    expect(menuItems[2]).toBe(zipItem);

    menuItems[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(mocks.createAllNotesArchive).toHaveBeenCalledWith(
      state.notes,
      { addTwoSpaceLineBreaks: true, useTitleFolderNames: true }
    );
    expect(generateAsync).toHaveBeenCalledWith({ type: 'blob' });
  });

  it('keeps the export dropdown bottom stable when zip options are inserted', async () => {
    const state = await import('../../src/state.js');
    state.setNotes([]);

    const { initializeImportExportEvents } = await import('../../src/events/import-export-events.js');
    initializeImportExportEvents();

    const globalExportButton = document.getElementById('global-export-button');
    globalExportButton.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }));

    const dropdown = document.querySelector('.export-options-dropdown');
    Object.defineProperty(dropdown, 'offsetHeight', {
      configurable: true,
      get: () => dropdown.children.length * 20,
    });
    dropdown.style.top = '100px';
    dropdown.getBoundingClientRect = () => ({
      bottom: parseInt(dropdown.style.top, 10) + dropdown.offsetHeight,
    });

    const zipItem = document.querySelector('.export-options-dropdown .export-zip-option');
    zipItem.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }));

    expect(dropdown.style.top).toBe('60px');
    expect(dropdown.getBoundingClientRect().bottom).toBe(140);
  });
});
