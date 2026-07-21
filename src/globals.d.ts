import JSZipClass from 'jszip';

type WebExtensionBrowser = typeof import('webextension-polyfill');

interface HighlightResult {
  value: string;
}

interface HighlightJsGlobal {
  getLanguage(language: string): unknown;
  highlight(code: string, options: { language: string; ignoreIllegals?: boolean }): HighlightResult;
  highlightAuto(code: string): HighlightResult;
}

interface MarkedGlobal {
  parse(markdown: string): string;
}

declare global {
  function importScripts(...urls: string[]): void;

  var __SIDENOTE_DISABLE_AUTO_BOOTSTRAP__: boolean | undefined;
  const JSZip: typeof JSZipClass;
  const browser: WebExtensionBrowser;
  const marked: MarkedGlobal;
  const DOMPurify: {
    sanitize(dirty: string, config?: Record<string, unknown>): string;
  };
  var hljs: HighlightJsGlobal;
}

export {};
