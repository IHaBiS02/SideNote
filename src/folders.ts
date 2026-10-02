import { mutateTree } from './database/tree.js';
import { allItems, children, isFolder, planMove, setPinned, subtreeIds } from './folder-model.js';
import { parentOf, pinValue } from './list-order.js';
import { applyTreeSnapshot, currentFolderId, deletedNotes, folders, notes } from './state.js';
import type { TreeSnapshot } from './types.js';

export function currentTree(): TreeSnapshot { return { notes: [...notes, ...deletedNotes], folders }; }
export function visibleItems() { return children(currentTree(), currentFolderId); }
async function edit(plan: (tree: TreeSnapshot) => void): Promise<void> {
  applyTreeSnapshot(await mutateTree(plan));
}
export async function createFolder(title: string): Promise<void> {
  const name = title.trim();
  if (!name) throw new Error('Enter a folder name');
  const parentId = currentFolderId;
  await edit(tree => {
    if (parentId && !tree.folders.some(f => f.id === parentId && !f.metadata.deletedAt)) throw new Error('Folder is missing');
    const now = Date.now();
    tree.folders.push({ kind: 'folder', id: crypto.randomUUID(), parentId, title: name,
      isPinned: false, ownModifiedAt: now, metadata: { createdAt: now, lastModified: now } });
  });
}
export async function renameFolder(id: string, title: string): Promise<void> {
  if (!title.trim()) throw new Error('Enter a folder name');
  await edit(tree => {
    const folder = tree.folders.find(f => f.id === id && !f.metadata.deletedAt);
    if (!folder) throw new Error('Folder is missing');
    folder.title = title.trim(); folder.ownModifiedAt = Date.now();
  });
}
export async function moveItems(ids: string[], target: { folderId: string } | { up: true }): Promise<void> {
  const source = currentFolderId;
  await edit(tree => planMove(tree, ids, source, target));
}
export async function toggleItemPin(id: string): Promise<void> {
  await edit(tree => {
    const item = allItems(tree).find(i => i.id === id && !i.metadata.deletedAt);
    if (!item) throw new Error('Item is missing');
    const last = children(tree, parentOf(item)).filter(i => i.isPinned).reduce((v, i) => Math.max(v, pinValue(i)), -1);
    setPinned(item, !item.isPinned, last + 1);
  });
}
export async function reorderItems(ids: string[]): Promise<void> {
  const parent = currentFolderId;
  await edit(tree => {
    const pinned = children(tree, parent).filter(i => i.isPinned);
    if (new Set(ids).size !== ids.length || ids.length !== pinned.length || pinned.some(i => !ids.includes(i.id))) throw new Error('Invalid pinned order');
    ids.forEach((id, index) => { pinned.find(i => i.id === id)!.pinOrder = index; });
  });
}
export async function trashItem(id: string): Promise<void> {
  await edit(tree => {
    const item = allItems(tree).find(i => i.id === id && !i.metadata.deletedAt);
    if (!item) return;
    const now = Date.now();
    const group = crypto.randomUUID();
    const affected = isFolder(item) ? subtreeIds(tree, id) : new Set([id]);
    for (const entry of allItems(tree)) if (affected.has(entry.id) && !entry.metadata.deletedAt) {
      entry.metadata.deletedAt = now; entry.deletionGroup = group;
    }
    const parent = tree.folders.find(f => f.id === parentOf(item));
    if (parent) parent.ownModifiedAt = Math.max(parent.ownModifiedAt, now);
  });
}
export async function restoreItem(id: string): Promise<void> {
  await edit(tree => {
    const item = allItems(tree).find(i => i.id === id && i.metadata.deletedAt);
    if (!item) return;
    const affected = isFolder(item) ? subtreeIds(tree, id) : new Set([id]);
    const group = item.deletionGroup;
    const restoring = allItems(tree).filter(i => affected.has(i.id) && i.metadata.deletedAt && (i.id === id || (group && i.deletionGroup === group)));
    const restoredIds = new Set(restoring.map(i => i.id));
    for (const entry of restoring) {
      const parent = tree.folders.find(f => f.id === parentOf(entry));
      if (!parent || (parent.metadata.deletedAt && !restoredIds.has(parent.id))) entry.parentId = null;
      delete entry.metadata.deletedAt; delete entry.deletionGroup;
    }
    const siblings = children(tree, parentOf(item)).filter(i => !restoredIds.has(i.id) && i.isPinned);
    if (item.isPinned) item.pinOrder = siblings.reduce((v, i) => Math.max(v, pinValue(i)), -1) + 1;
    if (isFolder(item)) item.ownModifiedAt = Math.max(Date.now(), item.ownModifiedAt);
    else item.metadata.lastModified = Date.now();
  });
}
export async function purgeItems(ids: string[]): Promise<void> {
  await edit(tree => {
    const remove = new Set<string>();
    for (const id of ids) {
      const item = allItems(tree).find(i => i.id === id && i.metadata.deletedAt);
      if (!item) continue;
      for (const childId of isFolder(item) ? subtreeIds(tree, id) : [id]) remove.add(childId);
    }
    // Keep already-deleted descendants restorable when only part of a group was restored.
    tree.notes = tree.notes.filter(i => !remove.has(i.id));
    tree.folders = tree.folders.filter(i => !remove.has(i.id));
  });
}
