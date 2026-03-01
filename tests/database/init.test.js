import { describe, it, expect, beforeEach } from 'vitest';
import { initDB, getDB, closeDB } from '../../src/database/init.js';

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

    it('should create notes and images object stores', async () => {
      const db = await initDB();
      expect(db.objectStoreNames.contains('notes')).toBe(true);
      expect(db.objectStoreNames.contains('images')).toBe(true);
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
