import { createNoteSummary } from '../note-summary.js';
// 전역 데이터베이스 인스턴스
let db;
/**
 * Initializes the IndexedDB database.
 * @returns {Promise<IDBDatabase>} A promise that resolves with the database object.
 */
function initDB() {
    return new Promise((resolve, reject) => {
        // Version 4 indexes image deletion timestamps without reading Blob values.
        const request = indexedDB.open('SimpleNotesDB', 4);
        // 데이터베이스 버전 업그레이드 시 실행 (첫 실행 또는 버전 변경 시)
        request.onupgradeneeded = () => {
            const database = request.result;
            // images 객체 저장소가 없으면 생성
            const imagesStore = database.objectStoreNames.contains('images')
                ? request.transaction?.objectStore('images')
                : database.createObjectStore('images', { keyPath: 'id' });
            if (imagesStore && !imagesStore.indexNames.contains('deletedAt')) {
                imagesStore.createIndex('deletedAt', 'deletedAt', { unique: false });
            }
            // notes 객체 저장소가 없으면 생성
            if (!database.objectStoreNames.contains('notes')) {
                database.createObjectStore('notes', { keyPath: 'id' });
            }
            if (!database.objectStoreNames.contains('noteSummaries')) {
                const summaries = database.createObjectStore('noteSummaries', {
                    keyPath: 'id',
                });
                const notesStore = request.transaction?.objectStore('notes');
                if (notesStore) {
                    const cursorRequest = notesStore.openCursor();
                    cursorRequest.onsuccess = () => {
                        const cursor = cursorRequest.result;
                        if (!cursor)
                            return;
                        const note = cursor.value;
                        summaries.put(createNoteSummary(note));
                        cursor.continue();
                    };
                }
            }
        };
        // 데이터베이스 열기 성공 시
        request.onsuccess = () => {
            db = request.result;
            console.log('Database initialized');
            resolve(db);
        };
        // 데이터베이스 열기 실패 시
        request.onerror = () => {
            console.error('Database error:', request.error?.name);
            reject(request.error);
        };
    });
}
/**
 * Gets the database instance.
 * @returns {IDBDatabase} The database instance.
 */
function getDB() {
    return db;
}
/**
 * Closes the database connection.
 */
function closeDB() {
    if (db) {
        db.close();
        db = undefined;
    }
}
/**
 * Executes an operation within a database transaction.
 * @param {string} storeName The object store name.
 * @param {string} mode The transaction mode ('readonly' or 'readwrite').
 * @param {function(IDBObjectStore): IDBRequest} operation A function that receives the object store and returns an IDBRequest.
 * @returns {Promise<*>} A promise that resolves with the request result.
 */
function dbTransaction(storeName, mode, operation) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error('DB not initialized'));
            return;
        }
        const transaction = db.transaction([storeName], mode);
        const store = transaction.objectStore(storeName);
        const request = operation(store);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}
// Export functions
export { initDB, getDB, closeDB, dbTransaction };
