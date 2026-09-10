const list = document.querySelector('#note-list');
const content = document.querySelector('#content');
const title = document.querySelector('#note-title');
const status = document.querySelector('#status');
const download = document.querySelector('#download');
const theme = document.querySelector('#theme');
const systemTheme = matchMedia('(prefers-color-scheme: dark)');
let notes = [];
let revision = 0;
let imageUrls = [];

// Stable sorting keeps manifest order within each group; pins are memory-only.
function orderedNotes() {
  return [...notes].sort((a, b) => Number(b.pinned === true) - Number(a.pinned === true));
}

function sortNoteList() {
  const rows = new Map([...list.children].map(row => [row.dataset.noteId, row]));
  for (const note of orderedNotes()) list.append(rows.get(note.id));
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

function clearImages() {
  imageUrls.forEach(url => URL.revokeObjectURL(url));
  imageUrls = [];
}

function setNumber(name, value, fallback, min, max) {
  const number = typeof value === 'number' && Number.isFinite(value) ? value : fallback;
  content.style.setProperty(name, String(Math.min(max, Math.max(min, number))));
}

async function openNote() {
  const current = ++revision;
  clearImages();
  content.replaceChildren();
  download.hidden = true;
  status.hidden = false;
  let id;
  try { id = decodeURIComponent(location.hash.slice(1)); } catch { id = null; }
  const note = id === '' ? orderedNotes()[0] : notes.find(entry => entry.id === id);
  for (const link of list.querySelectorAll('a')) {
    if (link.dataset.id === note?.id) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }
  if (!note) {
    title.textContent = 'Note not found';
    document.title = 'Note not found · SideNote';
    status.textContent = 'Choose a note from the list.';
    return;
  }
  title.textContent = note.title;
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
    const fragment = DOMPurify.sanitize(marked.parse(markdown, { gfm: true, breaks: true }), {
      RETURN_DOM_FRAGMENT: true, USE_PROFILES: { html: true },
      FORBID_TAGS: ['style', 'form', 'iframe'], FORBID_ATTR: ['style', 'srcset'],
    });
    // Archive images remain local; no database or extension API is needed.
    const pendingUrls = [];
    try {
      for (const image of fragment.querySelectorAll('img')) {
        const source = image.getAttribute('src') || '';
        if (source.startsWith('images/')) {
          const entry = zip.file(source);
          if (!entry) { image.removeAttribute('src'); image.alt += ' (missing image)'; continue; }
          const bytes = await entry.async('uint8array');
          const url = URL.createObjectURL(new Blob([bytes], { type: 'image/png' }));
          pendingUrls.push(url);
          image.src = url;
        } else if (!/^https?:\/\//i.test(source)) image.removeAttribute('src');
        image.loading = 'lazy';
        image.referrerPolicy = 'no-referrer';
      }
      if (current !== revision) { pendingUrls.forEach(url => URL.revokeObjectURL(url)); return; }
      imageUrls = pendingUrls;
    } catch (error) { pendingUrls.forEach(url => URL.revokeObjectURL(url)); throw error; }
    title.textContent = typeof metadata.title === 'string' && metadata.title ? metadata.title : note.title;
    document.title = `${title.textContent} · SideNote`;
    const settings = metadata.settings || {};
    setNumber('--note-line-height', settings.lineHeight, 1.5, 1, 3);
    setNumber('--note-code-line-height', settings.codeLineHeight, 1.2, 1, 3);
    const size = Number.isFinite(settings.fontSize) ? settings.fontSize : 14;
    content.style.setProperty('--note-font-size', `${Math.min(48, Math.max(10, size))}px`);
    for (const link of fragment.querySelectorAll('a[href]')) {
      link.rel = 'noopener noreferrer';
      if (/^https?:\/\//i.test(link.getAttribute('href'))) link.target = '_blank';
    }
    for (const code of fragment.querySelectorAll('pre > code')) {
      const language = [...code.classList].find(name => name.startsWith('language-'))?.slice(9) || 'text';
      const raw = code.textContent;
      if (hljs.getLanguage(language)) code.innerHTML = hljs.highlight(raw, { language }).value;
      if (settings.codeBlockHeader === false) continue;
      const header = document.createElement('div');
      header.className = 'code-header';
      const label = document.createElement('span');
      label.textContent = language;
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = 'Copy';
      button.setAttribute('aria-label', 'Copy code');
      button.addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(raw); button.textContent = '✓ Copied'; }
        catch { button.textContent = 'Copy failed'; }
        setTimeout(() => { button.textContent = 'Copy'; }, 1200);
      });
      header.append(label, button);
      code.before(header);
    }
    content.replaceChildren(fragment);
    document.querySelector('#reader').scrollTop = 0;
    status.hidden = true;
    download.href = note.file;
    download.download = note.file.split('/').pop();
    download.hidden = false;
  } catch (error) {
    if (current !== revision) return;
    clearImages();
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
  } catch (error) { status.textContent = error.message; }
}
start();
