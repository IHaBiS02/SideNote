import { getDB } from './init.js';
import { createNoteSummary } from '../note-summary.js';
import { updateFolderDates } from '../folder-model.js';
import type { Folder, Note, StoredImage, TreeSnapshot } from '../types.js';

export function getAllFolders(): Promise<Folder[]> {
  return new Promise((resolve, reject) => {
    const db = getDB();
    if (!db) { reject(new Error('DB not initialized')); return; }
    const request = db.transaction('folders').objectStore('folders').getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function publishTree(tree: TreeSnapshot): void {
  document.dispatchEvent(new CustomEvent('sidenote-tree-changed', { detail: tree }));
}

/** Schedule reads within the caller's transaction; never await external work here. */
export function readTree(transaction: IDBTransaction, action: (tree: TreeSnapshot) => void): void {
  const notes = transaction.objectStore('noteSummaries').getAll();
  const folders = transaction.objectStore('folders').getAll();
  let remaining = 2;
  const done = (): void => {
    if (--remaining) return;
    action({ notes: notes.result, folders: folders.result });
  };
  notes.onsuccess = done;
  folders.onsuccess = done;
}

/** Tree metadata edits commit together with full-note mirrors and image cleanup. */
export function mutateTree(
  plan: (tree: TreeSnapshot) => void,
  additions: { notes?: Note[]; images?: StoredImage[] } = {},
): Promise<TreeSnapshot> {
  return new Promise((resolve, reject) => {
    const db = getDB();
    if (!db) { reject(new Error('DB not initialized')); return; }
    const transaction = db.transaction(['notes', 'noteSummaries', 'folders', 'images'], 'readwrite');
    let result: TreeSnapshot;
    let failure: unknown;
    readTree(transaction, tree => {
      try {
        const oldNotes = new Map(tree.notes.map(n => [n.id, JSON.stringify(n)]));
        const oldFolders = new Set(tree.folders.map(f => f.id));
        const oldImages = new Set(tree.notes.flatMap(n => n.imageIds ?? []));
        for (const note of additions.notes ?? []) tree.notes.push(createNoteSummary(note));
        plan(tree);
        updateFolderDates(tree);
        const newIds = new Set(tree.notes.map(n => n.id));
        for (const id of oldNotes.keys()) if (!newIds.has(id)) {
          transaction.objectStore('notes').delete(id);
          transaction.objectStore('noteSummaries').delete(id);
        }
        const newNotes = new Map((additions.notes ?? []).map(n => [n.id, n]));
        for (const summary of tree.notes) {
          if (oldNotes.get(summary.id) === JSON.stringify(summary)) continue;
          const write = (note: Note): void => {
            const merged: Note = { ...note, ...summary };
            if (summary.deletionGroup === undefined) delete merged.deletionGroup;
            if (summary.pinOrder === undefined) delete merged.pinOrder;
            if (summary.pinnedAt === undefined) delete merged.pinnedAt;
            transaction.objectStore('notes').put(merged);
            transaction.objectStore('noteSummaries').put(createNoteSummary(merged));
          };
          const added = newNotes.get(summary.id);
          if (added) write(added);
          else {
            const request = transaction.objectStore('notes').get(summary.id);
            request.onsuccess = () => {
              if (!request.result) { failure = new Error('Note disappeared during update'); transaction.abort(); }
              else write(request.result);
            };
          }
        }
        for (const folder of tree.folders) {
          transaction.objectStore('folders').put(folder);
          oldFolders.delete(folder.id);
        }
        for (const id of oldFolders) transaction.objectStore('folders').delete(id);
        // Only images whose last note reference was permanently removed are deleted.
        // Soft-deleted notes still count as references, making restore lossless.
        const remainingImages = new Set(tree.notes.flatMap(n => n.imageIds ?? []));
        for (const id of oldImages) if (!remainingImages.has(id)) transaction.objectStore('images').delete(id);
        for (const image of additions.images ?? []) transaction.objectStore('images').put(image);
        result = tree;
      } catch (error) { failure = error; transaction.abort(); }
    });
    transaction.oncomplete = () => { publishTree(result); resolve(result); };
    transaction.onerror = () => reject(failure ?? transaction.error);
    transaction.onabort = () => reject(failure ?? transaction.error ?? new Error('Storage update aborted'));
  });
}
