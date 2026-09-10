import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { JSDOM } from 'jsdom';
const require = createRequire(import.meta.url);
const JSZip = require('../vendor/jszip.min.js');
const read = path => readFile(new URL(`../${path}`, import.meta.url));

async function waitFor(predicate) {
  for (let i = 0; i < 200; i++) {
    if (predicate()) return;
    await new Promise(resolve => setTimeout(resolve, 5));
  }
  throw new Error('Reader did not reach the expected state');
}

async function reader(t, { hash = '', archive, fetchOverride } = {}) {
  const dom = new JSDOM(await read('index.html'), { url: `https://example.org/SideNote/${hash}`, runScripts: 'outside-only' });
  t.after(() => dom.window.close());
  const w = dom.window;
  const revoked = [];
  const created = [];
  const copied = [];
  w.matchMedia = () => ({ matches: false, addEventListener() {} });
  w.URL.createObjectURL = blob => { created.push(blob); return `blob:note-${created.length}`; };
  w.URL.revokeObjectURL = url => revoked.push(url);
  Object.defineProperty(w.navigator, 'clipboard', { value: { writeText: async text => copied.push(text) } });
  w.JSZip = JSZip;
  for (const vendor of ['purify', 'marked', 'highlight']) w.eval((await read(`vendor/${vendor}.min.js`)).toString());
  w.fetch = async path => {
    if (fetchOverride) {
      const override = await fetchOverride(path);
      if (override) return override;
    }
    const bytes = archive && path.endsWith('.snote') ? archive : await read(path);
    return { ok: true, json: async () => JSON.parse(bytes), arrayBuffer: async () => bytes };
  };
  w.eval((await read('script.js')).toString());
  return { w, created, revoked, copied };
}

test('opens .snote with images, settings, highlighting, copy and theme; frees images on navigation', async t => {
  const { w, created, revoked, copied } = await reader(t, { hash: '#publishing' });
  const doc = w.document;
  await waitFor(() => doc.querySelector('#status').hidden);
  assert.equal(doc.querySelectorAll('.note-link').length, 2);
  assert.equal(doc.querySelector('[aria-current]').dataset.id, 'publishing');
  assert.equal(doc.querySelector('#note-title').textContent, 'Publish your own notes');
  assert.equal(doc.querySelector('#content img').getAttribute('src'), 'blob:note-1');
  assert.ok(created[0].size > 0);
  assert.ok(doc.querySelector('code .hljs-attr'));
  assert.equal(doc.querySelector('#content').style.getPropertyValue('--note-code-line-height'), '1.2');
  doc.querySelector('.code-header button').click();
  await waitFor(() => copied.length === 1);
  assert.match(copied[0], /my-note/);
  const theme = doc.querySelector('#theme');
  theme.value = 'dark'; theme.dispatchEvent(new w.Event('change'));
  assert.equal(doc.documentElement.dataset.theme, 'dark');
  assert.equal(w.localStorage.getItem('sidenote-site-theme'), 'dark');
  w.location.hash = '#welcome';
  await waitFor(() => doc.querySelector('#note-title').textContent === 'Welcome to SideNote' && doc.querySelector('#status').hidden);
  assert.deepEqual(revoked, ['blob:note-1']);
});

test('sanitizes archive HTML and reports malformed archives and unknown routes', async t => {
  const zip = new JSZip();
  zip.file('metadata.json', JSON.stringify({ title: 'Unsafe input' }));
  zip.file('note.md', '<script>window.pwned=true</script><img src="x" onerror="window.pwned=true"><a href="javascript:alert(1)">bad</a>');
  const { w } = await reader(t, { archive: await zip.generateAsync({ type: 'nodebuffer' }) });
  await waitFor(() => w.document.querySelector('#status').hidden);
  assert.equal(w.pwned, undefined);
  assert.equal(w.document.querySelector('#content script, #content [onerror], #content a[href]'), null);
  w.location.hash = '#unknown';
  await waitFor(() => w.document.querySelector('#note-title').textContent === 'Note not found');
  assert.equal(w.document.querySelector('#download').hidden, true);
  const broken = new JSZip(); broken.file('note.md', 'No metadata');
  const other = await reader(t, { archive: await broken.generateAsync({ type: 'nodebuffer' }) });
  await waitFor(() => other.w.document.querySelector('#status').textContent.includes('missing'));
});

test('a late response cannot replace a more recently selected note', async t => {
  let release;
  const delayed = new Promise(resolve => { release = resolve; });
  const { w } = await reader(t, { fetchOverride: path => path === 'notes/welcome.snote' ? delayed : undefined });
  await waitFor(() => w.document.querySelectorAll('.note-link').length === 2);
  w.location.hash = '#publishing';
  await waitFor(() => w.document.querySelector('#status').hidden);
  const bytes = await read('notes/welcome.snote');
  release({ ok: true, arrayBuffer: async () => bytes });
  await new Promise(resolve => setTimeout(resolve, 50));
  assert.equal(w.document.querySelector('#note-title').textContent, 'Publish your own notes');
});
