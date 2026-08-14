// Import database helpers
import { dbTransaction, getDB } from './init.js';
import type { StoredImage } from '../types.js';

/**
 * Retrieves an image object from the database by its ID.
 * @param {string} id The ID of the image to retrieve.
 * @returns {Promise<object>} A promise that resolves with the image object.
 */
function _getImageObject(id: string): Promise<StoredImage | undefined> {
  return dbTransaction('images', 'readonly', (store) => store.get(id) as IDBRequest<StoredImage | undefined>);
}

/**
 * Saves an image to the database.
 * @param {string} id The ID of the image.
 * @param {Blob} blob The image blob to save.
 * @returns {Promise<void>} A promise that resolves when the image is saved.
 */
function saveImage(id: string, blob: Blob): Promise<IDBValidKey> {
  return dbTransaction('images', 'readwrite', (store) =>
    store.put({ id, blob, deletedAt: null })
  );
}

/**
 * Retrieves an image blob from the database.
 * @param {string} id The ID of the image to retrieve.
 * @returns {Promise<Blob|null>} A promise that resolves with the image blob or null.
 */
async function getImage(id: string): Promise<Blob | null> {
  const imageObject = await _getImageObject(id);
  if (imageObject && !imageObject.deletedAt) {
    return imageObject.blob;
  }
  return null;
}

/**
 * Marks an image as deleted in the database.
 * @param {string} id The ID of the image to delete.
 * @returns {Promise<void>} A promise that resolves when the image is marked as deleted.
 */
async function deleteImage(id: string): Promise<void> {
  const imageObject = await _getImageObject(id);
  if (imageObject) {
    imageObject.deletedAt = Date.now();
    await dbTransaction('images', 'readwrite', (store) => store.put(imageObject));
  }
}

/**
 * Restores a deleted image in the database.
 * @param {string} id The ID of the image to restore.
 * @returns {Promise<void>} A promise that resolves when the image is restored.
 */
async function restoreImage(id: string): Promise<void> {
  const imageObject = await _getImageObject(id);
  if (imageObject) {
    imageObject.deletedAt = null;
    await dbTransaction('images', 'readwrite', (store) => store.put(imageObject));
  }
}

/**
 * Permanently deletes an image from the database.
 * @param {string} id The ID of the image to delete permanently.
 * @returns {Promise<void>} A promise that resolves when the image is deleted.
 */
function deleteImagePermanently(id: string): Promise<undefined> {
  return dbTransaction('images', 'readwrite', (store) => store.delete(id));
}

/**
 * Retrieves all image objects from the database.
 * @returns {Promise<Array<object>>} A promise that resolves with an array of image objects.
 */
function getAllImageObjectsFromDB(): Promise<StoredImage[]> {
  return dbTransaction('images', 'readonly', (store) => store.getAll() as IDBRequest<StoredImage[]>);
}

/**
 * Retrieves deleted image IDs through the deletedAt index without cloning Blob values.
 * @param {number} deletedBefore Optional exclusive deletion timestamp cutoff.
 */
function getDeletedImageIdsFromDB(deletedBefore?: number): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const database = getDB();
    if (!database) {
      reject(new Error('DB not initialized'));
      return;
    }

    const transaction = database.transaction('images', 'readonly');
    const index = transaction.objectStore('images').index('deletedAt');
    const request = deletedBefore === undefined
      ? index.openKeyCursor()
      : index.openKeyCursor(IDBKeyRange.upperBound(deletedBefore, true));
    const imageIds: string[] = [];

    request.onsuccess = () => {
      const cursor = request.result;
      if (!cursor) return;
      if (typeof cursor.primaryKey === 'string') {
        imageIds.push(cursor.primaryKey);
      }
      cursor.continue();
    };
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => resolve(imageIds);
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
}

// Export functions
export {
  saveImage,
  getImage,
  deleteImage,
  restoreImage,
  deleteImagePermanently,
  getAllImageObjectsFromDB,
  getDeletedImageIdsFromDB,
};
