import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

const mocks = vi.hoisted(() => {
  const calls = [];
  return {
    calls,
    initDB: vi.fn(async () => calls.push('initDB')),
    saveNote: vi.fn(async () => calls.push('saveNote')),
    getAllNotes: vi.fn(async () => {
      calls.push('getAllNotes');
      return [];
    }),
    getAllImageObjectsFromDB: vi.fn(async () => {
      calls.push('getAllImageObjectsFromDB');
      return [];
    }),
    deleteNotePermanentlyDB: vi.fn(async () => calls.push('deleteNotePermanentlyDB')),
    deleteImagePermanently: vi.fn(async () => calls.push('deleteImagePermanently')),
    sortNotes: vi.fn(() => calls.push('sortNotes')),
    applyFontSize: vi.fn(() => calls.push('applyFontSize')),
    applyMode: vi.fn(() => calls.push('applyMode')),
    normalizeGlobalSettings: vi.fn((settings = {}) => ({
      title: 'default',
      fontSize: 12,
      wysiwygPreview: true,
      legacyLineBreakMode: false,
      autoLineBreak: false,
      autoAddSpaces: false,
      showTildeReplacementButton: false,
      tildeReplacement: false,
      codeBlockHeader: true,
      preventUsedImageDeletion: true,
      mode: 'system',
      ...(settings || {}),
    })),
    updateLegacyLineBreakControls: vi.fn(() => calls.push('updateLegacyLineBreakControls')),
    updateTildeReplacementButton: vi.fn(() => calls.push('updateTildeReplacementButton')),
    showListView: vi.fn(() => calls.push('showListView')),
    initializeAllEvents: vi.fn(() => calls.push('initializeAllEvents')),
  };
});

vi.mock('../../src/database/index.js', () => ({
  initDB: mocks.initDB,
  saveNote: mocks.saveNote,
  getAllNotes: mocks.getAllNotes,
  getAllImageObjectsFromDB: mocks.getAllImageObjectsFromDB,
  deleteNotePermanentlyDB: mocks.deleteNotePermanentlyDB,
  deleteImagePermanently: mocks.deleteImagePermanently,
}));

vi.mock('../../src/notes.js', () => ({
  sortNotes: mocks.sortNotes,
}));

vi.mock('../../src/settings.js', () => ({
  applyFontSize: mocks.applyFontSize,
  applyMode: mocks.applyMode,
  normalizeGlobalSettings: mocks.normalizeGlobalSettings,
  updateLegacyLineBreakControls: mocks.updateLegacyLineBreakControls,
  updateTildeReplacementButton: mocks.updateTildeReplacementButton,
}));

vi.mock('../../src/notes_view/index.js', () => ({
  showListView: mocks.showListView,
}));

vi.mock('../../src/events/index.js', () => ({
  initializeAllEvents: mocks.initializeAllEvents,
}));

describe('main bootstrap', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    mocks.calls.length = 0;
    globalThis.__SIDENOTE_DISABLE_AUTO_BOOTSTRAP__ = true;
  });

  afterEach(() => {
    delete globalThis.__SIDENOTE_DISABLE_AUTO_BOOTSTRAP__;
  });

  it('initializes storage and data before rendering and binding events', async () => {
    const { bootstrap } = await import('../../src/main.js');

    await bootstrap();

    expect(mocks.calls).toEqual([
      'initDB',
      'getAllNotes',
      'sortNotes',
      'getAllImageObjectsFromDB',
      'applyMode',
      'applyFontSize',
      'updateLegacyLineBreakControls',
      'updateTildeReplacementButton',
      'showListView',
      'initializeAllEvents',
    ]);
  });

  it('migrates legacy notes from browser storage before loading IndexedDB notes', async () => {
    await globalThis.browser.storage.local.set({
      notes: [{ id: 'active', metadata: { lastModified: 10 } }],
      deletedNotes: [{ id: 'deleted', metadata: { lastModified: 5, deletedAt: 20 } }],
    });

    const { loadAndMigrateData } = await import('../../src/main.js');

    await loadAndMigrateData();

    expect(mocks.saveNote).toHaveBeenCalledTimes(2);
    expect(globalThis.browser.storage.local.remove).toHaveBeenCalledWith(['notes', 'deletedNotes']);
    expect(mocks.getAllNotes).toHaveBeenCalled();
  });
});
