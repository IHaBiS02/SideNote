import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { initDB, closeDB } from '../../src/database/init.js';
import { saveNote, getNote, getAllNoteSummaries } from '../../src/database/notes.js';
import { saveImage, getImage } from '../../src/database/images.js';
import { sortNotes, deleteNote, togglePin, reorderPinnedNotes, restoreNote, deleteNotePermanently, emptyRecycleBin } from '../../src/notes.js';
import { setNotes, setDeletedNotes, setFolders, setCurrentFolderId, notes, deletedNotes } from '../../src/state.js';

const note = (id, extra = {}) => ({ id, title: id, content: '', settings: {}, parentId: null,
  isPinned: false, metadata: { createdAt: 1, lastModified: 100 }, ...extra });
async function seed(values) {
  for (const value of values) await saveNote(value);
  setNotes(values.filter(n => !n.metadata.deletedAt));
  setDeletedNotes(values.filter(n => n.metadata.deletedAt));
}
beforeEach(async () => {
  closeDB();
  await new Promise(resolve => { indexedDB.deleteDatabase('SimpleNotesDB').onsuccess = resolve; });
  await initDB(); setNotes([]); setDeletedNotes([]); setFolders([]); setCurrentFolderId(null);
});
afterEach(closeDB);

describe('note operations through atomic tree storage', () => {
  it('sorts pins by explicit order then unpinned notes by modification time', () => {
    setNotes([note('old'), note('p1', { isPinned: true, pinOrder: 1 }), note('p0', { isPinned: true, pinnedAt: 900, pinOrder: 0 }),
      note('new', { metadata: { createdAt: 1, lastModified: 200 } })]);
    sortNotes(); expect(notes.map(n => n.id)).toEqual(['p0', 'p1', 'new', 'old']);
  });
  it('uses the legacy pinnedAt fallback', () => {
    setNotes([note('late', { isPinned: true, pinnedAt: 200 }), note('early', { isPinned: true, pinnedAt: 100 })]);
    sortNotes(); expect(notes.map(n => n.id)).toEqual(['early', 'late']);
  });
  it('soft deletes and restores both full records and summaries', async () => {
    await seed([note('n')]); await deleteNote('n');
    expect(notes).toHaveLength(0); expect(deletedNotes[0].metadata.deletedAt).toBeTypeOf('number');
    expect((await getNote('n')).metadata.deletedAt).toBeDefined();
    await restoreNote('n');
    expect(deletedNotes).toHaveLength(0);
    expect((await getNote('n')).metadata.deletedAt).toBeUndefined();
    expect((await getAllNoteSummaries())[0].metadata).toEqual(notes[0].metadata);
  });
  it('ignores missing deletes', async () => {
    await deleteNote('missing'); expect(deletedNotes).toHaveLength(0);
  });
  it('pins at the end and removes stale pin fields when unpinned', async () => {
    await seed([note('p', { isPinned: true, pinOrder: 2 }), note('n')]);
    await togglePin('n'); expect((await getNote('n')).pinOrder).toBe(3);
    await togglePin('n');
    expect(await getNote('n')).toMatchObject({ isPinned: false });
    expect((await getNote('n')).pinOrder).toBeUndefined();
    expect((await getNote('n')).pinnedAt).toBeUndefined();
  });
  it('persists complete pinned reorder and rejects incomplete input', async () => {
    await seed([note('a', { isPinned: true, pinOrder: 0 }), note('b', { isPinned: true, pinOrder: 1 }), note('u')]);
    expect(await reorderPinnedNotes(['b'])).toBe(false);
    expect(await reorderPinnedNotes(['b', 'a'])).toBe(true);
    expect((await getNote('b')).pinOrder).toBe(0);
    expect((await getNote('a')).pinOrder).toBe(1);
    expect((await getNote('u')).isPinned).toBe(false);
  });
  it('permanently removes deleted records', async () => {
    await seed([note('n')]); await deleteNote('n'); await deleteNotePermanently('n');
    expect(await getNote('n')).toBeUndefined(); expect(deletedNotes).toHaveLength(0);
  });
  it('empties the bin without deleting active images', async () => {
    await seed([note('n')]); await deleteNote('n');
    await saveImage('active', new Blob(['a']));
    const { deleteImage } = await import('../../src/database/images.js');
    await saveImage('deleted', new Blob(['b'])); await deleteImage('deleted');
    await emptyRecycleBin();
    expect(deletedNotes).toHaveLength(0); expect(await getImage('deleted')).toBeNull();
    expect(await getImage('active')).toBeDefined();
  });
});
