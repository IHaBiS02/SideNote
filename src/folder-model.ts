import type { Folder, ListItem, TreeSnapshot } from './types.js';
import { batchTimestampCeiling, compareItems, parentOf, pinValue } from './list-order.js';

export const isFolder = (item: ListItem): item is Folder => 'kind' in item && item.kind === 'folder';
export const allItems = (tree: TreeSnapshot): ListItem[] => [...tree.notes, ...tree.folders];
export function children(tree: TreeSnapshot, parentId: string | null): ListItem[] {
  return allItems(tree).filter(item => !item.metadata.deletedAt && parentOf(item) === parentId).sort(compareItems);
}

/** Validate parent links and compute effective timestamps bottom-up, without bodies. */
export function updateFolderDates(tree: TreeSnapshot): void {
  const byId = new Map(tree.folders.map(folder => [folder.id, folder]));
  const pending = new Map<string, number>();
  const values = new Map<string, number>();
  const ready: Folder[] = [];
  for (const folder of tree.folders) {
    pending.set(folder.id, 0);
    values.set(folder.id, folder.ownModifiedAt);
  }
  for (const item of allItems(tree)) {
    const parentId = parentOf(item);
    if (parentId && !byId.has(parentId)) throw new Error('Folder parent is missing');
    if (isFolder(item) && parentId) pending.set(parentId, pending.get(parentId)! + 1);
    if (!isFolder(item) && !item.metadata.deletedAt && parentId) {
      values.set(parentId, Math.max(values.get(parentId)!, item.metadata.lastModified));
    }
  }
  for (const folder of tree.folders) if (pending.get(folder.id) === 0) ready.push(folder);
  let visited = 0;
  while (ready.length) {
    const folder = ready.pop()!;
    visited++;
    folder.metadata.lastModified = values.get(folder.id)!;
    if (folder.parentId) {
      if (!folder.metadata.deletedAt) values.set(folder.parentId,
        Math.max(values.get(folder.parentId)!, folder.metadata.lastModified));
      pending.set(folder.parentId, pending.get(folder.parentId)! - 1);
      if (pending.get(folder.parentId) === 0) ready.push(byId.get(folder.parentId)!);
    }
  }
  if (visited !== tree.folders.length) throw new Error('Circular folder hierarchy');
}

export function setPinned(item: ListItem, pinned: boolean, order = 0, now = Date.now()): void {
  item.isPinned = pinned;
  if (pinned) { item.pinOrder = order; item.pinnedAt = now; }
  else { delete item.pinOrder; delete item.pinnedAt; }
}

export function planMove(tree: TreeSnapshot, ids: string[], sourceId: string | null,
  target: { folderId: string } | { up: true }, now = Date.now()): void {
  const source = sourceId ? tree.folders.find(f => f.id === sourceId && !f.metadata.deletedAt) : null;
  if (sourceId && !source) throw new Error('Source folder is missing');
  const selected = new Set(ids);
  const moving = children(tree, sourceId).filter(item => selected.has(item.id));
  if (!ids.length || selected.size !== ids.length || moving.length !== ids.length) throw new Error('Invalid selection');
  if (moving.some(item => item.isPinned !== moving[0].isPinned)) throw new Error('Select items from one pin section');
  let destination: string | null;
  let pinned: boolean;
  if ('up' in target) {
    if (!source) throw new Error('Already at the root');
    destination = parentOf(source);
    pinned = source.isPinned;
  } else {
    const folder = children(tree, sourceId).find(item => item.id === target.folderId && isFolder(item));
    if (!folder || selected.has(folder.id)) throw new Error('Invalid destination folder');
    if (folder.isPinned !== moving[0].isPinned) throw new Error('The folder must have the same pin state');
    destination = folder.id;
    pinned = false;
  }
  // Even callers outside the UI cannot create a self/descendant cycle.
  let ancestor = destination;
  const seen = new Set<string>();
  while (ancestor) {
    if (selected.has(ancestor) || seen.has(ancestor)) throw new Error('Cannot move a folder into itself');
    seen.add(ancestor);
    ancestor = tree.folders.find(f => f.id === ancestor)?.parentId ?? null;
  }
  if (source) source.ownModifiedAt = Math.max(source.ownModifiedAt, now);
  updateFolderDates(tree);
  const destinationItems = children(tree, destination);
  // Include moved folder subtree times, so moving it never changes its internal order.
  const maximum = [...destinationItems, ...moving].reduce((v, item) => Math.max(v, item.metadata.lastModified), 0);
  const ceiling = batchTimestampCeiling(now, maximum, moving.length);
  let nextPin = destinationItems.filter(i => i.isPinned).reduce((v, i) => Math.max(v, pinValue(i)), -1) + 1;
  moving.forEach((item, index) => {
    item.parentId = destination;
    item.metadata.lastModified = ceiling - index;
    if (isFolder(item)) item.ownModifiedAt = ceiling - index;
    setPinned(item, pinned, nextPin++, now);
  });
  children(tree, destination).filter(item => item.isPinned).forEach((item, index) => { item.pinOrder = index; });
  updateFolderDates(tree);
}

export function subtreeIds(tree: TreeSnapshot, rootId: string): Set<string> {
  const result = new Set([rootId]);
  const byParent = new Map<string, ListItem[]>();
  for (const item of allItems(tree)) {
    const parent = parentOf(item);
    if (parent) byParent.set(parent, [...(byParent.get(parent) ?? []), item]);
  }
  const queue = [rootId];
  for (let i = 0; i < queue.length; i++) {
    for (const item of byParent.get(queue[i]) ?? []) {
      if (result.has(item.id)) continue;
      result.add(item.id); queue.push(item.id);
    }
  }
  return result;
}
