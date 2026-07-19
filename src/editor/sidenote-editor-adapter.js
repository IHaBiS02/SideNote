import { getImage, saveImage } from '../database/index.js';
import { resolveLegacyTextProcessingSettings } from '../settings.js';
import { globalSettings } from '../state.js';
import { processPastedText } from '../text-processors.js';
import { markdownEditor } from '../dom.js';

const INTERNAL_IMAGE_PATTERN = /^images\/([^/]+)\.png$/;

function highlightCode(code, requestedLanguage) {
  if (!globalThis.hljs?.highlight || !globalThis.hljs?.getLanguage) {
    return [];
  }

  const language = globalThis.hljs.getLanguage(requestedLanguage)
    ? requestedLanguage
    : 'plaintext';
  const highlighted = globalThis.hljs.highlight(code, {
    language,
    ignoreIllegals: true
  }).value;
  const template = document.createElement('template');
  template.innerHTML = highlighted;
  const ranges = [];
  let offset = 0;

  function visit(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      offset += node.textContent.length;
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const start = offset;
    Array.from(node.childNodes).forEach(visit);
    const className = Array.from(node.classList)
      .filter(name => name.startsWith('hljs-'))
      .join(' ');
    if (className && offset > start) {
      ranges.push({ from: start, to: offset, className });
    }
  }

  Array.from(template.content.childNodes).forEach(visit);
  return ranges;
}

const SIDENOTE_EDITOR_THEME = `
  .surface {
    height: 100%;
    overflow-y: auto;
  }

  .editor-mount,
  .source-editor {
    min-height: 100%;
  }

  .editor-mount .ProseMirror {
    min-height: 100%;
    padding: 10px;
    font-family: sans-serif;
    line-height: inherit;
    overflow-wrap: anywhere;
    word-break: break-word;
  }

  .editor-mount .ProseMirror p {
    line-height: inherit;
  }

  .editor-mount .ProseMirror blockquote {
    padding-left: 1em;
    border-left: 4px solid var(--editor-border-color);
  }

  .editor-mount .ProseMirror pre {
    max-width: 100%;
    overflow-x: hidden;
    border: 1px solid var(--editor-border-color);
    padding: 5px;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    word-break: break-all;
    background: var(--editor-code-background);
    color: var(--editor-code-color);
  }

  .editor-mount .ProseMirror pre code {
    display: block;
    padding: 0;
    white-space: inherit;
    overflow-wrap: inherit;
    word-break: inherit;
  }

  .editor-mount .ProseMirror .code-block-container {
    margin: 1em 0;
  }

  .editor-mount .ProseMirror .code-block-container pre {
    margin: 0;
  }

  .code-block-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 26px;
    border: 1px solid var(--editor-border-color);
    border-bottom: 0;
    padding: 3px 5px;
    background: var(--editor-muted-background);
    color: var(--editor-color);
    font-family: var(--editor-code-font-family);
    font-size: 0.9em;
    user-select: none;
  }

  .code-block-language {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .copy-code-button {
    flex: 0 0 auto;
    min-width: 26px;
    height: 22px;
    border: 1px solid transparent;
    padding: 0 4px;
    background: transparent;
    color: inherit;
    line-height: 1;
    cursor: pointer;
    user-select: none;
  }

  .copy-code-button:hover {
    border-color: var(--editor-border-color);
    background: var(--editor-muted-background);
  }

  .editor-mount .ProseMirror code.hljs {
    background: var(--editor-code-background);
    color: var(--editor-code-color);
  }

  .hljs-comment,
  .hljs-quote {
    color: var(--editor-hl-comment);
    font-style: italic;
  }

  .hljs-doctag,
  .hljs-keyword,
  .hljs-formula {
    color: var(--editor-hl-keyword);
  }

  .hljs-section,
  .hljs-name,
  .hljs-selector-tag,
  .hljs-deletion,
  .hljs-subst {
    color: var(--editor-hl-name);
  }

  .hljs-literal {
    color: var(--editor-hl-literal);
  }

  .hljs-string,
  .hljs-regexp,
  .hljs-addition,
  .hljs-attribute,
  .hljs-meta .hljs-string {
    color: var(--editor-hl-string);
  }

  .hljs-attr,
  .hljs-variable,
  .hljs-template-variable,
  .hljs-type,
  .hljs-selector-class,
  .hljs-selector-attr,
  .hljs-selector-pseudo,
  .hljs-number {
    color: var(--editor-hl-number);
  }

  .hljs-symbol,
  .hljs-bullet,
  .hljs-link,
  .hljs-meta,
  .hljs-selector-id,
  .hljs-title {
    color: var(--editor-hl-title);
  }

  .hljs-built_in,
  .hljs-title.class_,
  .hljs-class .hljs-title {
    color: var(--editor-hl-built-in);
  }

  .hljs-emphasis {
    font-style: italic;
  }

  .hljs-strong {
    font-weight: bold;
  }

  .hljs-link {
    text-decoration: underline;
  }

  .editor-mount .ProseMirror code,
  .source-editor {
    font-family: var(--editor-code-font-family);
    font-variant-ligatures: none;
  }

  .editor-mount .ProseMirror table {
    table-layout: fixed;
  }

  .editor-mount .ProseMirror th,
  .editor-mount .ProseMirror td {
    border: 1px solid var(--editor-border-color);
    padding: 0.5em;
    overflow-wrap: anywhere;
  }

  .source-editor {
    min-height: 100%;
    padding: 10px;
    line-height: 1.5;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }
`;

function initializeWysiwygMarkdownEditor() {
  if (!markdownEditor || typeof markdownEditor.setMode !== 'function') {
    return false;
  }

  markdownEditor.sourceEditScope = 'document';
  markdownEditor.themeCss = SIDENOTE_EDITOR_THEME;
  markdownEditor.codeHighlighter = highlightCode;

  markdownEditor.uploadImage = async (file) => {
    const imageId = crypto.randomUUID();
    await saveImage(imageId, file);
    return `images/${imageId}.png`;
  };

  markdownEditor.imageResolver = async (source) => {
    const match = INTERNAL_IMAGE_PATTERN.exec(source);
    if (!match) {
      return source;
    }

    const image = await getImage(match[1]);
    return image ? URL.createObjectURL(image) : null;
  };

  markdownEditor.transformPastedText = (text) => processPastedText(
    text,
    resolveLegacyTextProcessingSettings(globalSettings)
  );

  return true;
}

function setEditorMode(mode) {
  if (typeof markdownEditor?.setMode === 'function') {
    markdownEditor.setMode(mode);
  }
}

export {
  initializeWysiwygMarkdownEditor,
  setEditorMode
};
