import { describe, it, expect, beforeEach } from 'vitest';
import { initDB, closeDB } from '../../src/database/init.js';
import { saveNote, getAllNotes, deleteNoteDB, restoreNoteDB, deleteNotePermanentlyDB } from '../../src/database/notes.js';
import { createSampleNote } from '../fixtures/notes.js';

describe('database/notes', () => {
  beforeEach(async () => {
    closeDB();
    await new Promise((resolve, reject) => {
      const req = indexedDB.deleteDatabase('SimpleNotesDB');
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
    await initDB();
  });

  describe('saveNote', () => {
    it('should save a note to the database', async () => {
      const note = createSampleNote({ id: 'note-save-1' });
      await saveNote(note);
      const allNotes = await getAllNotes();
      expect(allNotes).toHaveLength(1);
      expect(allNotes[0].id).toBe('note-save-1');
      expect(allNotes[0].title).toBe(note.title);
    });

    it('should update an existing note', async () => {
      const note = createSampleNote({ id: 'note-update-1' });
      await saveNote(note);
      note.title = 'Updated Title';
      await saveNote(note);
      const allNotes = await getAllNotes();
      expect(allNotes).toHaveLength(1);
      expect(allNotes[0].title).toBe('Updated Title');
    });
  });

  describe('getAllNotes', () => {
    it('should return empty array when no notes exist', async () => {
      const allNotes = await getAllNotes();
      expect(allNotes).toEqual([]);
    });

    it('should return all saved notes', async () => {
      await saveNote(createSampleNote({ id: 'note-a' }));
      await saveNote(createSampleNote({ id: 'note-b' }));
      const allNotes = await getAllNotes();
      expect(allNotes).toHaveLength(2);
    });
  });

  describe('deleteNoteDB', () => {
    it('should set deletedAt timestamp on the note', async () => {
      const note = createSampleNote({ id: 'note-del-1' });
      await saveNote(note);
      await deleteNoteDB('note-del-1');
      const allNotes = await getAllNotes();
      expect(allNotes[0].metadata.deletedAt).toBeDefined();
      expect(typeof allNotes[0].metadata.deletedAt).toBe('number');
    });

    it('should not error when deleting non-existent note', async () => {
      await expect(deleteNoteDB('non-existent')).resolves.toBeUndefined();
    });
  });

  describe('restoreNoteDB', () => {
    it('should remove deletedAt from the note', async () => {
      const note = createSampleNote({ id: 'note-restore-1' });
      await saveNote(note);
      await deleteNoteDB('note-restore-1');

      let allNotes = await getAllNotes();
      expect(allNotes[0].metadata.deletedAt).toBeDefined();

      await restoreNoteDB('note-restore-1');
      allNotes = await getAllNotes();
      expect(allNotes[0].metadata.deletedAt).toBeUndefined();
    });

    it('should not error when restoring non-existent note', async () => {
      await expect(restoreNoteDB('non-existent')).resolves.toBeUndefined();
    });
  });

  describe('deleteNotePermanentlyDB', () => {
    it('should permanently remove the note from the database', async () => {
      const note = createSampleNote({ id: 'note-perm-1' });
      await saveNote(note);
      await deleteNotePermanentlyDB('note-perm-1');
      const allNotes = await getAllNotes();
      expect(allNotes).toHaveLength(0);
    });
  });
});
