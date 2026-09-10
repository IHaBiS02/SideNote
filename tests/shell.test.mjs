import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';

test('empty pane follows initial system theme, explicit settings and live system changes', async t => {
  const dom = new JSDOM('<iframe id="sidebar"></iframe><iframe id="expanded" hidden></iframe>', {
    url: 'https://example.org/SideNote/', runScripts: 'outside-only',
  });
  t.after(() => dom.window.close());
  const w = dom.window;
  let change;
  const media = { matches: true, addEventListener(type, listener) { assert.equal(type, 'change'); change = listener; } };
  w.matchMedia = () => media;
  w.SideNoteMemoryDB = { IDBFactory: class {}, IDBKeyRange: class {} };
  w.eval(await readFile(new URL('../script.js', import.meta.url), 'utf8'));
  const theme = () => w.document.documentElement.dataset.theme;
  const setMode = mode => w.sideNoteWeb.publish('sidebar', { note: null, globalSettings: { mode } });
  assert.equal(theme(), 'dark');
  assert.equal(w.document.getElementById('expanded').hidden, true);
  setMode('light');
  assert.equal(theme(), 'light');
  change();
  assert.equal(theme(), 'light');
  setMode('dark');
  media.matches = false;
  change();
  assert.equal(theme(), 'dark');
  setMode('system');
  assert.equal(theme(), 'light');
  media.matches = true;
  change();
  assert.equal(theme(), 'dark');
  assert.equal(w.document.getElementById('expanded').hidden, true);
});
