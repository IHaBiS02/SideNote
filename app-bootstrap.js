import { bootstrap } from './app/src/main.js';
import * as state from './app/src/state.js';
import { initDB, closeDB } from './app/src/database/index.js';
import { parseSnote, saveParsedSnote } from './app/src/import_export.js';
import { ensureJsZipLoaded } from './app/src/vendor-loader.js';
import { openNote, renderNoteList } from './app/src/notes_view/note-renderer.js';
import { showListView } from './app/src/notes_view/view-manager.js';
import { applyMode, normalizeGlobalSettings } from './app/src/settings.js';
const platform = parent.sideNoteWeb;
const role = location.search.includes('expanded') ? 'expanded' : 'sidebar';
const editor = document.getElementById('markdown-editor');
let receiving = false;
let fingerprint = '';
let timer;
let receiveQueue = Promise.resolve();
async function seed() {
  await initDB();
  await ensureJsZipLoaded();
  const response = await fetch('../notes/index.json');
  if (!response.ok) throw new Error('Missing published note manifest');
  const entries = await response.json();
  const publishedAt = Date.now();
  for (const [index, entry] of entries.entries()) {
    if (!/^notes\/[a-zA-Z0-9_-]+\.snote$/.test(entry.file)) throw new Error('Invalid note path');
    const archive = await fetch(`../${entry.file}`);
    if (!archive.ok) throw new Error(`Missing ${entry.file}`);
    const parsed = await parseSnote(await JSZip.loadAsync(await archive.arrayBuffer()));
    await saveParsedSnote(parsed, { id: entry.id, isPinned: Boolean(entry.pinned), pinOrder: index, metadata: { lastModified: publishedAt - index } });
  }
  closeDB();
}
function snapshot() {
  return { note: state.getLoadedNote(), notes: state.notes, deletedNotes: state.deletedNotes, globalSettings: state.globalSettings };
}
function publish() {
  if (receiving) return;
  const value = snapshot();
  const next = JSON.stringify(value);
  if (next === fingerprint) return;
  fingerprint = next;
  platform.publish(role, structuredClone(value));
}
async function receive(value) {
  receiving = true;
  try {
    const previous = state.getLoadedNote();
    const settingsChanged = JSON.stringify(state.globalSettings) !== JSON.stringify(value.globalSettings) || JSON.stringify(previous?.settings) !== JSON.stringify(value.note?.settings);
    state.setNotes(structuredClone(value.notes));
    state.setDeletedNotes(structuredClone(value.deletedNotes));
    state.setGlobalSettings(structuredClone(value.globalSettings));
    applyMode(normalizeGlobalSettings(value.globalSettings).mode);
    if (!value.note) {
      if (state.activeNoteId) showListView();
      else renderNoteList();
    } else if (state.activeNoteId !== value.note.id || settingsChanged) {
      await openNote(value.note.id, false, true);
    } else {
      if (editor.value !== value.note.content) editor.value = value.note.content;
      document.getElementById('editor-title').textContent = value.note.title;
    }
    fingerprint = JSON.stringify(snapshot());
  } finally { receiving = false; }
}
try {
  if (!platform.ready) platform.ready = seed();
  await platform.ready;
  await bootstrap();
  platform.register(role, value => {
    receiveQueue = receiveQueue.then(() => receive(value)).catch(error => platform.fail(error));
  });
  const schedule = () => { clearTimeout(timer); timer = setTimeout(publish, 30); };
  for (const event of ['input', 'change', 'click', 'keydown', 'pointerup']) document.addEventListener(event, schedule, true);
  const observer = new MutationObserver(schedule);
  for (const element of document.querySelectorAll('body > div[id$="-view"]')) observer.observe(element, { attributes: true, attributeFilter: ['style'] });
  for (const element of document.querySelectorAll('#note-list, #deleted-notes-list')) observer.observe(element, { childList: true, subtree: true });
  if (role === 'sidebar') publish();
} catch (error) { platform.fail(error); }
