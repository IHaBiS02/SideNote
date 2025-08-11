// Shared state variables across modules
export let notes = [];         // 활성 노트 목록
export let deletedNotes = [];  // 삭제된 노트 목록 (휴지통)
export let globalSettings = {}; // 전역 설정 객체 (모든 노트에 적용)
export let isGlobalSettings = false; // 현재 전역 설정 편집 중인지 여부

// Active note state
export let activeNoteId = null;        // 현재 편집 중인 노트 ID
export let originalNoteContent = '';   // 노트의 원래 내용 (뒤로가기 시 저장 확인용)
export let isPreview = false;          // 미리보기 모드 여부

// Functions to update state from other modules
export function setNotes(newNotes) {
  notes = newNotes;
}

export function setDeletedNotes(newDeletedNotes) {
  deletedNotes = newDeletedNotes;
}

export function setGlobalSettings(newSettings) {
  globalSettings = newSettings;
}

export function setIsGlobalSettings(value) {
  isGlobalSettings = value;
}

export function setActiveNoteId(id) {
  activeNoteId = id;
}

export function setOriginalNoteContent(content) {
  originalNoteContent = content;
}

export function setIsPreview(value) {
  isPreview = value;
}