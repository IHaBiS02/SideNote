// 전역 데이터베이스 인스턴스
let db;

/**
 * Initializes the IndexedDB database.
 * @returns {Promise<IDBDatabase>} A promise that resolves with the database object.
 */
function initDB() {
  return new Promise((resolve, reject) => {
    // IndexedDB 열기 요청 (버전 2)
    const request = indexedDB.open('SimpleNotesDB', 2);

    // 데이터베이스 버전 업그레이드 시 실행 (첫 실행 또는 버전 변경 시)
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      // images 객체 저장소가 없으면 생성
      if (!db.objectStoreNames.contains('images')) {
        db.createObjectStore('images', { keyPath: 'id' });
      }
      // notes 객체 저장소가 없으면 생성
      if (!db.objectStoreNames.contains('notes')) {
        db.createObjectStore('notes', { keyPath: 'id' });
      }
    };

    // 데이터베이스 열기 성공 시
    request.onsuccess = (event) => {
      db = event.target.result;
      console.log('Database initialized');
      resolve(db);
    };

    // 데이터베이스 열기 실패 시
    request.onerror = (event) => {
      console.error('Database error:', event.target.errorCode);
      reject(event.target.error);
    };
  });
}

/**
 * Retrieves a note object from the database by its ID.
 * @param {string} id The ID of the note to retrieve.
 * @returns {Promise<object>} A promise that resolves with the note object.
 */
// 내부 함수: 노트 객체 가져오기 (직접 호출하지 않음)
function _getNoteObject(id) {
    return new Promise((resolve, reject) => {
        // 데이터베이스 초기화 확인
        if (!db) {
            reject('DB not initialized');
            return;
        }
        // 읽기 전용 트랜잭션 생성
        const transaction = db.transaction(['notes'], 'readonly');
        const store = transaction.objectStore('notes');
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
 * Saves a note object to the database.
 * @param {object} note The note object to save.
 * @returns {Promise<void>} A promise that resolves when the note is saved.
 */
function saveNote(note) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject('DB not initialized');
            return;
        }
        const transaction = db.transaction(['notes'], 'readwrite');
        const store = transaction.objectStore('notes');
        const request = store.put(note);

        request.onsuccess = () => {
            resolve();
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
}

/**
 * Retrieves all note objects from the database.
 * @returns {Promise<Array<object>>} A promise that resolves with an array of note objects.
 */
function getAllNotes() {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject('DB not initialized');
            return;
        }
        const transaction = db.transaction(['notes'], 'readonly');
        const store = transaction.objectStore('notes');
        const request = store.getAll();

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
}

/**
 * Marks a note as deleted in the database.
 * @param {string} id The ID of the note to delete.
 * @returns {Promise<void>} A promise that resolves when the note is marked as deleted.
 */
function deleteNoteDB(id) {
    return new Promise(async (resolve, reject) => {
        if (!db) {
            reject('DB not initialized');
            return;
        }
        try {
            const noteObject = await _getNoteObject(id);
            if (noteObject) {
                // 소프트 삭제: deletedAt 타임스탬프 추가
                noteObject.metadata.deletedAt = Date.now();
                const transaction = db.transaction(['notes'], 'readwrite');
                const store = transaction.objectStore('notes');
                const request = store.put(noteObject);
                request.onsuccess = () => resolve();
                request.onerror = (event) => reject(event.target.error);
            } else {
                // 노트가 없어도 성공으로 처리
                resolve();
            }
        } catch (err) {
            reject(err);
        }
    });
}

/**
 * Restores a deleted note in the database.
 * @param {string} id The ID of the note to restore.
 * @returns {Promise<void>} A promise that resolves when the note is restored.
 */
function restoreNoteDB(id) {
    return new Promise(async (resolve, reject) => {
        if (!db) {
            reject('DB not initialized');
            return;
        }
        try {
            const noteObject = await _getNoteObject(id);
            if (noteObject) {
                // deletedAt 속성 제거하여 복원
                delete noteObject.metadata.deletedAt;
                const transaction = db.transaction(['notes'], 'readwrite');
                const store = transaction.objectStore('notes');
                const request = store.put(noteObject);
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
 * Permanently deletes a note from the database.
 * @param {string} id The ID of the note to delete permanently.
 * @returns {Promise<void>} A promise that resolves when the note is deleted.
 */
function deleteNotePermanentlyDB(id) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject('DB not initialized');
            return;
        }
        const transaction = db.transaction(['notes'], 'readwrite');
        const store = transaction.objectStore('notes');
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
 * Retrieves an image object from the database by its ID.
 * @param {string} id The ID of the image to retrieve.
 * @returns {Promise<object>} A promise that resolves with the image object.
 */
function _getImageObject(id) {
  return new Promise((resolve, reject) => {
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

// Export all functions
export {
  initDB,
  saveNote,
  getAllNotes,
  deleteNoteDB,
  restoreNoteDB,
  deleteNotePermanentlyDB,
  saveImage,
  getImage,
  deleteImage,
  restoreImage,
  deleteImagePermanently,
  getAllImageObjectsFromDB
};