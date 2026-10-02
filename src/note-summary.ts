import { extractImageIds } from './utils.js';
import type { Note, NoteListEntry, NoteSummary } from './types.js';

function createNoteSummary(note: Note): NoteSummary {
  return {
    id: note.id,
    parentId: note.parentId ?? null,
    imageIds: extractImageIds(note.content),
    ...(note.deletionGroup ? { deletionGroup: note.deletionGroup } : {}),
    title: note.title,
    metadata: { ...note.metadata },
    isPinned: note.isPinned === true,
    ...(Number.isFinite(note.pinnedAt)
      ? { pinnedAt: Number(note.pinnedAt) }
      : {}),
    ...(Number.isFinite(note.pinOrder)
      ? { pinOrder: Number(note.pinOrder) }
      : {}),
  };
}

function isLoadedNote(note: NoteListEntry | undefined | null): note is Note {
  return Boolean(
    note
    && typeof (note as Partial<Note>).content === 'string',
  );
}

export { createNoteSummary, isLoadedNote };
