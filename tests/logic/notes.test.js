import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock database and view modules before importing notes.js
vi.mock('../../src/database/index.js', () => ({
  saveNote: vi.fn().mockResolvedValue(),
  deleteNoteDB: vi.fn().mockResolvedValue(),
  restoreNoteDB: vi.fn().mockResolvedValue(),
  deleteNotePermanentlyDB: vi.fn().mockResolvedValue(),
  deleteImagePermanently: vi.fn().mockResolvedValue(),
  getAllImageObjectsFromDB: vi.fn().mockResolvedValue([]),
}));

vi.mock('../../src/notes_view/index.js', () => ({
  renderNoteList: vi.fn(),
  renderDeletedItemsList: vi.fn(),
}));

import { sortNotes, deleteNote, togglePin, restoreNote, deleteNotePermanently, emptyRecycleBin } from '../../src/notes.js';
import { setNotes, setDeletedNotes, notes, deletedNotes } from '../../src/state.js';
import { deleteNoteDB, restoreNoteDB, deleteNotePermanentlyDB, getAllImageObjectsFromDB, deleteImagePermanently } from '../../src/database/index.js';
import { renderNoteList, renderDeletedItemsList } from '../../src/notes_view/index.js';

describe('notes business logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setNotes([]);
    setDeletedNotes([]);
  });

  describe('sortNotes', () => {
    it('should sort pinned notes before unpinned', () => {
      setNotes([
        { id: '1', isPinned: false, metadata: { lastModified: 100 } },
        { id: '2', isPinned: true, pinnedAt: 50, metadata: { lastModified: 50 } },
      ]);
      sortNotes();
      expect(notes[0].id).toBe('2');
      expect(notes[1].id).toBe('1');
    });

    it('should sort pinned notes by pinnedAt ascending', () => {
      setNotes([
        { id: '1', isPinned: true, pinnedAt: 200, metadata: { lastModified: 100 } },
        { id: '2', isPinned: true, pinnedAt: 100, metadata: { lastModified: 50 } },
      ]);
      sortNotes();
      expect(notes[0].id).toBe('2');
      expect(notes[1].id).toBe('1');
    });

    it('should sort unpinned notes by lastModified descending', () => {
      setNotes([
        { id: '1', isPinned: false, metadata: { lastModified: 100 } },
        { id: '2', isPinned: false, metadata: { lastModified: 200 } },
      ]);
      sortNotes();
      expect(notes[0].id).toBe('2');
      expect(notes[1].id).toBe('1');
    });
  });

  describe('deleteNote', () => {
    it('should move note to deletedNotes with deletedAt timestamp', async () => {
      setNotes([
        { id: 'n1', title: 'Test', isPinned: false, metadata: { lastModified: 100 } },
      ]);
      await deleteNote('n1');
      expect(notes).toHaveLength(0);
      expect(deletedNotes).toHaveLength(1);
      expect(deletedNotes[0].id).toBe('n1');
      expect(deletedNotes[0].metadata.deletedAt).toBeDefined();
      expect(deleteNoteDB).toHaveBeenCalledWith('n1');
      expect(renderNoteList).toHaveBeenCalled();
    });

    it('should not do anything for non-existent note', async () => {
      setNotes([]);
      await deleteNote('non-existent');
      expect(deleteNoteDB).not.toHaveBeenCalled();
    });
  });

  describe('togglePin', () => {
    it('should pin an unpinned note', async () => {
      setNotes([
        { id: 'n1', isPinned: false, metadata: { lastModified: 100 } },
      ]);
      await togglePin('n1');
      expect(notes[0].isPinned).toBe(true);
      expect(notes[0].pinnedAt).toBeDefined();
    });

    it('should unpin a pinned note', async () => {
      setNotes([
        { id: 'n1', isPinned: true, pinnedAt: 100, metadata: { lastModified: 100 } },
      ]);
      await togglePin('n1');
      expect(notes[0].isPinned).toBe(false);
      expect(notes[0].pinnedAt).toBeUndefined();
    });
  });

  describe('restoreNote', () => {
    it('should move note from deletedNotes to notes', async () => {
      setDeletedNotes([
        { id: 'n1', title: 'Deleted', isPinned: false, metadata: { lastModified: 100, deletedAt: 200 } },
      ]);
      await restoreNote('n1');
      expect(deletedNotes).toHaveLength(0);
      expect(notes).toHaveLength(1);
      expect(notes[0].metadata.deletedAt).toBeUndefined();
      expect(restoreNoteDB).toHaveBeenCalledWith('n1');
      expect(renderDeletedItemsList).toHaveBeenCalled();
    });
  });

  describe('deleteNotePermanently', () => {
    it('should remove note from deletedNotes', async () => {
      setDeletedNotes([
        { id: 'n1', metadata: { deletedAt: 100 } },
        { id: 'n2', metadata: { deletedAt: 200 } },
      ]);
      await deleteNotePermanently('n1');
      expect(deletedNotes).toHaveLength(1);
      expect(deletedNotes[0].id).toBe('n2');
      expect(deleteNotePermanentlyDB).toHaveBeenCalledWith('n1');
    });
  });

  describe('emptyRecycleBin', () => {
    it('should permanently delete all deleted notes and images', async () => {
      setDeletedNotes([
        { id: 'n1', metadata: { deletedAt: 100 } },
        { id: 'n2', metadata: { deletedAt: 200 } },
      ]);
      getAllImageObjectsFromDB.mockResolvedValue([
        { id: 'img1', deletedAt: 100 },
        { id: 'img2', deletedAt: null },
      ]);

      await emptyRecycleBin();
      expect(deletedNotes).toHaveLength(0);
      expect(deleteNotePermanentlyDB).toHaveBeenCalledTimes(2);
      expect(deleteImagePermanently).toHaveBeenCalledWith('img1');
      expect(deleteImagePermanently).not.toHaveBeenCalledWith('img2');
    });
  });
});
