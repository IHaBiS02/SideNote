import { beforeEach, afterEach, it, expect } from 'vitest';
import JSZip from 'jszip';
import { initDB, closeDB } from '../../src/database/init.js';
import { getAllNotes, getAllNoteSummaries, saveNote } from '../../src/database/notes.js';
import { getAllFolders, mutateTree } from '../../src/database/tree.js';
import { createTreeArchive, importTreeArchive, isTreeArchive } from '../../src/folder-archive.js';
import { parseSnotesArchive, saveImportedNotes } from '../../src/import_export.js';

const folder = (id, parentId = null, pinOrder = 0) => ({ id, title: id, kind: 'folder', parentId,
  isPinned: true, pinOrder, ownModifiedAt: 100, metadata: { createdAt: 50, lastModified: 100 } });
const note = (id, parentId = null) => ({ id, parentId, title: id, content: '# Content', settings: { fontSize: 17 },
  isPinned: true, pinOrder: 1, metadata: { createdAt: 10, lastModified: 80 } });
beforeEach(async () => {
  globalThis.JSZip = JSZip;
  closeDB(); await new Promise(resolve => { indexedDB.deleteDatabase('SimpleNotesDB').onsuccess = resolve; });
  await initDB();
});
afterEach(closeDB);

it('round trips nested and empty folders with remapped IDs, metadata and mixed pin order', async () => {
  const zip = await createTreeArchive([note('n', 'inner'), note('root')], [folder('outer'), folder('inner', 'outer'), folder('empty', 'outer', 2)]);
  const bytes = await zip.generateAsync({ type: 'uint8array' });
  const loaded = await JSZip.loadAsync(bytes);
  expect(await isTreeArchive(loaded)).toBe(true);
  await importTreeArchive(loaded);
  const ns = await getAllNotes(); const fs = await getAllFolders();
  const outer = fs.find(f => f.title === 'outer'); const inner = fs.find(f => f.title === 'inner');
  expect(ns).toHaveLength(2); expect(fs).toHaveLength(3);
  expect(outer.id).not.toBe('outer'); expect(inner.parentId).toBe(outer.id);
  expect(fs.find(f => f.title === 'empty').parentId).toBe(outer.id);
  expect(ns.find(n => n.title === 'n')).toMatchObject({ parentId: inner.id, pinOrder: 1, content: '# Content', settings: { fontSize: 17 }, metadata: { createdAt: 10, lastModified: 80 } });
  expect(ns.find(n => n.title === 'root').pinOrder).toBeGreaterThan(outer.pinOrder);
  await importTreeArchive(loaded);
  expect(new Set((await getAllNotes()).map(n => n.id)).size).toBe(4);
});
it('supports a backup containing only empty folders', async () => {
  await importTreeArchive(await createTreeArchive([], [folder('empty')]));
  expect(await getAllNotes()).toHaveLength(0); expect(await getAllFolders()).toHaveLength(1);
});
it.each(['cycle', 'missing-parent', 'duplicate-id', 'missing-note', 'bad-version'])('rejects %s before any storage changes', async kind => {
  await saveNote(note('existing'));
  const zip = await createTreeArchive([note('n', 'f')], [folder('f')]);
  const manifest = JSON.parse(await zip.file('manifest.json').async('string'));
  if (kind === 'cycle') manifest.folders[0].parentId = 'f';
  if (kind === 'missing-parent') manifest.notes[0].parentId = 'missing';
  if (kind === 'duplicate-id') manifest.notes[0].id = 'f';
  if (kind === 'missing-note') zip.remove('n/note.md');
  if (kind === 'bad-version') manifest.formatVersion = 999;
  zip.file('manifest.json', JSON.stringify(manifest));
  await expect(importTreeArchive(zip)).rejects.toThrow();
  expect((await getAllNotes()).map(n => n.id)).toEqual(['existing']); expect(await getAllFolders()).toHaveLength(0);
});
it('still imports version 1 and manifest-free archives into root', async () => {
  for (const versioned of [true, false]) {
    const zip = new JSZip();
    zip.file('old/note.md', 'old body'); zip.file('old/metadata.json', JSON.stringify({ title: 'old', metadata: { createdAt: 1, lastModified: 2 } }));
    if (versioned) zip.file('manifest.json', JSON.stringify({ formatVersion: 1, notes: [{ folder: 'old', order: 0, isPinned: true }] }));
    expect(await isTreeArchive(zip)).toBe(false);
    await saveImportedNotes(await parseSnotesArchive(zip));
  }
  expect(await getAllNoteSummaries()).toHaveLength(2);
  expect((await getAllNotes()).every(n => n.parentId === null)).toBe(true);
});
