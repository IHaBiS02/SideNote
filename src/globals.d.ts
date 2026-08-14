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
  parse(markdown: string, options?: Record<string, unknown>): string;
}

declare global {
  function importScripts(...urls: string[]): void;

  var __SIDENOTE_DISABLE_AUTO_BOOTSTRAP__: boolean | undefined;
  var JSZip: typeof JSZipClass;
  const browser: WebExtensionBrowser;
  var marked: MarkedGlobal;
  var DOMPurify: {
    sanitize(dirty: string, config?: Record<string, unknown>): string;
  };
  var html2pdf: typeof import('html2pdf.js').default;
  var hljs: HighlightJsGlobal;
}

export {};
