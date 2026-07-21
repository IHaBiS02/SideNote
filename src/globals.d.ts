import JSZipClass from 'jszip';

type WebExtensionBrowser = typeof import('webextension-polyfill');

declare global {
  const JSZip: typeof JSZipClass;
  const browser: WebExtensionBrowser;
}

export {};
