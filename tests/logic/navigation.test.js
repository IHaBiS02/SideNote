import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ showListView: vi.fn() }));

vi.mock('../../src/notes_view/index.js', () => ({
  showListView: mocks.showListView,
  showEditorView: vi.fn(),
  showSettingsView: vi.fn(),
  showLicenseView: vi.fn(),
  showRecycleBinView: vi.fn(),
  showImageManagementView: vi.fn(),
  openNote: vi.fn(),
  renderNoteList: vi.fn(),
}));
vi.mock('../../src/database/index.js', () => ({ getNote: vi.fn(), saveNote: vi.fn() }));
vi.mock('../../src/notes.js', () => ({ sortNotes: vi.fn() }));
vi.mock('../../src/settings.js', () => ({ populateSettingsForm: vi.fn() }));

describe('folder navigation history', () => {
  let state;
  let history;
  let navigation;

  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();
    document.body.innerHTML = readFileSync(resolve('sidepanel.html'), 'utf8');
    state = await import('../../src/state.js');
    history = await import('../../src/history.js');
    navigation = await import('../../src/events/navigation.js');
    state.setFolders([{ id: 'projects', kind: 'folder', title: 'Projects', parentId: null,
      isPinned: false, ownModifiedAt: 1, metadata: { createdAt: 1, lastModified: 1 } }]);
    state.setCurrentFolderId('projects');
    history.pushToHistory({ view: 'list', params: { folderId: null } });
    history.pushToHistory({ view: 'list', params: { folderId: 'projects' } });
    navigation.initializeNavigationEvents();
  });

  function openHistory(buttonId) {
    const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
    document.getElementById(buttonId).dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    return document.querySelector('.history-dropdown');
  }

  it.each(['folder-back-button', 'back-button'])('opens the shared history from %s without navigating', buttonId => {
    const dropdown = openHistory(buttonId);
    expect([...dropdown.children].map(item => item.textContent)).toEqual(['Folder: Projects', 'Notes']);
    expect(dropdown.querySelector('.current-history-item').textContent).toBe('Folder: Projects');
    expect(history.getHistoryIndex()).toBe(1);
    expect(state.currentFolderId).toBe('projects');
    expect(mocks.showListView).not.toHaveBeenCalled();
    document.getElementById(buttonId).dispatchEvent(new MouseEvent('contextmenu', { bubbles: true }));
    expect(document.querySelector('.history-dropdown')).toBeNull();
  });

  it('jumps to root and back to a folder without appending history', async () => {
    openHistory('folder-back-button').lastElementChild.click();
    await vi.waitFor(() => expect(mocks.showListView).toHaveBeenCalledWith(false));
    expect(state.currentFolderId).toBeNull();
    expect(history.getHistoryIndex()).toBe(0);
    await vi.waitFor(() => expect(document.querySelector('.history-dropdown')).toBeNull());

    openHistory('back-button').firstElementChild.click();
    await vi.waitFor(() => expect(state.currentFolderId).toBe('projects'));
    expect(history.getHistoryIndex()).toBe(1);
    expect(history.getHistory()).toHaveLength(2);
  });

  it('uses the current folder name alongside existing note-mode labels', () => {
    state.folders[0].title = 'Renamed Projects';
    state.setNotes([{ id: 'note', title: 'Draft', metadata: { createdAt: 1, lastModified: 1 } }]);
    history.pushToHistory({ view: 'editor', params: { noteId: 'note', inEditMode: true } });
    const dropdown = openHistory('back-button');
    expect([...dropdown.children].map(item => item.textContent)).toEqual(['Edit: Draft', 'Folder: Renamed Projects', 'Notes']);
  });
});
