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
 * Gets the database instance.
 * @returns {IDBDatabase} The database instance.
 */
function getDB() {
  return db;
}

// Export functions
export {
  initDB,
  getDB
};