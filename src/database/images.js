// Import database instance getter
import { getDB } from './init.js';

/**
 * Retrieves an image object from the database by its ID.
 * @param {string} id The ID of the image to retrieve.
 * @returns {Promise<object>} A promise that resolves with the image object.
 */
function _getImageObject(id) {
  return new Promise((resolve, reject) => {
    const db = getDB();
    if (!db) {
      reject('DB not initialized');
      return;
    }
    const transaction = db.transaction(['images'], 'readonly');
    const store = transaction.objectStore('images');
    const request = store.get(id);

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

/**
 * Saves an image to the database.
 * @param {string} id The ID of the image.
 * @param {Blob} blob The image blob to save.
 * @returns {Promise<void>} A promise that resolves when the image is saved.
 */
function saveImage(id, blob) {
  return new Promise((resolve, reject) => {
    const db = getDB();
    if (!db) {
      reject('DB not initialized');
      return;
    }
    const transaction = db.transaction(['images'], 'readwrite');
    const store = transaction.objectStore('images');
    const request = store.put({ id: id, blob: blob, deletedAt: null });

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

/**
 * Retrieves an image blob from the database.
 * @param {string} id The ID of the image to retrieve.
 * @returns {Promise<Blob>} A promise that resolves with the image blob.
 */
function getImage(id) {
  return new Promise((resolve, reject) => {
    _getImageObject(id).then(imageObject => {
      // 삭제되지 않은 이미지만 반환
      if (imageObject && !imageObject.deletedAt) {
        resolve(imageObject.blob);
      } else {
        resolve(null);
      }
    }).catch(reject);
  });
}

/**
 * Marks an image as deleted in the database.
 * @param {string} id The ID of the image to delete.
 * @returns {Promise<void>} A promise that resolves when the image is marked as deleted.
 */
function deleteImage(id) {
  return new Promise(async (resolve, reject) => {
    const db = getDB();
    if (!db) {
      reject('DB not initialized');
      return;
    }
    try {
      const imageObject = await _getImageObject(id);
      if (imageObject) {
        imageObject.deletedAt = Date.now();
        const transaction = db.transaction(['images'], 'readwrite');
        const store = transaction.objectStore('images');
        const request = store.put(imageObject);
        request.onsuccess = () => resolve();
        request.onerror = (event) => reject(event.target.error);
      } else {
        resolve(); // 이미지를 찾을 수 없음, 아무 작업도 하지 않음
      }
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Restores a deleted image in the database.
 * @param {string} id The ID of the image to restore.
 * @returns {Promise<void>} A promise that resolves when the image is restored.
 */
function restoreImage(id) {
  return new Promise(async (resolve, reject) => {
    const db = getDB();
    if (!db) {
      reject('DB not initialized');
      return;
    }
    try {
      const imageObject = await _getImageObject(id);
      if (imageObject) {
        imageObject.deletedAt = null;
        const transaction = db.transaction(['images'], 'readwrite');
        const store = transaction.objectStore('images');
        const request = store.put(imageObject);
        request.onsuccess = () => resolve();
        request.onerror = (event) => reject(event.target.error);
      } else {
        resolve();
      }
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Permanently deletes an image from the database.
 * @param {string} id The ID of the image to delete permanently.
 * @returns {Promise<void>} A promise that resolves when the image is deleted.
 */
function deleteImagePermanently(id) {
  return new Promise((resolve, reject) => {
    const db = getDB();
    if (!db) {
      reject('DB not initialized');
      return;
    }
    const transaction = db.transaction(['images'], 'readwrite');
    const store = transaction.objectStore('images');
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

/**
 * Retrieves all image objects from the database.
 * @returns {Promise<Array<object>>} A promise that resolves with an array of image objects.
 */
function getAllImageObjectsFromDB() {
  return new Promise((resolve, reject) => {
    const db = getDB();
    if (!db) {
      reject('DB not initialized');
      return;
    }
    const transaction = db.transaction(['images'], 'readonly');
    const store = transaction.objectStore('images');
    const request = store.getAll();

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
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