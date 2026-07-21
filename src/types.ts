export type ThemeMode = 'system' | 'light' | 'dark';

export interface NoteSettings {
  title?: string;
  fontSize?: number;
  codeBlockHeader?: boolean;
}

export interface GlobalSettings {
  title: string;
  fontSize: number;
  legacyLineBreakMode: boolean;
  autoLineBreak: boolean;
  autoAddSpaces: boolean;
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
}

export interface StoredImage {
  id: string;
  blob: Blob;
  deletedAt: number | null;
}

export interface NavigationHistoryState {
  view: string;
  params?: Record<string, unknown>;
}
