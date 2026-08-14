import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('vendor loader', () => {
  beforeEach(() => {
    vi.resetModules();
    document.head.innerHTML = '';
    delete globalThis.JSZip;
    delete globalThis.marked;
    delete globalThis.DOMPurify;
    delete globalThis.html2pdf;
  });

  it('keeps export-only libraries out of the initial side panel scripts', () => {
    const html = readFileSync(
      resolve(process.cwd(), 'sidepanel.html'),
      'utf8',
    );

    expect(html).not.toContain('vendor/jszip.min.js');
    expect(html).not.toContain('vendor/marked.min.js');
    expect(html).not.toContain('vendor/dompurify.min.js');
    expect(html).not.toContain('vendor/html2pdf.bundle.min.js');
  });

  it('loads JSZip once when the archive feature first requests it', async () => {
    const { ensureJsZipLoaded } = await import('../../src/vendor-loader.js');

    const firstLoad = ensureJsZipLoaded();
    const secondLoad = ensureJsZipLoaded();
    const script = document.querySelector('script[data-sidenote-vendor="jszip"]');

    expect(secondLoad).toBe(firstLoad);
    expect(script?.getAttribute('src')).toBe('vendor/jszip.min.js');

    globalThis.JSZip = { loadAsync: vi.fn() };
    script.dispatchEvent(new Event('load'));
    await expect(firstLoad).resolves.toBeUndefined();

    await ensureJsZipLoaded();
    expect(document.querySelectorAll(
      'script[data-sidenote-vendor="jszip"]',
    )).toHaveLength(1);
  });

  it('loads Markdown rendering and PDF vendors only for those features', async () => {
    const {
      ensureHtml2PdfLoaded,
      ensureMarkdownRenderersLoaded,
    } = await import('../../src/vendor-loader.js');

    const markdownLoad = ensureMarkdownRenderersLoaded();
    const markedScript = document.querySelector(
      'script[data-sidenote-vendor="marked"]',
    );
    const purifierScript = document.querySelector(
      'script[data-sidenote-vendor="dompurify"]',
    );
    expect(markedScript).not.toBeNull();
    expect(purifierScript).not.toBeNull();
    expect(document.querySelector(
      'script[data-sidenote-vendor="html2pdf"]',
    )).toBeNull();

    globalThis.marked = { parse: vi.fn() };
    globalThis.DOMPurify = { sanitize: vi.fn() };
    markedScript.dispatchEvent(new Event('load'));
    purifierScript.dispatchEvent(new Event('load'));
    await markdownLoad;

    const pdfLoad = ensureHtml2PdfLoaded();
    const pdfScript = document.querySelector(
      'script[data-sidenote-vendor="html2pdf"]',
    );
    globalThis.html2pdf = vi.fn();
    pdfScript.dispatchEvent(new Event('load'));
    await pdfLoad;
  });
});
