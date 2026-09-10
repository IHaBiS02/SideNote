import { getImage, saveImage } from '../database/index.js';
import { normalizeGlobalSettings, resolveLegacyTextProcessingSettings, } from '../settings.js';
import { globalSettings } from '../state.js';
import { processPastedText } from '../text-processors.js';
import { markdownEditor } from '../dom.js';
import { createNoteContentStyles } from './note-content-styles.js';
const INTERNAL_IMAGE_PATTERN = /^images\/([^/]+)\.png$/;
function highlightCode(code, requestedLanguage) {
    if (!globalThis.hljs?.highlight
        || !globalThis.hljs?.highlightAuto
        || !globalThis.hljs?.getLanguage) {
        return [];
    }
    let highlighted;
    if (!requestedLanguage) {
        highlighted = globalThis.hljs.highlightAuto(code).value;
    }
    else if (globalThis.hljs.getLanguage(requestedLanguage)) {
        highlighted = globalThis.hljs.highlight(code, {
            language: requestedLanguage,
            ignoreIllegals: true
        }).value;
    }
    else {
        return [];
    }
    const template = document.createElement('template');
    template.innerHTML = highlighted;
    const ranges = [];
    let offset = 0;
    function visit(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            offset += node.textContent?.length ?? 0;
            return;
        }
        if (node.nodeType !== Node.ELEMENT_NODE)
            return;
        const element = node;
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
  }

  ${createNoteContentStyles({
    rootSelector: '.editor-mount .ProseMirror',
    variableNamespace: 'editor',
    taskItemSelector: 'li[data-task]',
    taskContentSelector: '.task-content',
    checkedTaskSelector: 'li[data-checked="true"]',
    tableAlignmentSource: 'style',
})}

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
  }

  .editor-mount .ProseMirror pre.code-line-numbers {
    border-right: 1px solid var(--editor-border-color);
    padding: 0;
    color: var(--editor-code-line-number-color);
    font-family: var(--editor-code-font-family);
    line-height: var(--editor-code-line-height);
    text-align: right;
    vertical-align: top;
    white-space: pre;
    word-break: keep-all;
    user-select: none;
  }

  .editor-mount .ProseMirror pre.code-line-numbers code {
    background: transparent;
    color: inherit;
    font: inherit;
    line-height: inherit;
    white-space: inherit;
    word-break: inherit;
  }

  .editor-mount .ProseMirror
    .code-block-content[data-line-numbers] > pre {
    padding-block: var(--editor-code-content-padding);
  }

  .editor-mount .ProseMirror
    .code-block-content[data-line-numbers] > pre > code {
    padding-block: 0;
  }

  .editor-mount .ProseMirror pre.code-block-body,
  .editor-mount .ProseMirror pre.code-block-body > code {
    line-height: var(--editor-code-line-height);
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

  .source-editor {
    font-family: var(--editor-code-font-family);
  }

  .source-editor {
    min-height: 100%;
    padding: var(--editor-padding);
    line-height: var(--editor-source-line-height);
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
function initializeWysiwygMarkdownEditor() {
    if (!markdownEditor || typeof markdownEditor.setMode !== 'function') {
        return false;
    }
    markdownEditor.sourceEditScope = 'document';
    markdownEditor.showCodeLineNumbers = true;
    markdownEditor.preventExtraEmptyParagraphs =
        normalizeGlobalSettings(globalSettings).preventExtraEmptyParagraphs;
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
    markdownEditor.transformPastedText = (text) => processPastedText(text, resolveLegacyTextProcessingSettings(globalSettings));
    return true;
}
function setEditorMode(mode) {
    if (typeof markdownEditor?.setMode === 'function') {
        markdownEditor.setMode(mode);
    }
}
export { initializeWysiwygMarkdownEditor, setEditorMode };
