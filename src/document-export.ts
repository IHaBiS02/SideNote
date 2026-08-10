import { getImage } from './database/index.js';
import { resolveEffectiveSettings } from './settings.js';
import { downloadFile, sanitizeFilename } from './utils.js';
import type { GlobalSettings, Note } from './types.js';

type DocumentExportSettings = Pick<
  GlobalSettings,
  'fontSize' | 'lineHeight' | 'codeLineHeight' | 'codeBlockHeader' | 'mode'
>;

type Html2PdfWorker = InstanceType<typeof html2pdf.Worker>;
type Html2PdfOptions = Parameters<Html2PdfWorker['set']>[0] & {
  pagebreak: {
    mode: string[];
    avoid: string[];
  };
};

const INTERNAL_IMAGE_PATTERN = /^images\/([^/?#]+)\.png(?:[?#].*)?$/;
const LANGUAGE_CLASS_PATTERN = /(?:^|\s)language-([^\s]+)/;

const STANDALONE_NOTE_SCRIPT = `
  (() => {
    const feedbackTimers = new WeakMap();

    const copyText = async (text) => {
      if (navigator.clipboard?.writeText && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(text);
          return;
        } catch {
          // Local files may expose the API while denying clipboard permission.
        }
      }

      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.readOnly = true;
      textarea.style.position = 'fixed';
      textarea.style.left = '-10000px';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        if (!document.execCommand('copy')) {
          throw new Error('The browser rejected the copy command.');
        }
      } finally {
        textarea.remove();
      }
    };

    const showFeedback = (button, text) => {
      const previousTimer = feedbackTimers.get(button);
      if (previousTimer) clearTimeout(previousTimer);
      button.textContent = text;
      feedbackTimers.set(button, setTimeout(() => {
        button.textContent = '📄';
        feedbackTimers.delete(button);
      }, 1000));
    };

    document.addEventListener('click', async (event) => {
      if (!(event.target instanceof Element)) return;
      const button = event.target.closest('.copy-code-button');
      if (!button) return;

      const code = button.closest('.code-block')?.querySelector('pre > code');
      if (!code) return;
      try {
        await copyText(code.textContent || '');
        showFeedback(button, '✓');
      } catch {
        showFeedback(button, '!');
      }
    });
  })();
`;

const STANDALONE_NOTE_CSS = `
  html.sidenote-export-document {
    color-scheme: light dark;
  }

  html.sidenote-export-document,
  body.sidenote-export-document {
    margin: 0;
    min-height: 100%;
    background: #ffffff;
  }

  html.sidenote-export-document[data-theme="dark"],
  body.sidenote-export-document[data-theme="dark"] {
    background: #1e1e1e;
  }

  @media (prefers-color-scheme: dark) {
    html.sidenote-export-document[data-theme="system"],
    body.sidenote-export-document[data-theme="system"] {
      background: #1e1e1e;
    }
  }

  body.sidenote-export-document {
    padding: 32px;
  }

  .sidenote-export {
    --export-background: #ffffff;
    --export-color: #24292f;
    --export-muted-color: #57606a;
    --export-border-color: #d0d7de;
    --export-code-background: #f5f5f5;
    --export-code-color: #24292f;
    --export-code-header-background: #eeeeee;
    --export-link-color: #0969da;
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
    padding: 0;
    background: var(--export-background);
    color: var(--export-color);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    font-size: var(--export-font-size, 12px);
    line-height: var(--export-line-height, 1.5);
    overflow-wrap: anywhere;
    word-break: break-word;
  }

  .sidenote-export,
  .sidenote-export *,
  .sidenote-export *::before,
  .sidenote-export *::after {
    box-sizing: border-box;
  }

  .sidenote-export[data-theme="dark"] {
    --export-background: #1e1e1e;
    --export-color: #d4d4d4;
    --export-muted-color: #a0a0a0;
    --export-border-color: #ffffff;
    --export-code-background: #2a2a2a;
    --export-code-color: #d4d4d4;
    --export-code-header-background: #242424;
    --export-link-color: #58a6ff;
  }

  @media (prefers-color-scheme: dark) {
    .sidenote-export[data-theme="system"] {
      --export-background: #1e1e1e;
      --export-color: #d4d4d4;
      --export-muted-color: #a0a0a0;
      --export-border-color: #ffffff;
      --export-code-background: #2a2a2a;
      --export-code-color: #d4d4d4;
      --export-code-header-background: #242424;
      --export-link-color: #58a6ff;
    }
  }

  .sidenote-export .note-title {
    margin: 0 0 1em;
    padding-bottom: 0.35em;
    border-bottom: 1px solid var(--export-border-color);
    font-size: 2em;
    font-weight: 700;
    line-height: var(--export-line-height, 1.5);
  }

  .sidenote-export .note-content > :first-child {
    margin-top: 0;
  }

  .sidenote-export .note-content > :last-child {
    margin-bottom: 0;
  }

  .sidenote-export h1,
  .sidenote-export h2,
  .sidenote-export h3,
  .sidenote-export h4,
  .sidenote-export h5,
  .sidenote-export h6 {
    margin: 1em 0 0.5em;
    font-weight: 700;
    line-height: var(--export-line-height, 1.5);
  }

  .sidenote-export h1 { font-size: 2em; }
  .sidenote-export h2 { font-size: 1.5em; }
  .sidenote-export h3 { font-size: 1.25em; }
  .sidenote-export h4 { font-size: 1em; }
  .sidenote-export h5 { font-size: 0.875em; }
  .sidenote-export h6 { font-size: 0.85em; color: var(--export-muted-color); }

  .sidenote-export p,
  .sidenote-export ul,
  .sidenote-export ol,
  .sidenote-export blockquote,
  .sidenote-export table,
  .sidenote-export .code-block {
    margin: 0 0 1em;
  }

  .sidenote-export ul,
  .sidenote-export ol {
    padding-left: 2em;
  }

  .sidenote-export li + li {
    margin-top: 0.25em;
  }

  .sidenote-export .task-list-item {
    list-style: none;
  }

  .sidenote-export input[type="checkbox"] {
    margin: 0 0.45em 0 -1.5em;
    vertical-align: middle;
  }

  .sidenote-export blockquote {
    padding-left: 1em;
    border-left: 4px solid var(--export-border-color);
    color: var(--export-muted-color);
  }

  .sidenote-export a {
    color: var(--export-link-color);
    text-decoration: none;
  }

  .sidenote-export a:hover {
    text-decoration: underline;
  }

  .sidenote-export hr {
    height: 1px;
    margin: 1.5em 0;
    border: 0;
    background: var(--export-border-color);
  }

  .sidenote-export :not(pre) > code {
    border: 1px solid var(--export-border-color);
    border-radius: 4px;
    padding: 0.15em 0.35em;
    background: var(--export-code-background);
    color: var(--export-code-color);
    font-family: ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", monospace;
  }

  .sidenote-export .code-block {
    break-inside: avoid;
    border: 1px solid var(--export-border-color);
    background: var(--export-code-background);
  }

  .sidenote-export .code-block-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 26px;
    padding: 4px 7px;
    border-bottom: 1px solid var(--export-border-color);
    background: var(--export-code-header-background);
    color: var(--export-muted-color);
    font-family: ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", monospace;
    font-size: 0.9em;
  }

  .sidenote-export .code-block-language {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .sidenote-export .copy-code-button {
    flex: 0 0 auto;
    min-width: 26px;
    height: 22px;
    border: 1px solid transparent;
    padding: 0 4px;
    background: transparent;
    color: inherit;
    font: inherit;
    line-height: 1;
    cursor: pointer;
    user-select: none;
  }

  .sidenote-export .copy-code-button:hover,
  .sidenote-export .copy-code-button:focus-visible {
    background: color-mix(in srgb, var(--export-color) 12%, transparent);
  }

  .sidenote-export pre {
    margin: 0 0 1em;
    padding: 7px;
    break-inside: avoid;
    background: var(--export-code-background);
    color: var(--export-code-color);
    font-family: ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", monospace;
    line-height: var(--export-code-line-height, 1.2);
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    word-break: break-word;
  }

  .sidenote-export .code-block pre {
    margin: 0;
    border: 0;
  }

  .sidenote-export table {
    width: 100%;
    border-collapse: collapse;
    break-inside: avoid;
  }

  .sidenote-export th,
  .sidenote-export td {
    border: 1px solid var(--export-border-color);
    padding: 5px;
    text-align: center;
  }

  .sidenote-export th {
    font-weight: 700;
  }

  .sidenote-export th[align="left"],
  .sidenote-export td[align="left"] { text-align: left; }
  .sidenote-export th[align="right"],
  .sidenote-export td[align="right"] { text-align: right; }

  .sidenote-export img {
    display: block;
    max-width: 100%;
    height: auto;
    margin: 1em auto;
    break-inside: avoid;
  }

  .sidenote-export .hljs-comment,
  .sidenote-export .hljs-quote { color: #6a737d; font-style: italic; }
  .sidenote-export .hljs-keyword,
  .sidenote-export .hljs-selector-tag { color: #d73a49; }
  .sidenote-export .hljs-string,
  .sidenote-export .hljs-regexp { color: #032f62; }
  .sidenote-export .hljs-number,
  .sidenote-export .hljs-literal { color: #005cc5; }
  .sidenote-export .hljs-title,
  .sidenote-export .hljs-section { color: #6f42c1; }

  .sidenote-export[data-theme="dark"] .hljs-comment,
  .sidenote-export[data-theme="dark"] .hljs-quote { color: #6a9955; }
  .sidenote-export[data-theme="dark"] .hljs-keyword,
  .sidenote-export[data-theme="dark"] .hljs-selector-tag { color: #c586c0; }
  .sidenote-export[data-theme="dark"] .hljs-string,
  .sidenote-export[data-theme="dark"] .hljs-regexp { color: #ce9178; }
  .sidenote-export[data-theme="dark"] .hljs-number,
  .sidenote-export[data-theme="dark"] .hljs-literal { color: #b5cea8; }
  .sidenote-export[data-theme="dark"] .hljs-title,
  .sidenote-export[data-theme="dark"] .hljs-section { color: #dcdcaa; }

  @media (prefers-color-scheme: dark) {
    .sidenote-export[data-theme="system"] .hljs-comment,
    .sidenote-export[data-theme="system"] .hljs-quote { color: #6a9955; }
    .sidenote-export[data-theme="system"] .hljs-keyword,
    .sidenote-export[data-theme="system"] .hljs-selector-tag { color: #c586c0; }
    .sidenote-export[data-theme="system"] .hljs-string,
    .sidenote-export[data-theme="system"] .hljs-regexp { color: #ce9178; }
    .sidenote-export[data-theme="system"] .hljs-number,
    .sidenote-export[data-theme="system"] .hljs-literal { color: #b5cea8; }
    .sidenote-export[data-theme="system"] .hljs-title,
    .sidenote-export[data-theme="system"] .hljs-section { color: #dcdcaa; }
  }

  @page {
    size: A4;
    margin: 12mm;
  }

  @media print {
    html.sidenote-export-document,
    body.sidenote-export-document {
      background: #ffffff !important;
    }

    body.sidenote-export-document {
      padding: 0;
    }

    .sidenote-export {
      max-width: none;
    }

    .sidenote-export .copy-code-button {
      display: none;
    }
  }
`;

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(String(reader.result)));
    reader.addEventListener('error', () => {
      reject(reader.error || new Error('Could not read an embedded image'));
    });
    reader.readAsDataURL(blob);
  });
}

function highlightCodeBlocks(root: ParentNode): void {
  if (!globalThis.hljs?.highlight || !globalThis.hljs?.highlightAuto) return;

  root.querySelectorAll<HTMLElement>('pre > code').forEach((code) => {
    const language = LANGUAGE_CLASS_PATTERN.exec(code.className)?.[1] || '';
    let highlighted = '';
    if (language && globalThis.hljs.getLanguage(language)) {
      highlighted = globalThis.hljs.highlight(code.textContent || '', {
        language,
        ignoreIllegals: true,
      }).value;
    } else if (!language) {
      highlighted = globalThis.hljs.highlightAuto(code.textContent || '').value;
    }
    if (!highlighted) return;

    code.innerHTML = DOMPurify.sanitize(highlighted, {
      ALLOWED_TAGS: ['span'],
      ALLOWED_ATTR: ['class'],
    });
  });
}

function decorateCodeBlocks(
  root: ParentNode,
  showHeader: boolean,
  includeCopyButtons: boolean,
): void {
  root.querySelectorAll<HTMLPreElement>('pre').forEach((pre) => {
    const code = pre.querySelector<HTMLElement>(':scope > code');
    const language = LANGUAGE_CLASS_PATTERN.exec(code?.className || '')?.[1] || 'text';
    const container = document.createElement('div');
    container.className = 'code-block';
    pre.before(container);

    if (showHeader) {
      const header = document.createElement('div');
      header.className = 'code-block-header';
      const languageLabel = document.createElement('span');
      languageLabel.className = 'code-block-language';
      languageLabel.textContent = language;
      header.appendChild(languageLabel);

      if (includeCopyButtons) {
        const copyButton = document.createElement('button');
        copyButton.type = 'button';
        copyButton.className = 'copy-code-button';
        copyButton.setAttribute('aria-label', 'Copy code');
        copyButton.title = 'Copy code';
        copyButton.textContent = '📄';
        header.appendChild(copyButton);
      }
      container.appendChild(header);
    }
    container.appendChild(pre);
  });
}

async function loadImageBlob(source: string): Promise<Blob | null> {
  const internalMatch = INTERNAL_IMAGE_PATTERN.exec(source);
  if (internalMatch) {
    const blob = await getImage(internalMatch[1]);
    if (!blob) {
      throw new Error(`Could not embed missing image: ${source}`);
    }
    return blob;
  }

  if (source.startsWith('data:')) return null;

  let url: URL;
  try {
    url = new URL(source);
  } catch {
    throw new Error(`Could not embed unsupported image URL: ${source}`);
  }
  if (!['http:', 'https:', 'blob:'].includes(url.protocol)) {
    throw new Error(`Could not embed unsupported image URL: ${source}`);
  }

  let response: Response;
  try {
    response = await fetch(url.href, {
      cache: 'force-cache',
      credentials: 'omit',
    });
  } catch {
    throw new Error(`Could not download image for offline export: ${source}`);
  }
  if (!response.ok) {
    throw new Error(
      `Could not download image for offline export (${response.status}): ${source}`,
    );
  }

  const blob = await response.blob();
  if (blob.type && !blob.type.startsWith('image/')) {
    throw new Error(`Export image has an unsupported content type: ${source}`);
  }
  return blob;
}

async function embedImages(root: ParentNode): Promise<void> {
  const images = Array.from(root.querySelectorAll<HTMLImageElement>('img'));
  await Promise.all(images.map(async (image) => {
    const source = image.getAttribute('src') || '';
    const blob = await loadImageBlob(source);
    if (!blob) return;
    image.src = await blobToDataUrl(blob);
  }));
}

async function createExportArticle(
  note: Note,
  settings: DocumentExportSettings,
  includeCopyButtons: boolean,
): Promise<HTMLElement> {
  const dirtyHtml = marked.parse(note.content, { gfm: true, breaks: true });
  const sanitizedHtml = DOMPurify.sanitize(dirtyHtml, {
    ADD_ATTR: ['align', 'checked', 'disabled'],
  });
  const article = document.createElement('article');
  article.className = 'sidenote-export';
  article.dataset.theme = settings.mode;
  article.style.setProperty('--export-font-size', `${settings.fontSize}px`);
  article.style.setProperty('--export-line-height', String(settings.lineHeight));
  article.style.setProperty(
    '--export-code-line-height',
    String(settings.codeLineHeight),
  );

  const title = document.createElement('h1');
  title.className = 'note-title';
  title.textContent = note.title || 'Untitled Note';
  article.appendChild(title);

  const content = document.createElement('div');
  content.className = 'note-content';
  content.innerHTML = sanitizedHtml;
  content.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')
    .forEach(checkbox => { checkbox.disabled = true; });
  content.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((link) => {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });

  highlightCodeBlocks(content);
  decorateCodeBlocks(
    content,
    settings.codeBlockHeader !== false,
    includeCopyButtons,
  );
  await embedImages(content);
  article.appendChild(content);
  return article;
}

function exportFilename(note: Note, extension: 'html' | 'pdf'): string {
  const baseName = sanitizeFilename(note.title || '').trim() || 'note';
  return `${baseName}.${extension}`;
}

async function createStandaloneNoteHtml(note: Note): Promise<string> {
  const settings = resolveEffectiveSettings(note);
  const article = await createExportArticle(note, settings, true);
  const title = escapeHtml(note.title || 'Untitled Note');
  const copyScript = article.querySelector('.copy-code-button')
    ? `\n<script>${STANDALONE_NOTE_SCRIPT}<\/script>`
    : '';

  return `<!doctype html>
<html class="sidenote-export-document" lang="und" data-theme="${settings.mode}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <title>${title}</title>
  <style>${STANDALONE_NOTE_CSS}</style>
</head>
<body class="sidenote-export-document" data-theme="${settings.mode}">
${article.outerHTML}
${copyScript}
</body>
</html>`;
}

async function downloadStandaloneNoteHtml(note: Note): Promise<void> {
  const html = await createStandaloneNoteHtml(note);
  downloadFile(
    new Blob([html], { type: 'text/html;charset=utf-8' }),
    exportFilename(note, 'html'),
  );
}

function usesDarkExportTheme(settings: DocumentExportSettings): boolean {
  if (settings.mode === 'dark') return true;
  if (settings.mode === 'light') return false;
  return Boolean(window.matchMedia?.('(prefers-color-scheme: dark)').matches);
}

async function createStandaloneNotePdf(note: Note): Promise<Blob> {
  if (typeof html2pdf !== 'function') {
    throw new Error('PDF export library is unavailable');
  }

  const settings = resolveEffectiveSettings(note);
  const article = await createExportArticle(note, settings, false);
  article.classList.add('pdf-render-root');
  article.style.width = '190mm';
  article.style.maxWidth = '190mm';
  article.style.padding = '0';

  const staging = document.createElement('div');
  staging.style.position = 'fixed';
  staging.style.left = '-100000px';
  staging.style.top = '0';
  staging.style.width = '190mm';
  staging.style.pointerEvents = 'none';
  staging.appendChild(article);

  const style = document.createElement('style');
  style.dataset.sidenoteDocumentExport = 'true';
  style.textContent = STANDALONE_NOTE_CSS;
  document.head.appendChild(style);
  document.body.appendChild(staging);

  try {
    const options: Html2PdfOptions = {
      margin: [10, 10, 10, 10],
      filename: exportFilename(note, 'pdf'),
      image: { type: 'jpeg', quality: 0.98 },
      enableLinks: true,
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: usesDarkExportTheme(settings) ? '#1e1e1e' : '#ffffff',
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'], avoid: ['img', 'pre', 'table'] },
    };
    const result = await html2pdf()
      .set(options)
      .from(article)
      .toPdf()
      .outputPdf('blob');

    if (!(result instanceof Blob)) {
      throw new Error('PDF renderer did not return a Blob');
    }
    return result;
  } finally {
    staging.remove();
    style.remove();
  }
}

async function downloadStandaloneNotePdf(note: Note): Promise<void> {
  const pdf = await createStandaloneNotePdf(note);
  downloadFile(pdf, exportFilename(note, 'pdf'));
}

export {
  STANDALONE_NOTE_CSS,
  STANDALONE_NOTE_SCRIPT,
  createStandaloneNoteHtml,
  createStandaloneNotePdf,
  downloadStandaloneNoteHtml,
  downloadStandaloneNotePdf,
};
