import { beforeEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';

const mocks = vi.hoisted(() => ({
  saveNote: vi.fn(async () => undefined),
  sortNotes: vi.fn(),
}));

vi.mock('../../src/database/index.js', () => ({
  saveNote: mocks.saveNote,
}));

vi.mock('../../src/notes.js', () => ({
  emptyRecycleBin: vi.fn(async () => undefined),
  sortNotes: mocks.sortNotes,
}));

vi.mock('../../src/notes_view/index.js', () => ({
  showSettingsView: vi.fn(),
  showLicenseView: vi.fn(),
  showRecycleBinView: vi.fn(),
  showImageManagementView: vi.fn(),
  renderDeletedItemsList: vi.fn(),
}));

vi.mock('../../src/ui-helpers.js', () => ({
  createDropdown: vi.fn(),
}));

async function initializeSettings({ isGlobal, notes = [] }) {
  vi.resetModules();
  document.documentElement.innerHTML = readFileSync('sidepanel.html', 'utf8');

  const state = await import('../../src/state.js');
  state.setGlobalSettings({ lineHeight: 1.5 });
  state.setNotes(notes);
  state.setActiveNoteId(notes[0]?.id ?? null);
  state.setIsGlobalSettings(isGlobal);

  const { initializeSettingsEvents } = await import('../../src/events/settings-events.js');
  initializeSettingsEvents();

  return state;
}

describe('line spacing settings events', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('stores a global line spacing value and applies it to the editor', async () => {
    const state = await initializeSettings({ isGlobal: true });
    const input = document.getElementById('line-height-setting');
    const editor = document.getElementById('markdown-editor');

    input.value = '2.2';
    input.dispatchEvent(new Event('input'));

    expect(state.globalSettings.lineHeight).toBe(2.2);
    expect(editor.style.getPropertyValue('--editor-line-height')).toBe('2.2');
    expect(editor.style.getPropertyValue('--editor-heading-line-height')).toBe('2.2');
    await expect(browser.storage.local.get('globalSettings')).resolves.toEqual({
      globalSettings: state.globalSettings,
    });
  });

  it('stores a note-specific line spacing value without changing the global value', async () => {
    const note = {
      id: 'note-1',
      title: 'Note',
      content: 'Text',
      settings: {},
      metadata: { createdAt: 1, lastModified: 1 },
      isPinned: false,
    };
    const state = await initializeSettings({ isGlobal: false, notes: [note] });
    const input = document.getElementById('line-height-setting');

    input.value = '1.9';
    input.dispatchEvent(new Event('input'));

    await vi.waitFor(() => expect(mocks.saveNote).toHaveBeenCalledWith(note));
    expect(note.settings.lineHeight).toBe(1.9);
    expect(state.globalSettings.lineHeight).toBe(1.5);
    expect(mocks.sortNotes).toHaveBeenCalledOnce();
  });

  it('ignores values outside the supported range', async () => {
    const state = await initializeSettings({ isGlobal: true });
    const input = document.getElementById('line-height-setting');

    input.value = '4';
    input.dispatchEvent(new Event('input'));

    expect(state.globalSettings.lineHeight).toBe(1.5);
  });
});
