// The shell owns only the temporary platform and second viewport, not app UI.
const peers = new Map();
const expanded = document.getElementById('expanded');
let latest;
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
function updateShellTheme() {
  const mode = latest?.globalSettings?.mode || 'system';
  document.documentElement.dataset.theme = mode === 'dark'
    || (mode === 'system' && systemTheme.matches) ? 'dark' : 'light';
}
systemTheme.addEventListener('change', updateShellTheme);
updateShellTheme();
window.sideNoteWeb = {
  indexedDB: new SideNoteMemoryDB.IDBFactory(),
  IDBKeyRange: SideNoteMemoryDB.IDBKeyRange,
  storage: {}, ready: null,
  register(role, receive) {
    peers.set(role, receive);
    if (role === 'expanded' && latest) receive(latest);
  },
  publish(role, snapshot) {
    latest = snapshot;
    updateShellTheme();
    expanded.hidden = !snapshot.note;
    if (snapshot.note && !expanded.getAttribute('src')) expanded.src = 'app/sidepanel.html?expanded';
    for (const [target, receive] of peers) if (target !== role) receive(snapshot);
  },
  fail(error) {
    const output = document.getElementById('error');
    output.textContent = `Could not load SideNote: ${error.message}`;
    output.hidden = false;
    console.error(error);
  },
};
document.getElementById('sidebar').src = 'app/sidepanel.html';
