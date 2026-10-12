export const parentOf = (item) => item.parentId ?? null;
export const pinValue = (item) => item.pinOrder ?? item.pinnedAt ?? 0;
export function compareItems(a, b) {
    if (a.isPinned !== b.isPinned)
        return a.isPinned ? -1 : 1;
    return a.isPinned ? pinValue(a) - pinValue(b)
        : b.metadata.lastModified - a.metadata.lastModified;
}
/** Keep a batch newer than its destination while preserving its input order. */
export function batchTimestampCeiling(now, maximum, count) {
    return Math.max(now, maximum) + count + 1;
}
