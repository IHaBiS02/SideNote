import { getImage } from './database/index.js';
import { resolveEffectiveSettings } from './settings.js';
import { downloadFile, sanitizeFilename } from './utils.js';
import { createNoteContentStyles } from './editor/note-content-styles.js';
import { ensureHtml2PdfLoaded, ensureMarkdownRenderersLoaded, } from './vendor-loader.js';
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
const STANDALONE_NOTE_CONTENT_CSS = createNoteContentStyles({
    rootSelector: '.sidenote-export .note-content',
    variableNamespace: 'export',
    taskItemSelector: 'li.task-list-item',
    tableAlignmentSource: 'align',
});
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
    --export-color: #000000;
    --export-border-color: #cccccc;
    --export-list-marker-color: #8a8a8a;
    --export-table-border-color: #000000;
    --export-table-aligned-cell-padding: 5px;
    --export-code-background: #fafafa;
    --export-code-color: #383a42;
    --export-code-header-background: #f5f5f5;
    --export-code-header-color: #555555;
    --export-link-color: #007bff;
    --export-link-visited-color: #551a8b;
    --export-link-hover-color: #0056b3;
    --export-link-active-color: #0056b3;
    --export-inline-code-background: #f0f0f0;
    --export-inline-code-border: #cccccc;
    --export-checkbox-accent: #007bff;
    --export-hl-comment: #a0a1a7;
    --export-hl-keyword: #a626a4;
    --export-hl-name: #e45649;
    --export-hl-literal: #0184bb;
    --export-hl-string: #50a14f;
    --export-hl-number: #986801;
    --export-hl-title: #4078f2;
    --export-hl-built-in: #c18401;
    --export-font-family: Arial, sans-serif;
    --export-code-font-family: monospace;
    --export-heading-line-height: var(--export-line-height, 1.5);
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
    padding: 0;
    background: var(--export-background);
    color: var(--export-color);
    font-family: var(--export-font-family);
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
    --export-color: #e0e0e0;
    --export-border-color: #444444;
    --export-list-marker-color: #a8a8a8;
    --export-table-border-color: #ffffff;
    --export-code-background: #2d2d2d;
    --export-code-color: #abb2bf;
    --export-code-header-background: #252525;
    --export-code-header-color: #cccccc;
    --export-link-color: #82aaff;
    --export-link-visited-color: #c792ea;
    --export-link-hover-color: #add8e6;
    --export-link-active-color: #ffffff;
    --export-inline-code-background: #333333;
    --export-inline-code-border: #555555;
    --export-checkbox-accent: #82aaff;
    --export-hl-comment: #5c6370;
    --export-hl-keyword: #c678dd;
    --export-hl-name: #e06c75;
    --export-hl-literal: #56b6c2;
    --export-hl-string: #98c379;
    --export-hl-number: #d19a66;
    --export-hl-title: #61aeee;
    --export-hl-built-in: #e6c07b;
  }

  @media (prefers-color-scheme: dark) {
    .sidenote-export[data-theme="system"] {
      --export-background: #1e1e1e;
      --export-color: #e0e0e0;
      --export-border-color: #444444;
      --export-list-marker-color: #a8a8a8;
      --export-table-border-color: #ffffff;
      --export-code-background: #2d2d2d;
      --export-code-color: #abb2bf;
      --export-code-header-background: #252525;
      --export-code-header-color: #cccccc;
      --export-link-color: #82aaff;
      --export-link-visited-color: #c792ea;
      --export-link-hover-color: #add8e6;
      --export-link-active-color: #ffffff;
      --export-inline-code-background: #333333;
      --export-inline-code-border: #555555;
      --export-checkbox-accent: #82aaff;
      --export-hl-comment: #5c6370;
      --export-hl-keyword: #c678dd;
      --export-hl-name: #e06c75;
      --export-hl-literal: #56b6c2;
      --export-hl-string: #98c379;
      --export-hl-number: #d19a66;
      --export-hl-title: #61aeee;
      --export-hl-built-in: #e6c07b;
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

  ${STANDALONE_NOTE_CONTENT_CSS}

  .sidenote-export .code-block {
    margin: 1em 0;
    break-inside: avoid;
    border: 1px solid var(--export-border-color);
    background: var(--export-code-background);
  }

  .sidenote-export .code-block-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 26px;
    padding: 3px 5px;
    border-bottom: 1px solid var(--export-border-color);
    background: var(--export-code-header-background);
    color: var(--export-code-header-color);
    font-family: var(--export-code-font-family);
    font-size: 0.9em;
  }

  .sidenote-export .code-block-language {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .sidenote-export .copy-code-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    min-width: 26px;
    height: 22px;
    border: 1px solid transparent;
    border-radius: 6px;
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
    padding: 5px;
    break-inside: avoid;
    background: var(--export-code-background);
    color: var(--export-code-color);
    font-family: var(--export-code-font-family);
    line-height: var(--export-code-line-height, 1.2);
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    word-break: break-all;
  }

  .sidenote-export .code-block pre {
    margin: 0;
    border: 0;
  }

  .sidenote-export table,
  .sidenote-export img {
    break-inside: avoid;
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
function escapeHtml(value) {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}
function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => resolve(String(reader.result)));
        reader.addEventListener('error', () => {
            reject(reader.error || new Error('Could not read an embedded image'));
        });
        reader.readAsDataURL(blob);
    });
}
function highlightCodeBlocks(root) {
    if (!globalThis.hljs?.highlight || !globalThis.hljs?.highlightAuto)
        return;
    root.querySelectorAll('pre > code').forEach((code) => {
        const language = LANGUAGE_CLASS_PATTERN.exec(code.className)?.[1] || '';
        let highlighted = '';
        if (language && globalThis.hljs.getLanguage(language)) {
            highlighted = globalThis.hljs.highlight(code.textContent || '', {
                language,
                ignoreIllegals: true,
            }).value;
        }
        else if (!language) {
            highlighted = globalThis.hljs.highlightAuto(code.textContent || '').value;
        }
        if (!highlighted)
            return;
        code.innerHTML = DOMPurify.sanitize(highlighted, {
            ALLOWED_TAGS: ['span'],
            ALLOWED_ATTR: ['class'],
        });
    });
}
function decorateCodeBlocks(root, showHeader, includeCopyButtons) {
    root.querySelectorAll('pre').forEach((pre) => {
        const code = pre.querySelector(':scope > code');
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
async function loadImageBlob(source) {
    const internalMatch = INTERNAL_IMAGE_PATTERN.exec(source);
    if (internalMatch) {
        const blob = await getImage(internalMatch[1]);
        if (!blob) {
            throw new Error(`Could not embed missing image: ${source}`);
        }
        return blob;
    }
    if (source.startsWith('data:'))
        return null;
    let url;
    try {
        url = new URL(source);
    }
    catch {
        throw new Error(`Could not embed unsupported image URL: ${source}`);
    }
    if (!['http:', 'https:', 'blob:'].includes(url.protocol)) {
        throw new Error(`Could not embed unsupported image URL: ${source}`);
    }
    let response;
    try {
        response = await fetch(url.href, {
            cache: 'force-cache',
            credentials: 'omit',
        });
    }
    catch {
        throw new Error(`Could not download image for offline export: ${source}`);
    }
    if (!response.ok) {
        throw new Error(`Could not download image for offline export (${response.status}): ${source}`);
    }
    const blob = await response.blob();
    if (blob.type && !blob.type.startsWith('image/')) {
        throw new Error(`Export image has an unsupported content type: ${source}`);
    }
    return blob;
}
async function embedImages(root) {
    const images = Array.from(root.querySelectorAll('img'));
    await Promise.all(images.map(async (image) => {
        const source = image.getAttribute('src') || '';
        const blob = await loadImageBlob(source);
        if (!blob)
            return;
        image.src = await blobToDataUrl(blob);
    }));
}
async function createExportArticle(note, settings, includeCopyButtons) {
    const dirtyHtml = marked.parse(note.content, { gfm: true, breaks: true });
    const sanitizedHtml = DOMPurify.sanitize(dirtyHtml, {
        ADD_ATTR: ['align', 'checked', 'disabled'],
    });
    const article = document.createElement('article');
    article.className = 'sidenote-export';
    article.dataset.theme = settings.mode;
    article.style.setProperty('--export-font-size', `${settings.fontSize}px`);
    article.style.setProperty('--export-line-height', String(settings.lineHeight));
    article.style.setProperty('--export-code-line-height', String(settings.codeLineHeight));
    const title = document.createElement('h1');
    title.className = 'note-title';
    title.textContent = note.title || 'Untitled Note';
    article.appendChild(title);
    const content = document.createElement('div');
    content.className = 'note-content';
    content.innerHTML = sanitizedHtml;
    content.querySelectorAll('input[type="checkbox"]')
        .forEach((checkbox) => {
        // Marked emits disabled task inputs. Standalone HTML may keep them
        // interactive because its state is intentionally local to the file.
        checkbox.disabled = false;
        checkbox.removeAttribute('disabled');
    });
    content.querySelectorAll('a[href]').forEach((link) => {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
    });
    highlightCodeBlocks(content);
    decorateCodeBlocks(content, settings.codeBlockHeader !== false, includeCopyButtons);
    await embedImages(content);
    article.appendChild(content);
    return article;
}
function exportFilename(note, extension) {
    const baseName = sanitizeFilename(note.title || '').trim() || 'note';
    return `${baseName}.${extension}`;
}
async function createStandaloneNoteHtml(note) {
    await ensureMarkdownRenderersLoaded();
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
async function downloadStandaloneNoteHtml(note) {
    const html = await createStandaloneNoteHtml(note);
    downloadFile(new Blob([html], { type: 'text/html;charset=utf-8' }), exportFilename(note, 'html'));
}
function usesDarkExportTheme(settings) {
    if (settings.mode === 'dark')
        return true;
    if (settings.mode === 'light')
        return false;
    return Boolean(window.matchMedia?.('(prefers-color-scheme: dark)').matches);
}
async function createStandaloneNotePdf(note) {
    await Promise.all([
        ensureMarkdownRenderersLoaded(),
        ensureHtml2PdfLoaded(),
    ]);
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
        const options = {
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
    }
    finally {
        staging.remove();
        style.remove();
    }
}
async function downloadStandaloneNotePdf(note) {
    const pdf = await createStandaloneNotePdf(note);
    downloadFile(pdf, exportFilename(note, 'pdf'));
}
export { STANDALONE_NOTE_CSS, STANDALONE_NOTE_SCRIPT, createStandaloneNoteHtml, createStandaloneNotePdf, downloadStandaloneNoteHtml, downloadStandaloneNotePdf, };
