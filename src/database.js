let db;

function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('SimpleNotesDB', 2);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('images')) {
        db.createObjectStore('images', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('notes')) {
        db.createObjectStore('notes', { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      console.log('Database initialized');
      resolve(db);
    };

    request.onerror = (event) => {
      console.error('Database error:', event.target.errorCode);
      reject(event.target.error);
    };
  });
}

function _getNoteObject(id) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject('DB not initialized');
            return;
        }
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

function deleteNoteDB(id) {
    return new Promise(async (resolve, reject) => {
        if (!db) {
            reject('DB not initialized');
            return;
        }
        try {
            const noteObject = await _getNoteObject(id);
            if (noteObject) {
                noteObject.metadata.deletedAt = Date.now();
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

function restoreNoteDB(id) {
    return new Promise(async (resolve, reject) => {
        if (!db) {
            reject('DB not initialized');
            return;
        }
        try {
            const noteObject = await _getNoteObject(id);
            if (noteObject) {
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

function getImage(id) {
  return new Promise((resolve, reject) => {
    _getImageObject(id).then(imageObject => {
      if (imageObject && !imageObject.deletedAt) {
        resolve(imageObject.blob);
      } else {
        resolve(null);
      }
    }).catch(reject);
  });
}

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
        resolve(); // Image not found, nothing to do
      }
    } catch (err) {
      reject(err);
    }
  });
}

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
