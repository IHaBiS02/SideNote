// Global test setup

// fake-indexeddb: provides IndexedDB implementation for Node.js
import 'fake-indexeddb/auto';

// Mock browser (WebExtension polyfill) API
import { browser, clearStorageData } from './mocks/browser-api.js';
globalThis.browser = browser;

// Mock crypto.randomUUID
if (!globalThis.crypto) {
  globalThis.crypto = {};
}
if (!globalThis.crypto.randomUUID) {
  let uuidCounter = 0;
  globalThis.crypto.randomUUID = () => {
    uuidCounter++;
    return `00000000-0000-0000-0000-${String(uuidCounter).padStart(12, '0')}`;
  };
}

// Reset state between tests
beforeEach(() => {
  clearStorageData();
});
