export type ThemeMode = 'system' | 'light' | 'dark';

export interface NoteSettings {
  title?: string;
  fontSize?: number;
  lineHeight?: number;
  sourceLineHeight?: number;
  codeLineHeight?: number;
  codeBlockHeader?: boolean;
}

export interface GlobalSettings {
  title: string;
  fontSize: number;
  lineHeight: number;
  sourceLineHeight: number;
  codeLineHeight: number;
  pinnedNoteDragDelayMs: number;
  wysiwygPreview: boolean;
  legacyLineBreakMode: boolean;
  autoLineBreak: boolean;
  showTildeReplacementButton: boolean;
  tildeReplacement: boolean;
  codeBlockHeader: boolean;
  preventUsedImageDeletion: boolean;
  mode: ThemeMode;
}

export interface NoteMetadata {
  createdAt: number;
  lastModified: number;
  deletedAt?: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  settings: NoteSettings;
  metadata: NoteMetadata;
  isPinned: boolean;
  pinnedAt?: number;
  pinOrder?: number;
}

export interface StoredImage {
  id: string;
  blob: Blob;
  deletedAt: number | null;
}

export interface NavigationHistoryState {
  view: string;
  params?: {
    noteId?: string | null;
    inEditMode?: boolean;
    isGlobal?: boolean;
  };
}
