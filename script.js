import { mountEditor } from './editor-session.js';
import { createPinnedNoteDragController } from './vendor/pinned-note-drag.js';
const list = document.querySelector('#note-list');
const content = document.querySelector('#content');
const title = document.querySelector('#note-title');
const status = document.querySelector('#status');
const download = document.querySelector('#download');
const theme = document.querySelector('#theme');
const systemTheme = matchMedia('(prefers-color-scheme: dark)');
let notes = [];
let revision = 0;
let disposeEditor = null;
const drafts = new Map();
let pinOrder = [];
let dragController;
const sidebarNote = document.querySelector('#sidebar-note');
const expandedNote = document.querySelector('#expanded-note');
const listView = document.querySelector('#list-view');
let settingsReturnToNote = false;
document.querySelector('#note-settings').onclick = () => {
  settingsReturnToNote = true;
  listView.hidden = false;
  sidebarNote.hidden = true;
  document.querySelector('#global-settings-button').click();
};
document.querySelector('#back-to-list').onclick = () => { location.hash = ''; };
document.querySelector('#sidebar-download').onclick = () => { if (!download.hidden) download.click(); };

// Stable sorting keeps manifest order within each group; pins are memory-only.
function orderedNotes() {
  return [...notes].sort((a, b) => Number(b.pinned === true) - Number(a.pinned === true)
    || (a.pinned && b.pinned ? pinOrder.indexOf(a.id) - pinOrder.indexOf(b.id) : 0));
}

function sortNoteList() {
  dragController?.destroy();
  const rows = new Map([...list.children].map(row => [row.dataset.noteId, row]));
  for (const note of orderedNotes()) list.append(rows.get(note.id));
  dragController = createPinnedNoteDragController(list, ids => { pinOrder = ids; }, { longPressDelayMs: 150 });
}

function updatePin(button, note) {
  button.textContent = note.pinned ? '📌' : '📎';
  button.title = note.pinned ? 'Unpin Note' : 'Pin Note';
  button.setAttribute('aria-label', `${button.title}: ${note.title}`);
  button.setAttribute('aria-pressed', String(note.pinned));
}

function applyTheme() {
  document.documentElement.dataset.theme = theme.value === 'system'
    ? (systemTheme.matches ? 'dark' : 'light') : theme.value;
  document.body.classList.toggle('dark-mode', document.documentElement.dataset.theme === 'dark');
}
const settingsPanel = document.querySelector('#site-settings');
document.querySelector('#global-settings-button').addEventListener('click', () => {
  settingsPanel.hidden = false;
  theme.focus();
});
document.querySelector('#close-settings').addEventListener('click', () => {
  settingsPanel.hidden = true;
  if (settingsReturnToNote) {
    settingsReturnToNote = false;
    listView.hidden = true;
    sidebarNote.hidden = false;
    document.querySelector('#note-settings').focus();
    return;
  }
  document.querySelector('#global-settings-button').focus();
});
document.querySelector('#save-note').addEventListener('click', () => {
  if (!download.hidden) download.click();
});
try {
  const saved = localStorage.getItem('sidenote-site-theme');
  if (['system', 'light', 'dark'].includes(saved)) theme.value = saved;
} catch { /* Storage may be unavailable in private browsing. */ }
theme.addEventListener('change', () => {
  applyTheme();
  try { localStorage.setItem('sidenote-site-theme', theme.value); } catch { /* Optional preference. */ }
});
systemTheme.addEventListener('change', applyTheme);
applyTheme();

async function openNote() {
  settingsReturnToNote = false;
  settingsPanel.hidden = true;
  const current = ++revision;
  disposeEditor?.();
  disposeEditor = null;
  content.replaceChildren();
  download.hidden = true;
  status.hidden = false;
  let id;
  try { id = decodeURIComponent(location.hash.slice(1)); } catch { id = null; }
  const note = notes.find(entry => entry.id === id);
  sidebarNote.hidden = !note;
  expandedNote.hidden = !note;
  listView.hidden = Boolean(note);
  document.querySelector('#list-status').textContent = '';
  for (const link of list.querySelectorAll('a')) {
    if (link.dataset.id === note?.id) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }
  if (!note) {
    document.title = 'SideNote · Notes';
    status.hidden = true;
    if (id) document.querySelector('#list-status').textContent = 'Note not found. Choose a note from the list.';
    return;
  }
  title.textContent = note.title;
  document.querySelector('#expanded-title').textContent = note.title;
  document.title = `${note.title} · SideNote`;
  status.textContent = 'Opening note…';
  try {
    const response = await fetch(note.file);
    if (!response.ok) throw new Error(`Could not load this note (${response.status}).`);
    const zip = await JSZip.loadAsync(await response.arrayBuffer());
    if (current !== revision) return;
    if (!zip.file('metadata.json') || !zip.file('note.md')) throw new Error('Invalid .snote: metadata.json or note.md is missing.');
    const [metadataText, markdown] = await Promise.all([
      zip.file('metadata.json').async('string'), zip.file('note.md').async('string'),
    ]);
    const metadata = JSON.parse(metadataText);
    if (!metadata || typeof metadata !== 'object') throw new Error('Invalid note metadata.');
    if (current !== revision) return;
    title.textContent = typeof metadata.title === 'string' && metadata.title ? metadata.title : note.title;
    document.title = `${title.textContent} · SideNote`;
    if (!drafts.has(note.id)) drafts.set(note.id, { markdown, images: new Map() });
    document.querySelector('#expanded-title').textContent = title.textContent;
    const draft = drafts.get(note.id);
    let syncing = false;
    const syncTo = (selector, value) => {
      const target = document.querySelector(selector);
      if (syncing || !target || target.value === value) return;
      syncing = true;
      try { target.value = value; } finally { syncing = false; }
    };
    const left = mountEditor(content, zip, metadata.settings || {}, draft, {
      onInput: value => syncTo('#expanded-editor', value),
    });
    const right = mountEditor(document.querySelector('#expanded-content'), zip, metadata.settings || {}, draft, {
      id: 'expanded-editor', toggle: '#expanded-toggle', onInput: value => syncTo('#markdown-editor', value),
    });
    disposeEditor = () => { left(); right(); };
    document.querySelector('#reader').scrollTop = 0;
    status.hidden = true;
    download.href = note.file;
    download.download = note.file.split('/').pop();
    download.hidden = false;
  } catch (error) {
    if (current !== revision) return;
    disposeEditor?.();
    disposeEditor = null;
    status.textContent = error instanceof Error ? error.message : 'Could not open this note.';
  }
}

async function start() {
  try {
    const response = await fetch('notes/index.json');
    if (!response.ok) throw new Error('Could not load the note list.');
    notes = await response.json();
    const ids = new Set();
    if (!Array.isArray(notes) || !notes.every(note => {
      if (!note || typeof note.id !== 'string' || !/^[a-z0-9-]+$/.test(note.id) || ids.has(note.id)
        || typeof note.title !== 'string' || typeof note.file !== 'string'
        || !/^notes\/[a-zA-Z0-9_-]+\.snote$/.test(note.file)) return false;
      ids.add(note.id); return true;
    })) throw new Error('Invalid note list.');
    for (const note of notes) {
      note.pinned = note.pinned === true;
      const item = document.createElement('li');
      item.dataset.noteId = note.id;
      item.dataset.pinned = String(note.pinned);
      if (note.pinned) pinOrder.push(note.id);
      const link = document.createElement('a');
      link.className = 'note-link';
      link.href = `#${encodeURIComponent(note.id)}`;
      link.dataset.id = note.id;
      link.textContent = note.title;
      const actions = document.createElement('div');
      actions.className = 'button-container';
      const pin = document.createElement('button');
      pin.type = 'button';
      pin.className = 'pin-note-icon';
      updatePin(pin, note);
      pin.addEventListener('click', () => {
        note.pinned = !note.pinned;
        item.dataset.pinned = String(note.pinned);
        pinOrder = pinOrder.filter(id => id !== note.id);
        if (note.pinned) pinOrder.push(note.id);
        updatePin(pin, note);
        sortNoteList();
        pin.focus({ preventScroll: true });
      });
      const remove = document.createElement('span');
      remove.className = 'delete-note-icon';
      remove.textContent = '🗑️';
      remove.title = 'Published notes are managed in the repository';
      remove.setAttribute('aria-disabled', 'true');
      actions.append(pin, remove);
      item.append(link, actions); list.append(item);
    }
    sortNoteList();
    window.addEventListener('hashchange', openNote);
    await openNote();
  } catch (error) { document.querySelector('#list-status').textContent = error.message; }
}
start();
