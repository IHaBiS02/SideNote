// Loaded before the original app. No extension business logic is replaced.
(() => {
  const platform = parent.sideNoteWeb;
  if (!platform) throw new Error('Open SideNote through the website index.');
  Object.defineProperty(window, 'indexedDB', { value: platform.indexedDB });
  window.IDBKeyRange = platform.IDBKeyRange;
  window.browser = { storage: { local: {
    async get(keys) {
      const names = keys == null ? Object.keys(platform.storage) : typeof keys === 'string' ? [keys] : Array.isArray(keys) ? keys : Object.keys(keys);
      return structuredClone(Object.fromEntries(names.map(key => [key, platform.storage[key] ?? (keys && !Array.isArray(keys) && typeof keys === 'object' ? keys[key] : undefined)])));
    },
    async set(values) { Object.assign(platform.storage, structuredClone(values)); },
    async remove(keys) { for (const key of typeof keys === 'string' ? [keys] : keys) delete platform.storage[key]; },
    async clear() { platform.storage = {}; },
  } } };
  window.__SIDENOTE_DISABLE_AUTO_BOOTSTRAP__ = true;
})();
