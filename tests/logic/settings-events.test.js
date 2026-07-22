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
  state.setGlobalSettings({
    lineHeight: 1.5,
    sourceLineHeight: 1.2,
    codeLineHeight: 1.2,
  });
  state.setNotes(notes);
  state.setActiveNoteId(notes[0]?.id ?? null);
  state.setIsGlobalSettings(isGlobal);

  const { initializeSettingsEvents } = await import('../../src/events/settings-events.js');
  initializeSettingsEvents();

  return state;
}

describe('settings events', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('stores global line spacing values and applies them to each editor surface', async () => {
    const state = await initializeSettings({ isGlobal: true });
    const editor = document.getElementById('markdown-editor');

    const values = [
      ['line-height-setting', '2.2'],
      ['source-line-height-setting', '1.6'],
      ['code-line-height-setting', '1.7'],
    ];
    for (const [id, value] of values) {
      const input = document.getElementById(id);
      input.value = value;
      input.dispatchEvent(new Event('input'));
    }

    expect(state.globalSettings.lineHeight).toBe(2.2);
    expect(state.globalSettings.sourceLineHeight).toBe(1.6);
    expect(state.globalSettings.codeLineHeight).toBe(1.7);
    expect(editor.style.getPropertyValue('--editor-line-height')).toBe('2.2');
    expect(editor.style.getPropertyValue('--editor-heading-line-height')).toBe('2.2');
    expect(editor.style.getPropertyValue('--editor-source-line-height')).toBe('1.6');
    expect(editor.style.getPropertyValue('--editor-code-line-height')).toBe('1.7');
    await expect(browser.storage.local.get('globalSettings')).resolves.toEqual({
      globalSettings: state.globalSettings,
    });
  });

  it('stores note-specific line spacing values without changing global values', async () => {
    const note = {
      id: 'note-1',
      title: 'Note',
      content: 'Text',
      settings: {},
      metadata: { createdAt: 1, lastModified: 1 },
      isPinned: false,
    };
    const state = await initializeSettings({ isGlobal: false, notes: [note] });
    const values = [
      ['line-height-setting', '1.9'],
      ['source-line-height-setting', '1.4'],
      ['code-line-height-setting', '1.5'],
    ];
    for (const [id, value] of values) {
      const input = document.getElementById(id);
      input.value = value;
      input.dispatchEvent(new Event('input'));
    }

    await vi.waitFor(() => expect(mocks.saveNote).toHaveBeenCalledTimes(3));
    expect(note.settings.lineHeight).toBe(1.9);
    expect(note.settings.sourceLineHeight).toBe(1.4);
    expect(note.settings.codeLineHeight).toBe(1.5);
    expect(state.globalSettings.lineHeight).toBe(1.5);
    expect(state.globalSettings.sourceLineHeight).toBe(1.2);
    expect(state.globalSettings.codeLineHeight).toBe(1.2);
    expect(mocks.sortNotes).toHaveBeenCalledTimes(3);
  });

  it('ignores values outside the supported range', async () => {
    const state = await initializeSettings({ isGlobal: true });
    const input = document.getElementById('code-line-height-setting');

    input.value = '4';
    input.dispatchEvent(new Event('input'));

    expect(state.globalSettings.codeLineHeight).toBe(1.2);
  });

  it('stores the pinned-note hold delay only from global settings', async () => {
    const globalState = await initializeSettings({ isGlobal: true });
    const input = document.getElementById('pinned-note-drag-delay-setting');

    input.value = '450';
    input.dispatchEvent(new Event('input'));
    expect(globalState.globalSettings.pinnedNoteDragDelayMs).toBe(450);

    const noteState = await initializeSettings({ isGlobal: false });
    const noteInput = document.getElementById('pinned-note-drag-delay-setting');
    noteInput.value = '700';
    noteInput.dispatchEvent(new Event('input'));
    expect(noteState.globalSettings.pinnedNoteDragDelayMs).toBeUndefined();
  });
});
