// Import all required modules  
import {
  initDB,
  saveNote,
  getAllNoteSummaries,
  getDeletedImageIdsFromDB,
  deleteNotePermanentlyDB,
  deleteImagePermanently,
} from './database/index.js';
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
  initializeInitialView();
  initializeAllEvents();
  scheduleStartupMaintenance();
}

async function runStartupMaintenance(): Promise<void> {
  await Promise.all([
    cleanupDeletedNotes(),
    cleanupDeletedImages(),
  ]);
}

function scheduleStartupMaintenance(): void {
  const runAfterPaint = (): void => {
    setTimeout(() => {
      void runStartupMaintenance().catch((error) => {
        console.error('Failed to complete startup maintenance:', error);
      });
    }, 0);
  };

  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(runAfterPaint);
  } else {
    setTimeout(runAfterPaint, 0);
  }
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

  // Load only list metadata. Full Markdown is fetched when a note is opened.
  const allNotesFromDB = await getAllNoteSummaries();
  // 활성 노트와 삭제된 노트 분리
  setNotes(allNotesFromDB.filter(note => !note.metadata.deletedAt));
  setDeletedNotes(allNotesFromDB.filter(note => note.metadata.deletedAt));

  sortNotes();              // 노트 정렬
}

/**
 * Deletes images that have been in the recycle bin for more than 30 days.
 */
// === 정리 함수 ===

async function cleanupDeletedImages(): Promise<void> {
    const thirtyDaysAgo = Date.now() - THIRTY_DAYS_MS; // 30일 전 타임스탬프
    const imageIdsToDelete = await getDeletedImageIdsFromDB(thirtyDaysAgo);
    // 영구 삭제
    for (const imageId of imageIdsToDelete) {
        await deleteImagePermanently(imageId);
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
  runStartupMaintenance,
  scheduleStartupMaintenance,
  initializeInitialView
};
