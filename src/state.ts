// State management conventions:
// - Prefer in-place mutation (splice, push) for array state when possible
// - Use setter functions (setNotes, setDeletedNotes) only when replacing the entire array
// - ES module exports are live bindings, so in-place mutations are visible to all importers

// Shared state variables across modules
import { isLoadedNote } from './note-summary.js';
import type { GlobalSettings, Note, NoteListEntry } from './types.js';

export let notes: NoteListEntry[] = [];         // 활성 노트 목록
export let deletedNotes: NoteListEntry[] = [];  // 삭제된 노트 목록 (휴지통)
export let globalSettings: Partial<GlobalSettings> = {}; // 전역 설정 객체 (모든 노트에 적용)
export let isGlobalSettings = false; // 현재 전역 설정 편집 중인지 여부

// Active note state
export let activeNoteId: string | null = null;        // 현재 편집 중인 노트 ID
export let originalNoteContent = '';   // 노트의 원래 내용 (뒤로가기 시 저장 확인용)
export let isPreview = false;          // 미리보기 모드 여부

// Functions to update state from other modules
export function setNotes(newNotes: NoteListEntry[]): void {
  notes = newNotes;
}

export function setDeletedNotes(newDeletedNotes: NoteListEntry[]): void {
  deletedNotes = newDeletedNotes;
}

export function hydrateNote(note: Note): Note {
  const collection = note.metadata.deletedAt ? deletedNotes : notes;
  const index = collection.findIndex(candidate => candidate.id === note.id);
  if (index >= 0) {
    collection.splice(index, 1, note);
  } else {
    collection.push(note);
  }
  return note;
}

export function getLoadedNote(id: string | null = activeNoteId): Note | null {
  if (!id) return null;
  const note = notes.find(candidate => candidate.id === id);
  return isLoadedNote(note) ? note : null;
}

export function setGlobalSettings(newSettings: Partial<GlobalSettings>): void {
  globalSettings = newSettings;
}

export function setIsGlobalSettings(value: boolean): void {
  isGlobalSettings = value;
}

export function setActiveNoteId(id: string | null): void {
  activeNoteId = id;
}

export function setOriginalNoteContent(content: string): void {
  originalNoteContent = content;
}

export function setIsPreview(value: boolean): void {
  isPreview = value;
}
