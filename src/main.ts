// Import all required modules  
import { initDB, saveNote, getAllNotes, getAllImageObjectsFromDB, deleteNotePermanentlyDB, deleteImagePermanently } from './database/index.js';
import { THIRTY_DAYS_MS } from './constants.js';
import { sortNotes } from './notes.js';
import { applyFontSize, applyLineHeightSettings, applyMode, normalizeGlobalSettings, updateLegacyLineBreakControls, updateTildeReplacementButton } from './settings.js';
import { showListView } from './notes_view/index.js';
import { deletedNotes, globalSettings, setNotes, setDeletedNotes, setGlobalSettings } from './state.js';
// Import events initialization function
import { initializeAllEvents } from './events/index.js';
import type { GlobalSettings, Note } from './types.js';

// === 애플리케이션 초기화 ===

async function bootstrap(): Promise<void> {
  await initDB();
  await loadAndMigrateData();
  await cleanupDeletedImages();
  initializeInitialView();
  initializeAllEvents();
}

function initializeInitialView(): void {
  const settings = normalizeGlobalSettings(globalSettings);
  applyMode(settings.mode);
  applyFontSize(settings.fontSize);
  applyLineHeightSettings(settings);
  updateLegacyLineBreakControls();
  updateTildeReplacementButton();
  showListView();
}

/**
 * Loads data from storage and migrates it to IndexedDB if necessary.
 */
async function loadAndMigrateData(): Promise<void> {
  // chrome.storage.local에서 설정 및 노트 데이터 로드
  const data = await browser.storage.local.get(['globalSettings', 'notes', 'deletedNotes']);
  const loadedSettings = data.globalSettings as Partial<GlobalSettings> | undefined;
  setGlobalSettings(normalizeGlobalSettings(loadedSettings));

  const loadedNotes = data.notes as Note[] | undefined;
  const loadedDeletedNotes = data.deletedNotes as Note[] | undefined;

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
  await cleanupDeletedNotes();    // 30일 이상 된 삭제 노트 정리
}

/**
 * Deletes images that have been in the recycle bin for more than 30 days.
 */
// === 정리 함수 ===

async function cleanupDeletedImages(): Promise<void> {
    const thirtyDaysAgo = Date.now() - THIRTY_DAYS_MS; // 30일 전 타임스탬프
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
async function cleanupDeletedNotes(): Promise<void> {
    const thirtyDaysAgo = Date.now() - THIRTY_DAYS_MS; // 30일 전 타임스탬프
    // 30일 이상 오래된 삭제 노트 찾기
    const notesToDelete = deletedNotes.filter(
      note => typeof note.metadata.deletedAt === 'number'
        && note.metadata.deletedAt < thirtyDaysAgo,
    );
    // 영구 삭제
    for (const note of notesToDelete) {
        await deleteNotePermanentlyDB(note.id);
    }
    // 메모리에서도 제거
    setDeletedNotes(deletedNotes.filter(
      note => typeof note.metadata.deletedAt === 'number'
        && note.metadata.deletedAt >= thirtyDaysAgo,
    ));
}

if (!globalThis.__SIDENOTE_DISABLE_AUTO_BOOTSTRAP__) {
  bootstrap().catch(err => console.error("Failed to initialize SideNote:", err));
}

export {
  bootstrap,
  loadAndMigrateData,
  cleanupDeletedImages,
  cleanupDeletedNotes,
  initializeInitialView
};
