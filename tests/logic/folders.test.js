import { beforeEach, afterEach, describe, expect, it } from 'vitest';
import { initDB, closeDB, getDB } from '../../src/database/init.js';
import { getNote, saveNote, getAllNoteSummaries } from '../../src/database/notes.js';
import { saveImage, getImage } from '../../src/database/images.js';
import { getAllFolders, mutateTree } from '../../src/database/tree.js';
import { createNoteSummary } from '../../src/note-summary.js';
import { applyTreeSnapshot, setCurrentFolderId, folders, notes, deletedNotes } from '../../src/state.js';
import { children, planMove, updateFolderDates } from '../../src/folder-model.js';
import { createFolder, moveItems, toggleItemPin, reorderItems, trashItem, restoreItem, purgeItems, currentTree } from '../../src/folders.js';

const note = (id, parentId = null, isPinned = false, time = 100) => ({
  id, title: id, content: `# ${id}`, settings: {}, parentId, isPinned,
  ...(isPinned ? { pinOrder: 0, pinnedAt: 1 } : {}), metadata: { createdAt: 1, lastModified: time },
});
const folder = (id, parentId = null, isPinned = false, time = 1) => ({
  id, title: id, kind: 'folder', parentId, isPinned, ownModifiedAt: time,
  ...(isPinned ? { pinOrder: 0, pinnedAt: 1 } : {}), metadata: { createdAt: 1, lastModified: time },
});
async function seed(ns, fs) {
  applyTreeSnapshot(await mutateTree(tree => { tree.folders.push(...fs); }, { notes: ns }));
}
beforeEach(async () => {
  closeDB(); await new Promise(resolve => { indexedDB.deleteDatabase('SimpleNotesDB').onsuccess = resolve; });
  await initDB(); applyTreeSnapshot({ notes: [], folders: [] }); setCurrentFolderId(null);
});
afterEach(closeDB);

describe('folder moves and storage', () => {
  it.each([[false, false, true], [true, true, true], [true, false, false], [false, true, false]])(
    'entering: note pin=%s, folder pin=%s, allowed=%s', async (pin, folderPin, allowed) => {
      await seed([note('n', null, pin)], [folder('f', null, folderPin)]);
      if (allowed) {
        await moveItems(['n'], { folderId: 'f' });
        expect(await getNote('n')).toMatchObject({ parentId: 'f', isPinned: false, content: '# n' });
        expect((await getAllNoteSummaries())[0].parentId).toBe('f');
      } else {
        await expect(moveItems(['n'], { folderId: 'f' })).rejects.toThrow('pin state');
        expect((await getNote('n')).parentId).toBeNull();
      }
    });
  it.each([[false, false], [false, true], [true, false], [true, true]])(
    'exiting inherits parent pin=%s regardless of item pin=%s', async (parentPin, pin) => {
      await seed([note('n', 'b', pin)], [folder('a'), folder('b', 'a', parentPin)]);
      setCurrentFolderId('b'); await moveItems(['n'], { up: true });
      expect(await getNote('n')).toMatchObject({ parentId: 'a', isPinned: parentPin });
      if (!parentPin) expect((await getNote('n')).pinOrder).toBeUndefined();
    });
  it('moves a pinned B out of unpinned A as unpinned while preserving B contents', async () => {
    const ns = [note('p', 'b', true, 50), note('u', 'b', false, 100)];
    await seed(ns, [folder('a'), folder('b', 'a', true)]);
    setCurrentFolderId('a'); await moveItems(['b'], { up: true });
    expect(folders.find(f => f.id === 'b')).toMatchObject({ parentId: null, isPinned: false });
    expect(await getNote('p')).toMatchObject(ns[0]); expect(await getNote('u')).toMatchObject(ns[1]);
  });
  it('batches by display order with 1ms spacing above existing future timestamps', async () => {
    const future = Date.now() + 100000;
    await seed([note('a', 'f', false, 400), note('b', 'f', false, 300), note('old', null, false, future)], [folder('f')]);
    setCurrentFolderId('f'); await moveItems(['b', 'a'], { up: true });
    const a = await getNote('a'); const b = await getNote('b');
    expect(a.metadata.lastModified - b.metadata.lastModified).toBe(1);
    expect(b.metadata.lastModified).toBeGreaterThan(future);
    expect(children(currentTree(), null).slice(0, 2).map(n => n.id)).toEqual(['a', 'b']);
    closeDB(); await initDB();
    const restored = { notes: await getAllNoteSummaries(), folders: await getAllFolders() };
    expect(children(restored, null).slice(0, 2).map(n => n.id)).toEqual(['a', 'b']);
  });
  it('pins an unpinned batch after existing root pins in its prior date order', async () => {
    await seed([note('a', 'f', false, 400), note('b', 'f', false, 300), note('p', null, true)], [folder('f', null, true)]);
    setCurrentFolderId('f'); await moveItems(['b', 'a'], { up: true });
    expect(children(currentTree(), null).map(n => n.id).slice(-2)).toEqual(['a', 'b']);
    expect(notes.find(n => n.id === 'a').isPinned).toBe(true);
  });
  it('rejects mixed selections, self moves, nonexistent targets and root exits atomically', async () => {
    await seed([note('p', null, true), note('u')], [folder('f')]);
    const before = await getAllNoteSummaries();
    await expect(moveItems(['p', 'u'], { folderId: 'f' })).rejects.toThrow('one pin section');
    await expect(moveItems(['f'], { folderId: 'f' })).rejects.toThrow();
    await expect(moveItems(['u'], { folderId: 'missing' })).rejects.toThrow();
    await expect(moveItems(['u'], { up: true })).rejects.toThrow('root');
    expect(await getAllNoteSummaries()).toEqual(before);
  });
  it('keeps folder and note pin ordering scoped to their parent', async () => {
    await seed([note('root', null, true), note('n', 'a', false)], [folder('a'), folder('b', 'a', true)]);
    setCurrentFolderId('a'); await toggleItemPin('n'); await reorderItems(['n', 'b']);
    expect(notes.find(n => n.id === 'n').pinOrder).toBe(0);
    expect(folders.find(f => f.id === 'b').pinOrder).toBe(1);
    expect(notes.find(n => n.id === 'root').pinOrder).toBe(0);
    await expect(reorderItems(['root', 'n'])).rejects.toThrow();
  });
  it('propagates content edits past pinned ancestors and uses newer folder edits', async () => {
    await seed([note('n', 'b')], [folder('a'), folder('b', 'a', true)]);
    await saveNote({ ...await getNote('n'), metadata: { createdAt: 1, lastModified: 900 } });
    let fs = await getAllFolders();
    expect(fs.map(f => f.metadata.lastModified)).toEqual([900, 900]);
    expect(fs.find(f => f.id === 'b').pinOrder).toBe(0);
    await mutateTree(tree => { tree.folders.find(f => f.id === 'b').ownModifiedAt = 1200; });
    fs = await getAllFolders(); expect(fs.map(f => f.metadata.lastModified)).toEqual([1200, 1200]);
  });
  it('creates empty folders in the current parent and rejects whitespace names', async () => {
    await createFolder(' A '); const a = folders[0]; setCurrentFolderId(a.id);
    await createFolder('B'); expect(folders.find(f => f.title === 'B').parentId).toBe(a.id);
    expect(a.metadata.lastModified).toBe(a.metadata.createdAt);
    await expect(createFolder('   ')).rejects.toThrow();
  });
  it('aborts full-note, summary and folder changes together on a storage failure', async () => {
    await seed([note('n')], [folder('f')]);
    await expect(mutateTree(tree => {
      planMove(tree, ['n'], null, { folderId: 'f' });
      tree.folders[0].uncloneable = () => {};
    })).rejects.toThrow();
    expect((await getNote('n')).parentId).toBeNull();
    expect((await getAllNoteSummaries())[0].parentId).toBeNull();
  });
});

describe('folder recycle lifecycle', () => {
  it('restores a tree but leaves previously deleted children in the bin', async () => {
    await seed([note('n', 'b'), note('old', 'b')], [folder('a'), folder('b', 'a')]);
    await trashItem('old'); await trashItem('a');
    expect(notes).toHaveLength(0); expect(folders.every(f => f.metadata.deletedAt)).toBe(true);
    await restoreItem('a');
    expect(notes.map(n => n.id)).toEqual(['n']); expect(deletedNotes.map(n => n.id)).toEqual(['old']);
    expect(folders.find(f => f.id === 'b').parentId).toBe('a');
  });
  it('restores a child to root when its parent is still deleted', async () => {
    await seed([note('n', 'a')], [folder('a')]); await trashItem('a'); await restoreItem('n');
    expect((await getNote('n')).parentId).toBeNull();
    await purgeItems(['a']); expect(await getNote('n')).toBeDefined();
  });
  it('purges descendants and only unreferenced images, including references from trash', async () => {
    await seed([{ ...note('n', 'a'), content: '![a](images/only.png) ![b](images/shared.png)' },
      { ...note('outside'), content: '![b](images/shared.png)' }], [folder('a')]);
    await saveImage('only', new Blob(['a'])); await saveImage('shared', new Blob(['b']));
    await trashItem('outside'); await trashItem('a'); await purgeItems(['a']);
    expect(await getNote('n')).toBeUndefined(); expect(await getAllFolders()).toHaveLength(0);
    expect(await getImage('only')).toBeNull(); expect(await getImage('shared')).toBeDefined();
  });
});

it('upgrades v4 notes and summaries to root membership without changing content or pin order', async () => {
  closeDB(); await new Promise(resolve => { indexedDB.deleteDatabase('SimpleNotesDB').onsuccess = resolve; });
  const old = await new Promise(resolve => {
    const req = indexedDB.open('SimpleNotesDB', 4);
    req.onupgradeneeded = () => {
      for (const name of ['notes', 'noteSummaries', 'images']) req.result.createObjectStore(name, { keyPath: 'id' });
    };
    req.onsuccess = () => resolve(req.result);
  });
  const legacy = note('legacy', null, true); delete legacy.parentId;
  const deleted = { ...note('deleted'), metadata: { createdAt: 1, lastModified: 2, deletedAt: 3 } }; delete deleted.parentId;
  await new Promise(resolve => {
    const tx = old.transaction(['notes', 'noteSummaries'], 'readwrite');
    for (const n of [legacy, deleted]) { tx.objectStore('notes').put(n); tx.objectStore('noteSummaries').put(createNoteSummary(n)); }
    tx.oncomplete = resolve;
  });
  old.close(); await initDB();
  expect(getDB().version).toBe(5);
  expect(await getNote('legacy')).toEqual({ ...legacy, parentId: null });
  expect(await getNote('deleted')).toEqual({ ...deleted, parentId: null });
  expect(await getAllFolders()).toEqual([]);
});
