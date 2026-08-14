import { describe, it, expect, beforeEach } from 'vitest';
import { initDB, getDB, closeDB } from '../../src/database/init.js';
import { getAllNoteSummaries } from '../../src/database/notes.js';
import { createSampleNote } from '../fixtures/notes.js';

describe('database/init', () => {
  beforeEach(async () => {
    closeDB();
    await new Promise((resolve, reject) => {
      const req = indexedDB.deleteDatabase('SimpleNotesDB');
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  });

  describe('initDB', () => {
    it('should initialize and return a database instance', async () => {
      const db = await initDB();
      expect(db).toBeDefined();
      expect(db.name).toBe('SimpleNotesDB');
    });

    it('should create note, summary, and image object stores', async () => {
      const db = await initDB();
      expect(db.objectStoreNames.contains('notes')).toBe(true);
      expect(db.objectStoreNames.contains('noteSummaries')).toBe(true);
      expect(db.objectStoreNames.contains('images')).toBe(true);
    });

    it('backfills summaries when upgrading an existing version 2 database', async () => {
      const note = createSampleNote({ id: 'legacy-note', content: 'large body' });
      const legacyDB = await new Promise((resolve, reject) => {
        const request = indexedDB.open('SimpleNotesDB', 2);
        request.onupgradeneeded = () => {
          request.result.createObjectStore('notes', { keyPath: 'id' });
          request.result.createObjectStore('images', { keyPath: 'id' });
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      await new Promise((resolve, reject) => {
        const transaction = legacyDB.transaction('notes', 'readwrite');
        transaction.objectStore('notes').put(note);
        transaction.oncomplete = resolve;
        transaction.onerror = () => reject(transaction.error);
      });
      legacyDB.close();

      await initDB();

      const summaries = await getAllNoteSummaries();
      expect(summaries).toEqual([
        expect.objectContaining({ id: 'legacy-note', title: note.title }),
      ]);
      expect(summaries[0]).not.toHaveProperty('content');
    });
  });

  describe('getDB', () => {
    it('should return the database instance after initialization', async () => {
      await initDB();
      const db = getDB();
      expect(db).toBeDefined();
      expect(db.name).toBe('SimpleNotesDB');
    });
  });
});
