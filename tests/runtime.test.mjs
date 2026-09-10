import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { SourceTextModule } from 'node:vm';
import { createRequire } from 'node:module';
import { JSDOM } from 'jsdom';
const require = createRequire(import.meta.url);
const JSZip = require('../app/vendor/jszip.min.js');
// JSZip is loaded in Node; supply the browser Blob reader for export tests.
globalThis.FileReader = class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then(result => { this.result = result; this.onload({ target: this }); }, error => this.onerror(error));
  }
};
const root = new URL('../', import.meta.url);
const read = async path => (await readFile(new URL(path, root))).toString();
const publishedNoteCount = JSON.parse(await read('notes/index.json')).length;
async function waitFor(predicate) {
  for (let i = 0; i < 400; i++) {
    if (predicate()) return;
    await new Promise(resolve => setTimeout(resolve, 5));
  }
  throw new Error('App did not reach the expected state');
}
async function app(t, platform, expanded = false) {
  const dom = new JSDOM(await read('app/sidepanel.html'), { url: `https://example.org/SideNote/app/sidepanel.html${expanded ? '?expanded' : ''}`, runScripts: 'outside-only', pretendToBeVisual: true });
  t.after(() => dom.window.close());
  const w = dom.window;
  w.structuredClone = structuredClone;
  w.matchMedia = () => ({ matches: false, addEventListener() {} });
  w.URL.createObjectURL = () => 'blob:test-image';
  w.URL.revokeObjectURL = () => {};
  w.confirm = () => true;
  w.alert = () => {};
  w.scrollTo = () => {};
  w.Range.prototype.getClientRects = () => [];
  w.Range.prototype.getBoundingClientRect = () => ({ left: 0, right: 0, top: 0, bottom: 0 });
  w.JSZip = JSZip;
  w.fetch = async path => {
    const bytes = await readFile(new URL(path, new URL('app/', root)));
    return { ok: true, json: async () => JSON.parse(bytes), arrayBuffer: async () => bytes };
  };
  if (!platform) {
    w.eval(await read('vendor/memory-db.js'));
    platform = { indexedDB: new w.SideNoteMemoryDB.IDBFactory(), IDBKeyRange: w.SideNoteMemoryDB.IDBKeyRange, storage: {}, peers: new Map(),
      register(role, fn) { this.peers.set(role, fn); if (role === 'expanded' && this.latest) fn(this.latest); },
      publish(role, value) { this.latest = value; for (const [key, fn] of this.peers) if (key !== role) fn(value); },
      fail(error) { this.error = error; },
    };
  }
  w.sideNoteWeb = platform;
  w.eval(await read('web-platform.js'));
  w.eval(await read('app/vendor/highlight.min.js'));
  w.eval('(() => {' + (await read('app/vendor/wysiwyg-markdown.js')).replace(/export\s*\{[^}]+\};/g, '') + '})()');
  const context = dom.getInternalVMContext();
  const modules = new Map();
  async function load(url) {
    if (!modules.has(url.href)) modules.set(url.href, readFile(url, 'utf8').then(code => new SourceTextModule(code, { context, identifier: url.href })));
    return modules.get(url.href);
  }
  const entry = await load(new URL('app-bootstrap.js', root));
  await entry.link((specifier, importer) => load(new URL(specifier, importer.identifier)));
  await entry.evaluate();
  if (platform.error) throw platform.error;
  return { w, platform, state: (await modules.get(new URL('app/src/state.js', root).href)).namespace,
    module: async path => (await modules.get(new URL(`app/src/${path}`, root).href)).namespace };
}

test('original app loads all settings, creates notes, and keeps original Escape navigation', async t => {
  const { w, state } = await app(t);
  const doc = w.document;
  assert.equal(state.notes.length, publishedNoteCount);
  assert.equal(state.activeNoteId, null);
  doc.getElementById('global-settings-button').click();
  assert.equal(doc.getElementById('settings-view').style.display, 'block');
  assert.ok(doc.querySelectorAll('#settings-view input, #settings-view select').length > 10);
  doc.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  await waitFor(() => doc.getElementById('list-view').style.display === 'block');
  doc.getElementById('new-note-button').click();
  await waitFor(() => state.activeNoteId);
  assert.equal(state.notes.length, publishedNoteCount + 1);
  const title = doc.getElementById('editor-title');
  title.dispatchEvent(new w.MouseEvent('dblclick', { bubbles: true }));
  title.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  assert.ok(state.activeNoteId);
  doc.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  await waitFor(() => !state.activeNoteId);
});

test('original editor edits synchronize in both directions; reload resets all data/settings', async t => {
  const left = await app(t);
  const doc = left.w.document;
  doc.querySelector('#note-list li').click();
  await waitFor(() => left.platform.latest?.note);
  const right = await app(t, left.platform, true);
  await waitFor(() => right.state.activeNoteId);
  const leftEditor = doc.getElementById('markdown-editor');
  const rightEditor = right.w.document.getElementById('markdown-editor');
  leftEditor.value = 'Edited on left';
  leftEditor.dispatchEvent(new left.w.Event('input', { bubbles: true }));
  await waitFor(() => rightEditor.value === 'Edited on left');
  rightEditor.value = 'Edited on right';
  rightEditor.dispatchEvent(new right.w.Event('input', { bubbles: true }));
  await waitFor(() => leftEditor.value === 'Edited on right');
  await left.w.browser.storage.local.set({ globalSettings: { mode: 'dark' } });
  const fresh = await app(t);
  assert.equal(fresh.state.notes.length, publishedNoteCount);
  assert.equal(fresh.state.activeNoteId, null);
  assert.deepEqual(fresh.platform.storage, {});
  assert.notEqual(fresh.platform.indexedDB, left.platform.indexedDB);
});

test('source modules and styles are copied without site-specific overrides', async () => {
  const appHtml = await read('app/sidepanel.html');
  assert.match(appHtml, /\.\.\/web-platform.js/);
  assert.match(appHtml, /\.\.\/app-bootstrap.js/);
  assert.match(appHtml, /src="vendor\/wysiwyg-markdown.js"/);
  assert.match(await read('app/src/events/global-events.js'), /Escape/);
  assert.match(await read('style.css'), /orientation: portrait/);
  assert.match(await read('index.html'), /id="expanded"[^>]+hidden/);
  assert.ok((await readdir(new URL('app/src/events/', root))).includes('settings-events.js'));
});

test('original pin, recycle, settings persistence and archive export operate on demo storage', async t => {
  const runtime = await app(t);
  const { w, state } = runtime;
  const doc = w.document;
  doc.querySelector('[data-note-id="publishing"] .pin-note-icon').click();
  await waitFor(() => doc.querySelector('[data-note-id="publishing"]').dataset.pinned === 'true');
  doc.querySelector('[data-note-id="welcome"] .delete-note-icon').click();
  await waitFor(() => state.deletedNotes.length === 1 && !doc.querySelector('[data-note-id="welcome"]'));
  assert.equal(state.notes.length, publishedNoteCount - 1);
  doc.getElementById('global-settings-button').click();
  const mode = doc.getElementById('mode-setting');
  mode.value = 'dark';
  mode.dispatchEvent(new w.Event('change', { bubbles: true }));
  await waitFor(() => runtime.platform.storage.globalSettings?.mode === 'dark');
  assert.ok(doc.body.classList.contains('dark-mode'));
  const renderer = await runtime.module('notes_view/note-renderer.js');
  await renderer.openNote('publishing');
  const exports = await runtime.module('import_export.js');
  const zip = await exports.createSingleNoteArchive(state.getLoadedNote());
  assert.ok(zip.file('images/example.png'));
  assert.match(await zip.file('note.md').async('string'), /Attached image/);
  assert.equal(JSON.parse(await zip.file('metadata.json').async('string')).title, state.getLoadedNote().title);
});
