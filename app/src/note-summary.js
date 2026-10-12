import { extractImageIds } from './utils.js';
function createNoteSummary(note) {
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
function isLoadedNote(note) {
    return Boolean(note
        && typeof note.content === 'string');
}
export { createNoteSummary, isLoadedNote };
