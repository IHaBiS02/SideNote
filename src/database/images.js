// Import database helpers
import { dbTransaction } from './init.js';

/**
 * Retrieves an image object from the database by its ID.
 * @param {string} id The ID of the image to retrieve.
 * @returns {Promise<object>} A promise that resolves with the image object.
 */
function _getImageObject(id) {
  return dbTransaction('images', 'readonly', (store) => store.get(id));
}

/**
 * Saves an image to the database.
 * @param {string} id The ID of the image.
 * @param {Blob} blob The image blob to save.
 * @returns {Promise<void>} A promise that resolves when the image is saved.
 */
function saveImage(id, blob) {
  return dbTransaction('images', 'readwrite', (store) =>
    store.put({ id, blob, deletedAt: null })
  );
}

/**
 * Retrieves an image blob from the database.
 * @param {string} id The ID of the image to retrieve.
 * @returns {Promise<Blob|null>} A promise that resolves with the image blob or null.
 */
async function getImage(id) {
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
async function deleteImage(id) {
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
async function restoreImage(id) {
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
function deleteImagePermanently(id) {
  return dbTransaction('images', 'readwrite', (store) => store.delete(id));
}

/**
 * Retrieves all image objects from the database.
 * @returns {Promise<Array<object>>} A promise that resolves with an array of image objects.
 */
function getAllImageObjectsFromDB() {
  return dbTransaction('images', 'readonly', (store) => store.getAll());
}

// Export functions
export {
  saveImage,
  getImage,
  deleteImage,
  restoreImage,
  deleteImagePermanently,
  getAllImageObjectsFromDB
};
