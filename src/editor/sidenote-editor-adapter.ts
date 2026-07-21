import { getImage, saveImage } from '../database/index.js';
import { resolveLegacyTextProcessingSettings } from '../settings.js';
import { globalSettings } from '../state.js';
import { processPastedText } from '../text-processors.js';
import { markdownEditor } from '../dom.js';
import type {
  CodeHighlightToken,
  EditorMode,
} from '../../packages/wysiwyg-markdown/src/index.js';

const INTERNAL_IMAGE_PATTERN = /^images\/([^/]+)\.png$/;

function highlightCode(
  code: string,
  requestedLanguage: string,
): CodeHighlightToken[] {
  if (
    !globalThis.hljs?.highlight
    || !globalThis.hljs?.highlightAuto
    || !globalThis.hljs?.getLanguage
  ) {
    return [];
  }

  let highlighted: string;
  if (!requestedLanguage) {
    highlighted = globalThis.hljs.highlightAuto(code).value;
  } else if (globalThis.hljs.getLanguage(requestedLanguage)) {
    highlighted = globalThis.hljs.highlight(code, {
      language: requestedLanguage,
      ignoreIllegals: true
    }).value;
  } else {
    return [];
  }
  const template = document.createElement('template');
  template.innerHTML = highlighted;
  const ranges: CodeHighlightToken[] = [];
  let offset = 0;

  function visit(node: Node): void {
    if (node.nodeType === Node.TEXT_NODE) {
      offset += node.textContent?.length ?? 0;
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const element = node as Element;
    const start = offset;
    Array.from(element.childNodes).forEach(visit);
    const className = Array.from(element.classList)
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
    padding: var(--editor-padding);
    font-family: sans-serif;
    line-height: inherit;
    overflow-wrap: anywhere;
    word-break: break-word;
  }

  .editor-mount .ProseMirror p {
    line-height: inherit;
  }

  .editor-mount .ProseMirror a {
    color: var(--editor-link-color);
    text-decoration: none;
  }

  .editor-mount .ProseMirror a:visited {
    color: var(--editor-link-visited-color);
  }

  .editor-mount .ProseMirror a:hover {
    color: var(--editor-link-hover-color);
    text-decoration: underline;
  }

  .editor-mount .ProseMirror a:active {
    color: var(--editor-link-active-color);
  }

  .editor-mount .ProseMirror blockquote {
    margin-left: 0;
    padding-left: 10px;
    border-left: 4px solid var(--editor-border-color);
  }

  .editor-mount .ProseMirror :not(pre) > code {
    border: 1px solid var(--editor-inline-code-border);
    border-radius: 4px;
    padding: 2px 4px;
    background: var(--editor-inline-code-background);
  }

  .editor-mount .ProseMirror ul,
  .editor-mount .ProseMirror ol {
    padding-left: 15px;
  }

  .editor-mount .ProseMirror li[data-task] {
    display: list-item;
    list-style: none;
  }

  .editor-mount .ProseMirror li[data-task] > input {
    display: inline-block;
    width: auto;
    height: auto;
    margin: 0 5px 0 0;
    accent-color: var(--editor-checkbox-accent);
    vertical-align: middle;
  }

  .editor-mount .ProseMirror .task-content {
    display: inline;
  }

  .editor-mount .ProseMirror .task-content > p {
    display: inline;
  }

  .editor-mount .ProseMirror li[data-checked="true"] .task-content {
    opacity: 1;
    text-decoration: none;
  }

  .editor-mount .ProseMirror pre {
    max-width: 100%;
    overflow-x: hidden;
    border: 0;
    padding: 0;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    word-break: break-all;
    background: var(--editor-code-background);
    color: var(--editor-code-color);
  }

  .editor-mount .ProseMirror pre code {
    display: block;
    min-height: 100%;
    padding: var(--editor-code-content-padding);
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

  .editor-mount .ProseMirror .code-block-content {
    border: 1px solid var(--editor-border-color);
    background: var(--editor-code-background);
  }

  .editor-mount .ProseMirror pre.code-line-numbers {
    border-right: 1px solid var(--editor-border-color);
    padding: 0;
    color: var(--editor-code-line-number-color);
    font-family: var(--editor-code-font-family);
    line-height: inherit;
    text-align: right;
    vertical-align: top;
    white-space: pre;
    word-break: keep-all;
    user-select: none;
  }

  .editor-mount .ProseMirror pre.code-line-numbers code {
    padding: var(--editor-code-content-padding);
    background: transparent;
    color: inherit;
    font: inherit;
    line-height: inherit;
    white-space: inherit;
    word-break: inherit;
  }

  .editor-mount .ProseMirror .code-block-content[data-line-numbers] > pre {
    padding-block: var(--editor-code-content-padding);
  }

  .editor-mount .ProseMirror .code-block-content[data-line-numbers] {
    column-gap: var(--editor-code-content-padding);
  }

  .editor-mount .ProseMirror .code-block-content[data-line-numbers] > pre > code {
    padding-block: 0;
    line-height: 1.2;
  }

  .editor-mount .ProseMirror .code-block-content[data-line-numbers]
    > pre.code-block-body > code {
    padding-inline: 0 var(--editor-code-content-padding);
  }

  .code-block-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 26px;
    border: 1px solid var(--editor-border-color);
    border-bottom: 0;
    padding: 3px 5px;
    background: var(--editor-code-header-background);
    color: var(--editor-code-header-color);
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
    background: var(--editor-copy-hover-background);
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
  }

  .editor-mount .ProseMirror table {
    width: auto;
    margin: 0;
    border-collapse: separate;
    border-spacing: 2px;
    table-layout: auto;
  }

  .editor-mount .ProseMirror th,
  .editor-mount .ProseMirror td {
    min-width: 0;
    border: 0;
    padding: 1px;
    overflow-wrap: anywhere;
  }

  .editor-mount .ProseMirror th {
    background: transparent;
  }

  .source-editor {
    min-height: 100%;
    padding: var(--editor-padding);
    line-height: 1.5;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }

  .surface::-webkit-scrollbar,
  .editor-mount::-webkit-scrollbar,
  .source-editor::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  .surface::-webkit-scrollbar-track,
  .editor-mount::-webkit-scrollbar-track,
  .source-editor::-webkit-scrollbar-track {
    background: var(--editor-scrollbar-track);
  }

  .surface::-webkit-scrollbar-thumb,
  .editor-mount::-webkit-scrollbar-thumb,
  .source-editor::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background: var(--editor-scrollbar-thumb);
  }

  .surface::-webkit-scrollbar-thumb:hover,
  .editor-mount::-webkit-scrollbar-thumb:hover,
  .source-editor::-webkit-scrollbar-thumb:hover {
    background: var(--editor-scrollbar-thumb-hover);
  }
`;

function initializeWysiwygMarkdownEditor(): boolean {
  if (!markdownEditor || typeof markdownEditor.setMode !== 'function') {
    return false;
  }

  markdownEditor.sourceEditScope = 'document';
  markdownEditor.showCodeLineNumbers = true;
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

function setEditorMode(mode: EditorMode): void {
  if (typeof markdownEditor?.setMode === 'function') {
    markdownEditor.setMode(mode);
  }
}

export {
  initializeWysiwygMarkdownEditor,
  setEditorMode
};
