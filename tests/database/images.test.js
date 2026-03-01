import { describe, it, expect, beforeEach } from 'vitest';
import { initDB, closeDB } from '../../src/database/init.js';
import {
  saveImage,
  getImage,
  deleteImage,
  restoreImage,
  deleteImagePermanently,
  getAllImageObjectsFromDB
} from '../../src/database/images.js';

describe('database/images', () => {
  beforeEach(async () => {
    closeDB();
    await new Promise((resolve, reject) => {
      const req = indexedDB.deleteDatabase('SimpleNotesDB');
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
    await initDB();
  });

  describe('saveImage / getImage', () => {
    it('should save and retrieve an image blob', async () => {
      const blob = new Blob(['test image'], { type: 'image/png' });
      await saveImage('img-1', blob);
      const retrieved = await getImage('img-1');
      expect(retrieved).toBeDefined();
      expect(retrieved).not.toBeNull();
    });

    it('should return null for non-existent image', async () => {
      const result = await getImage('non-existent');
      expect(result).toBeNull();
    });
  });

  describe('deleteImage', () => {
    it('should soft delete an image (set deletedAt)', async () => {
      const blob = new Blob(['test'], { type: 'image/png' });
      await saveImage('img-del-1', blob);
      await deleteImage('img-del-1');

      // getImage should return null for deleted images
      const result = await getImage('img-del-1');
      expect(result).toBeNull();

      // But it should still exist in DB
      const allImages = await getAllImageObjectsFromDB();
      const deletedImg = allImages.find(i => i.id === 'img-del-1');
      expect(deletedImg).toBeDefined();
      expect(deletedImg.deletedAt).toBeDefined();
      expect(typeof deletedImg.deletedAt).toBe('number');
    });

    it('should not error when deleting non-existent image', async () => {
      await expect(deleteImage('non-existent')).resolves.toBeUndefined();
    });
  });

  describe('restoreImage', () => {
    it('should restore a deleted image (clear deletedAt)', async () => {
      const blob = new Blob(['test'], { type: 'image/png' });
      await saveImage('img-restore-1', blob);
      await deleteImage('img-restore-1');

      expect(await getImage('img-restore-1')).toBeNull();

      await restoreImage('img-restore-1');
      const restored = await getImage('img-restore-1');
      expect(restored).toBeDefined();
      expect(restored).not.toBeNull();
    });

    it('should not error when restoring non-existent image', async () => {
      await expect(restoreImage('non-existent')).resolves.toBeUndefined();
    });
  });

  describe('deleteImagePermanently', () => {
    it('should permanently remove image from database', async () => {
      const blob = new Blob(['test'], { type: 'image/png' });
      await saveImage('img-perm-1', blob);
      await deleteImagePermanently('img-perm-1');
      const allImages = await getAllImageObjectsFromDB();
      expect(allImages.find(i => i.id === 'img-perm-1')).toBeUndefined();
    });
  });

  describe('getAllImageObjectsFromDB', () => {
    it('should return all images including deleted ones', async () => {
      const blob = new Blob(['test'], { type: 'image/png' });
      await saveImage('img-a', blob);
      await saveImage('img-b', blob);
      await deleteImage('img-b');

      const allImages = await getAllImageObjectsFromDB();
      expect(allImages).toHaveLength(2);
    });

    it('should return empty array when no images exist', async () => {
      const allImages = await getAllImageObjectsFromDB();
      expect(allImages).toEqual([]);
    });
  });
});
