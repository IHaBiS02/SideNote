// Import all required modules  
import { initDB, saveNote, getAllNotes, getAllImageObjectsFromDB, deleteNotePermanentlyDB, deleteImagePermanently } from './database.js';
import { sortNotes } from './notes.js';
import { applyFontSize, applyMode, updateAutoLineBreakButton, updateTildeReplacementButton } from './settings.js';
import { renderNoteList, showListView } from './notes_view/index.js';
import { pushToHistory } from './history.js';
import { notes, deletedNotes, globalSettings, setNotes, setDeletedNotes, setGlobalSettings } from './state.js';
// Import events initialization function
import { initializeAllEvents } from './events/index.js';

// === 애플리케이션 초기화 ===

// 스크립트 로드 시 데이터베이스 초기화
initDB().then(() => {
  loadAndMigrateData();   // 데이터 로드 및 마이그레이션
  cleanupDeletedImages(); // 삭제된 이미지 정리
}).catch(err => console.error("Failed to initialize DB:", err));

/**
 * Loads data from storage and migrates it to IndexedDB if necessary.
 */
async function loadAndMigrateData() {
  // chrome.storage.local에서 설정 및 노트 데이터 로드
  const data = await browser.storage.local.get(['globalSettings', 'notes', 'deletedNotes']);
  const loadedSettings = data.globalSettings;
  if (loadedSettings) {
    setGlobalSettings(loadedSettings);
  } else {
    // 기본 전역 설정
    setGlobalSettings({
      title: 'default',            // 노트 제목 설정
      fontSize: 12,                // 글꼴 크기
      autoLineBreak: true,         // 자동 줄바꿈
      tildeReplacement: true,      // 틸데 자동 이스케이프
      autoAddSpaces: true,         // Enter 시 자동 공백 추가
      preventUsedImageDeletion: true, // 사용 중인 이미지 삭제 방지
      mode: 'system'               // 다크 모드 설정
    });
  }

  const loadedNotes = data.notes;
  const loadedDeletedNotes = data.deletedNotes;

  // chrome.storage.local에서 IndexedDB로 일회성 마이그레이션
  if (loadedNotes || loadedDeletedNotes) {
    const allNotesToMigrate = (loadedNotes || []).concat(loadedDeletedNotes || []);
    if (allNotesToMigrate.length > 0) {
      try {
        // 모든 노트를 IndexedDB로 이동
        for (const note of allNotesToMigrate) {
          await saveNote(note);
        }
        // 마이그레이션 완료 후 chrome.storage에서 삭제
        await browser.storage.local.remove(['notes', 'deletedNotes']);
      } catch (err) {
        console.error("Failed to migrate notes to IndexedDB:", err);
      }
    }
  }

  // IndexedDB에서 모든 노트 로드
  const allNotesFromDB = await getAllNotes();
  // 활성 노트와 삭제된 노트 분리
  setNotes(allNotesFromDB.filter(note => !note.metadata.deletedAt));
  setDeletedNotes(allNotesFromDB.filter(note => note.metadata.deletedAt));

  sortNotes();              // 노트 정렬
  renderNoteList();         // 노트 목록 렌더링
  applyMode(globalSettings.mode); // 테마 적용
  cleanupDeletedNotes();    // 30일 이상 된 삭제 노트 정리
}

/**
 * Deletes images that have been in the recycle bin for more than 30 days.
 */
// === 정리 함수 ===

async function cleanupDeletedImages() {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000; // 30일 전 타임스탬프
    const imageObjects = await getAllImageObjectsFromDB();
    // 30일 이상 오래된 삭제 이미지 찾기
    const imagesToDelete = imageObjects.filter(img => img.deletedAt && img.deletedAt < thirtyDaysAgo);
    // 영구 삭제
    for (const image of imagesToDelete) {
        await deleteImagePermanently(image.id);
    }
}

/**
 * Deletes notes that have been in the recycle bin for more than 30 days.
 */
async function cleanupDeletedNotes() {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000; // 30일 전 타임스탬프
    // 30일 이상 오래된 삭제 노트 찾기
    const notesToDelete = deletedNotes.filter(note => note.metadata.deletedAt < thirtyDaysAgo);
    // 영구 삭제
    for (const note of notesToDelete) {
        await deleteNotePermanentlyDB(note.id);
    }
    // 메모리에서도 제거
    setDeletedNotes(deletedNotes.filter(note => note.metadata.deletedAt >= thirtyDaysAgo));
}

// === 초기 화면 설정 ===

// 노트 목록 화면으로 시작
showListView();
pushToHistory({ view: 'list' });

// UI 초기 설정
updateAutoLineBreakButton();      // 자동 줄바꿈 버튼 상태
updateTildeReplacementButton();   // 틸데 대체 버튼 상태
applyFontSize(globalSettings.fontSize || 12);  // 글꼴 크기 적용
applyMode(globalSettings.mode || 'system');    // 다크 모드 적용
renderNoteList();                  // 노트 목록 렌더링

// 모든 이벤트 리스너 초기화
initializeAllEvents();