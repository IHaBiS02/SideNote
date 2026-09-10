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

async function reader(t, { hash = '#welcome', archive, fetchOverride } = {}) {
  const dom = new JSDOM(await read('index.html'), { url: `https://example.org/SideNote/${hash}`, runScripts: 'outside-only', pretendToBeVisual: true });
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
  w.document.execCommand = () => false;
  w.Range.prototype.getClientRects = () => [];
  w.Range.prototype.getBoundingClientRect = () => ({ left: 0, right: 0, top: 0, bottom: 0 });
  w.eval((await read('vendor/highlight.min.js')).toString());
  const stripExports = text => text.replace(/export\s*\{[^}]+\};/g, '');
  w.eval((await read('vendor/constants.js')).toString().replaceAll('export ', '') + '\n' + stripExports((await read('vendor/pinned-note-drag.js')).toString().replace(/^import .*;$/gm, '')) + '\nwindow.createPinnedNoteDragController = createPinnedNoteDragController;');
  w.eval('(() => {' + stripExports((await read('vendor/wysiwyg-markdown.js')).toString()) + '\n})()');
  w.eval(stripExports((await read('vendor/note-content-styles.js')).toString()) + '\nwindow.createNoteContentStyles = createNoteContentStyles;');
  w.eval(stripExports((await read('vendor/sidenote-editor-theme.js')).toString().replace(/^import .*;$/gm, '')) + '\nwindow.SIDENOTE_EDITOR_THEME = SIDENOTE_EDITOR_THEME; window.highlightCode = highlightCode;');
  w.eval((await read('editor-session.js')).toString().replace(/^import .*;$/gm, '').replace('export function', 'function') + '\nwindow.mountEditor = mountEditor;');
  w.fetch = async path => {
    if (fetchOverride) {
      const override = await fetchOverride(path);
      if (override) return override;
    }
    const bytes = archive && path.endsWith('.snote') ? archive : await read(path);
    return { ok: true, json: async () => JSON.parse(bytes), arrayBuffer: async () => bytes };
  };
  w.eval((await read('script.js')).toString().replace(/^import .*;$/gm, ''));
  return { w, created, revoked, copied };
}

test('opens .snote with images, settings, highlighting, copy and theme; frees images on navigation', async t => {
  const { w, created, revoked, copied } = await reader(t, { hash: '#publishing' });
  const doc = w.document;
  await waitFor(() => doc.querySelector('#status').hidden);
  assert.equal(doc.querySelectorAll('.note-link').length, 2);
  assert.equal(doc.querySelector('[aria-current]').dataset.id, 'publishing');
  assert.equal(doc.querySelectorAll('.pin-note-icon').length, 2);
  assert.equal(doc.querySelectorAll('.delete-note-icon').length, 2);
  doc.querySelector('#global-settings-button').click();
  assert.equal(doc.querySelector('#site-settings').hidden, false);
  doc.querySelector('#close-settings').click();
  assert.equal(doc.querySelector('#site-settings').hidden, true);
  assert.equal(doc.querySelector('#note-title').textContent, 'Publish your own notes');
  await waitFor(() => doc.querySelector('#markdown-editor').shadowRoot?.querySelector('img')?.getAttribute('src') === 'blob:note-1');
  assert.ok(created[0].size > 0);
  assert.ok(doc.querySelector('#markdown-editor').shadowRoot.querySelector('.hljs-attr'));
  assert.equal(doc.querySelector('#markdown-editor').style.getPropertyValue('--editor-code-line-height'), '1.2');
  doc.querySelector('#markdown-editor').shadowRoot.querySelector('.copy-code-button').click();
  await waitFor(() => copied.length === 1);
  assert.match(copied[0], /my-note/);
  const theme = doc.querySelector('#theme');
  theme.value = 'dark'; theme.dispatchEvent(new w.Event('change'));
  assert.equal(doc.documentElement.dataset.theme, 'dark');
  assert.equal(w.localStorage.getItem('sidenote-site-theme'), 'dark');
  w.location.hash = '#welcome';
  await waitFor(() => doc.querySelector('#note-title').textContent === 'Welcome to SideNote' && doc.querySelector('#status').hidden);
  assert.ok(revoked.includes('blob:note-1'));
});

test('sanitizes archive HTML and reports malformed archives and unknown routes', async t => {
  const zip = new JSZip();
  zip.file('metadata.json', JSON.stringify({ title: 'Unsafe input' }));
  zip.file('note.md', '<script>window.pwned=true</script><img src="x" onerror="window.pwned=true"><a href="javascript:alert(1)">bad</a>');
  const { w } = await reader(t, { archive: await zip.generateAsync({ type: 'nodebuffer' }) });
  await waitFor(() => w.document.querySelector('#status').hidden);
  assert.equal(w.pwned, undefined);
  assert.equal(w.document.querySelector('#markdown-editor').shadowRoot.querySelector('script, [onerror], a[href^="javascript:"]'), null);
  w.location.hash = '#unknown';
  await waitFor(() => w.document.querySelector('#list-status').textContent.includes('Note not found'));
  assert.equal(w.document.querySelector('#download').hidden, true);
  const broken = new JSZip(); broken.file('note.md', 'No metadata');
  const other = await reader(t, { archive: await broken.generateAsync({ type: 'nodebuffer' }) });
  await waitFor(() => other.w.document.querySelector('#status').textContent.includes('missing'));
});

test('real editor supports WYSIWYG, double-click source editing, session drafts and fresh-load reset', async t => {
  const { w } = await reader(t);
  const doc = w.document;
  await waitFor(() => doc.querySelector('#status').hidden);
  const editor = doc.querySelector('#markdown-editor');
  await editor.updateComplete;
  assert.equal(editor.mode, 'wysiwyg');
  assert.equal(editor.insertText('Visitor edit '), true);
  assert.match(editor.value, /Visitor edit/);
  editor.shadowRoot.querySelector('#editor-mount').dispatchEvent(new w.MouseEvent('dblclick', { bubbles: true }));
  await editor.updateComplete;
  assert.equal(editor.mode, 'source');
  const textarea = editor.shadowRoot.querySelector('#document-source');
  textarea.value = '# Changed in plain text\n\nHello';
  textarea.dispatchEvent(new w.Event('input', { bubbles: true }));
  doc.querySelector('#toggle-view-button').click();
  await editor.updateComplete;
  assert.equal(editor.mode, 'wysiwyg');
  assert.match(editor.value, /Changed in plain text/);
  assert.equal(editor.shadowRoot.querySelector('.ProseMirror h1').textContent, 'Changed in plain text');
  const pasted = await editor.uploadImage(new w.Blob(['image'], { type: 'image/png' }));
  editor.insertMarkdown(`\n\n![Pasted](${pasted})`);
  w.location.hash = '#publishing';
  await waitFor(() => doc.querySelector('#status').hidden && doc.querySelector('#note-title').textContent === 'Publish your own notes');
  w.location.hash = '#welcome';
  await waitFor(() => doc.querySelector('#status').hidden && doc.querySelector('#note-title').textContent === 'Welcome to SideNote');
  const returned = doc.querySelector('#markdown-editor');
  await returned.updateComplete;
  assert.match(returned.value, /Changed in plain text/);
  assert.ok(await returned.imageResolver(pasted));
  assert.equal(w.localStorage.length, 0);
  const fresh = await reader(t);
  await waitFor(() => fresh.w.document.querySelector('#status').hidden);
  assert.doesNotMatch(fresh.w.document.querySelector('#markdown-editor').value, /Changed in plain text/);
});

test('pins sort first, toggles preserve the reader, and a fresh load restores publisher defaults', async t => {
  // Put the pinned entry last to verify actual sorting rather than fixture order.
  const manifest = JSON.parse(await read('notes/index.json')).reverse();
  const options = { fetchOverride: async path => path === 'notes/index.json'
    ? { ok: true, json: async () => structuredClone(manifest) } : undefined };
  const { w } = await reader(t, options);
  const doc = w.document;
  await waitFor(() => doc.querySelector('#status').hidden);
  const order = () => [...doc.querySelectorAll('.note-link')].map(link => link.dataset.id);
  const pin = id => doc.querySelector(`li[data-note-id="${id}"] .pin-note-icon`);
  assert.deepEqual(order(), ['welcome', 'publishing']);
  const body = doc.querySelector('#content').firstChild;
  pin('publishing').click();
  assert.deepEqual(order(), ['welcome', 'publishing']);
  assert.equal(pin('publishing').getAttribute('aria-pressed'), 'true');
  assert.equal(doc.activeElement, pin('publishing'));
  assert.equal(doc.querySelector('#content').firstChild, body);
  assert.equal(doc.querySelector('[aria-current]').dataset.id, 'welcome');
  pin('welcome').click();
  assert.equal(pin('welcome').getAttribute('aria-pressed'), 'false');
  assert.deepEqual(order(), ['publishing', 'welcome']);
  assert.equal(w.localStorage.length, 0);
  assert.equal(w.sessionStorage.length, 0);
  const fresh = await reader(t, options);
  await waitFor(() => fresh.w.document.querySelector('#status').hidden);
  assert.deepEqual([...fresh.w.document.querySelectorAll('.note-link')].map(link => link.dataset.id), ['welcome', 'publishing']);
  assert.equal(fresh.w.document.querySelector('li[data-note-id="publishing"] .pin-note-icon').getAttribute('aria-pressed'), 'false');
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

test('starts with a blank expanded pane and synchronizes both editors after selection', async t => {
  const { w } = await reader(t, { hash: '' });
  const doc = w.document;
  await waitFor(() => doc.querySelectorAll('.note-link').length === 2);
  assert.equal(doc.querySelector('#expanded-note').hidden, true);
  assert.equal(doc.querySelector('#sidebar-note').hidden, true);
  assert.equal(doc.querySelector('#markdown-editor'), null);
  doc.querySelector('.note-link').click();
  await waitFor(() => doc.querySelector('#markdown-editor') && doc.querySelector('#expanded-editor'));
  const left = doc.querySelector('#markdown-editor');
  const right = doc.querySelector('#expanded-editor');
  await Promise.all([left.updateComplete, right.updateComplete]);
  assert.equal(doc.querySelector('#list-view').hidden, true);
  left.insertText('Left edit ');
  await right.updateComplete;
  assert.equal(left.value, right.value);
  right.insertText('Right edit');
  await left.updateComplete;
  assert.equal(left.value, right.value);
  assert.match(left.value, /Right edit/);
  doc.querySelector('#back-to-list').click();
  await waitFor(() => !doc.querySelector('#list-view').hidden);
  assert.equal(doc.querySelector('#expanded-note').hidden, true);
});

test('uses the source long-press controller to reorder pinned rows without opening them', async t => {
  const { w } = await reader(t, { hash: '' });
  const doc = w.document;
  await waitFor(() => doc.querySelectorAll('.note-link').length === 2);
  doc.querySelector('li[data-note-id="publishing"] .pin-note-icon').click();
  const rows = [...doc.querySelectorAll('#note-list > li')];
  rows.forEach((row, index) => { row.getBoundingClientRect = () => ({ top: index * 50, bottom: index * 50 + 50, left: 0, right: 360, width: 360, height: 50 }); });
  function pointer(target, type, y) {
    const event = new w.MouseEvent(type, { bubbles: true, cancelable: true, clientX: 20, clientY: y, buttons: type === 'pointerup' ? 0 : 1 });
    Object.defineProperties(event, { pointerId: { value: 1 }, isPrimary: { value: true } });
    target.dispatchEvent(event);
  }
  pointer(rows[1], 'pointerdown', 70);
  await waitFor(() => rows[1].classList.contains('pinned-note-dragging'));
  pointer(w, 'pointermove', 0);
  pointer(w, 'pointerup', 0);
  assert.deepEqual([...doc.querySelectorAll('.note-link')].map(link => link.dataset.id), ['publishing', 'welcome']);
  assert.equal(doc.querySelector('#expanded-note').hidden, true);
  assert.equal(w.localStorage.length, 0);
});
