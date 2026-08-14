import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

const mocks = vi.hoisted(() => {
  const calls = [];
  return {
    calls,
    initDB: vi.fn(async () => calls.push('initDB')),
    saveNote: vi.fn(async () => calls.push('saveNote')),
    getAllNoteSummaries: vi.fn(async () => {
      calls.push('getAllNoteSummaries');
      return [];
    }),
    getDeletedImageIdsFromDB: vi.fn(async () => {
      calls.push('getDeletedImageIdsFromDB');
      return [];
    }),
    deleteNotePermanentlyDB: vi.fn(async () => calls.push('deleteNotePermanentlyDB')),
    deleteImagePermanently: vi.fn(async () => calls.push('deleteImagePermanently')),
    sortNotes: vi.fn(() => calls.push('sortNotes')),
    applyFontSize: vi.fn(() => calls.push('applyFontSize')),
    applyLineHeightSettings: vi.fn(() => calls.push('applyLineHeightSettings')),
    applyMode: vi.fn(() => calls.push('applyMode')),
    normalizeGlobalSettings: vi.fn((settings = {}) => ({
      title: 'default',
      fontSize: 12,
      lineHeight: 1.5,
      sourceLineHeight: 1.2,
      codeLineHeight: 1.2,
      wysiwygPreview: true,
      legacyLineBreakMode: false,
      autoLineBreak: false,
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
  getAllNoteSummaries: mocks.getAllNoteSummaries,
  getDeletedImageIdsFromDB: mocks.getDeletedImageIdsFromDB,
  deleteNotePermanentlyDB: mocks.deleteNotePermanentlyDB,
  deleteImagePermanently: mocks.deleteImagePermanently,
}));

vi.mock('../../src/notes.js', () => ({
  sortNotes: mocks.sortNotes,
}));

vi.mock('../../src/settings.js', () => ({
  applyFontSize: mocks.applyFontSize,
  applyLineHeightSettings: mocks.applyLineHeightSettings,
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
  let scheduledMaintenance;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.resetModules();
    vi.clearAllMocks();
    mocks.calls.length = 0;
    scheduledMaintenance = undefined;
    vi.stubGlobal('requestAnimationFrame', vi.fn((callback) => {
      scheduledMaintenance = callback;
      return 1;
    }));
    globalThis.__SIDENOTE_DISABLE_AUTO_BOOTSTRAP__ = true;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    delete globalThis.__SIDENOTE_DISABLE_AUTO_BOOTSTRAP__;
  });

  it('initializes storage and data before rendering and binding events', async () => {
    vi.setSystemTime(new Date('2026-08-14T00:00:00Z'));
    mocks.getDeletedImageIdsFromDB.mockResolvedValueOnce(['expired-image']);
    const { bootstrap } = await import('../../src/main.js');

    await bootstrap();

    expect(mocks.calls).toEqual([
      'initDB',
      'getAllNoteSummaries',
      'sortNotes',
      'applyMode',
      'applyFontSize',
      'applyLineHeightSettings',
      'updateLegacyLineBreakControls',
      'updateTildeReplacementButton',
      'showListView',
      'initializeAllEvents',
    ]);
    expect(mocks.getDeletedImageIdsFromDB).not.toHaveBeenCalled();

    scheduledMaintenance();
    await vi.runAllTimersAsync();

    expect(mocks.getDeletedImageIdsFromDB).toHaveBeenCalledWith(
      Date.now() - (30 * 24 * 60 * 60 * 1000),
    );
    expect(mocks.deleteImagePermanently).toHaveBeenCalledWith('expired-image');
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
    expect(mocks.getAllNoteSummaries).toHaveBeenCalled();
  });
});
