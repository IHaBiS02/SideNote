import type { ListItem } from './types.js';

export const parentOf = (item: ListItem): string | null => item.parentId ?? null;
export const pinValue = (item: ListItem): number => item.pinOrder ?? item.pinnedAt ?? 0;
export function compareItems(a: ListItem, b: ListItem): number {
  if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
  return a.isPinned ? pinValue(a) - pinValue(b)
    : b.metadata.lastModified - a.metadata.lastModified;
}

/** Keep a batch newer than its destination while preserving its input order. */
export function batchTimestampCeiling(now: number, maximum: number, count: number): number {
  return Math.max(now, maximum) + count + 1;
}
