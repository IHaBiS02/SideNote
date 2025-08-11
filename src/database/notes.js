// Import database instance getter
import { getDB } from './init.js';

/**
 * Retrieves a note object from the database by its ID.
 * @param {string} id The ID of the note to retrieve.
 * @returns {Promise<object>} A promise that resolves with the note object.
 */
// 내부 함수: 노트 객체 가져오기 (직접 호출하지 않음)
function _getNoteObject(id) {
    return new Promise((resolve, reject) => {
        // 데이터베이스 초기화 확인
        const db = getDB();
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
        const db = getDB();
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
        const db = getDB();
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
        const db = getDB();
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
        const db = getDB();
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
        const db = getDB();
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

// Export functions
export {
    saveNote,
    getAllNotes,
    deleteNoteDB,
    restoreNoteDB,
    deleteNotePermanentlyDB
};