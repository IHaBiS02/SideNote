import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import createDOMPurify from 'dompurify';
import { marked as markedParser } from 'marked';

const mocks = vi.hoisted(() => ({
  downloadFile: vi.fn(),
  getImage: vi.fn(),
  settings: {
    fontSize: 14,
    lineHeight: 1.5,
    codeLineHeight: 1.2,
    codeBlockHeader: true,
    mode: 'light',
  },
}));

vi.mock('../../src/database/index.js', () => ({
  getImage: mocks.getImage,
}));

vi.mock('../../src/settings.js', () => ({
  resolveEffectiveSettings: vi.fn(() => ({ ...mocks.settings })),
}));

vi.mock('../../src/utils.js', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    downloadFile: mocks.downloadFile,
  };
});

import {
  STANDALONE_NOTE_SCRIPT,
  createStandaloneNoteHtml,
  createStandaloneNotePdf,
  downloadStandaloneNoteHtml,
  downloadStandaloneNotePdf,
} from '../../src/document-export.js';

function makeNote(overrides = {}) {
  return {
    id: 'note-1',
    title: 'Export <Note>',
    content: [
      '# Heading',
      '',
      'first line',
      'second line',
      '',
      '- [x] Finished',
      '',
      '```javascript',
      'const answer = 42;',
      '```',
      '',
      '![Stored image](images/image-1.png)',
      '',
      '![External image](https://placehold.co/120x80.png)',
      '',
      '[Example](https://example.com)',
      '',
      '<script>alert("unsafe")</script>',
    ].join('\n'),
    settings: {},
    metadata: { createdAt: 1, lastModified: 2 },
    isPinned: false,
    ...overrides,
  };
}

function createPdfWorker(pdfBlob) {
  const worker = {
    set: vi.fn(),
    from: vi.fn(),
    toPdf: vi.fn(),
    outputPdf: vi.fn().mockResolvedValue(pdfBlob),
  };
  worker.set.mockReturnValue(worker);
  worker.from.mockReturnValue(worker);
  worker.toPdf.mockReturnValue(worker);
  return worker;
}

describe('standalone document export', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    globalThis.marked = markedParser;
    globalThis.DOMPurify = typeof createDOMPurify.sanitize === 'function'
      ? createDOMPurify
      : createDOMPurify(window);
    globalThis.hljs = {
      getLanguage: vi.fn(language => language === 'javascript'),
      highlight: vi.fn(code => ({
        value: code.replace('const', '<span class="hljs-keyword">const</span>'),
      })),
      highlightAuto: vi.fn(code => ({ value: code })),
    };
    mocks.getImage.mockResolvedValue(
      new Blob(['stored-image'], { type: 'image/png' }),
    );
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      blob: vi.fn().mockResolvedValue(
        new Blob(['external-image'], { type: 'image/png' }),
      ),
    }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('creates a sanitized single HTML file with all images embedded', async () => {
    const html = await createStandaloneNoteHtml(makeNote());

    expect(html).toContain('<!doctype html>');
    expect(html).toContain('data-theme="light"');
    expect(html).toContain('<title>Export &lt;Note&gt;</title>');
    expect(html).toContain('data:image/png;base64,');
    expect(html).not.toContain('images/image-1.png');
    expect(html).not.toContain('placehold.co');
    const exportedDocument = new DOMParser().parseFromString(html, 'text/html');
    expect(Array.from(exportedDocument.images, image => image.src).every(
      source => source.startsWith('data:image/png;base64,'),
    )).toBe(true);
    expect(html).not.toContain('alert("unsafe")');
    expect(html).toContain('first line<br>second line');
    expect(html).toContain('class="code-block-language">javascript</span>');
    expect(html).toContain('class="copy-code-button"');
    expect(html).toContain('aria-label="Copy code"');
    expect(html).toContain("navigator.clipboard?.writeText");
    expect(html.match(/<script>/g)).toHaveLength(1);
    expect(html).toContain('class="hljs-keyword">const</span>');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain('--export-font-size: 14px');
    const checkbox = exportedDocument.querySelector('input[type="checkbox"]');
    expect(checkbox).not.toBeNull();
    expect(checkbox.disabled).toBe(false);
    expect(checkbox.hasAttribute('disabled')).toBe(false);
    expect(checkbox.checked).toBe(true);
    checkbox.click();
    expect(checkbox.checked).toBe(false);
    expect(html).toContain('--export-checkbox-accent: #007bff');
    expect(html).toContain('margin: 0 5px 0 0');
    expect(mocks.getImage).toHaveBeenCalledWith('image-1');
    expect(fetch).toHaveBeenCalledWith(
      'https://placehold.co/120x80.png',
      { cache: 'force-cache', credentials: 'omit' },
    );
  });

  it('fails rather than creating a non-standalone file when a stored image is missing', async () => {
    mocks.getImage.mockResolvedValue(null);

    await expect(createStandaloneNoteHtml(makeNote())).rejects.toThrow(
      'Could not embed missing image: images/image-1.png',
    );
  });

  it('fails rather than leaving an external image URL in an offline export', async () => {
    fetch.mockRejectedValue(new TypeError('CORS blocked'));

    await expect(createStandaloneNoteHtml(makeNote())).rejects.toThrow(
      'Could not download image for offline export: https://placehold.co/120x80.png',
    );
  });

  it('downloads the standalone HTML with a sanitized filename', async () => {
    await downloadStandaloneNoteHtml(makeNote({ title: 'Bad:/Title?' }));

    expect(mocks.downloadFile).toHaveBeenCalledTimes(1);
    const [blob, filename] = mocks.downloadFile.mock.calls[0];
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe('text/html;charset=utf-8');
    expect(filename).toBe('Bad__Title_.html');
  });

  it('renders and downloads a PDF Blob directly without opening a print dialog', async () => {
    const pdfBlob = new Blob(['pdf'], { type: 'application/pdf' });
    const worker = createPdfWorker(pdfBlob);
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});
    globalThis.html2pdf = vi.fn(() => worker);

    const result = await createStandaloneNotePdf(makeNote());

    expect(result).toBe(pdfBlob);
    expect(globalThis.html2pdf).toHaveBeenCalledTimes(1);
    expect(worker.set).toHaveBeenCalledWith(expect.objectContaining({
      margin: [10, 10, 10, 10],
      image: { type: 'jpeg', quality: 0.98 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    }));
    const renderedArticle = worker.from.mock.calls[0][0];
    expect(renderedArticle.querySelector('img').src).toMatch(/^data:image\/png;base64,/);
    expect(renderedArticle.querySelector('.copy-code-button')).toBeNull();
    expect(worker.toPdf).toHaveBeenCalledTimes(1);
    expect(worker.outputPdf).toHaveBeenCalledWith('blob');
    expect(printSpy).not.toHaveBeenCalled();
    expect(document.querySelector('.pdf-render-root')).toBeNull();
    expect(document.querySelector('style[data-sidenote-document-export]')).toBeNull();

    await downloadStandaloneNotePdf(makeNote({ title: 'PDF Note' }));
    expect(mocks.downloadFile).toHaveBeenLastCalledWith(pdfBlob, 'PDF Note.pdf');
  });

  it('copies fenced code from the self-contained HTML handler', async () => {
    const html = await createStandaloneNoteHtml(makeNote());
    const exportedDocument = new DOMParser().parseFromString(html, 'text/html');
    document.body.innerHTML = exportedDocument.body.innerHTML;
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    Object.defineProperty(window, 'isSecureContext', {
      configurable: true,
      value: true,
    });
    window.eval(STANDALONE_NOTE_SCRIPT);

    const button = document.querySelector('.copy-code-button');
    const code = document.querySelector('.code-block pre > code');
    button.click();
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(writeText).toHaveBeenCalledWith(code.textContent);
    expect(button.textContent).toBe('✓');
  });
});
