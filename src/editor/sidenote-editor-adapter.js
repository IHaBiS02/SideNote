import { getImage, saveImage } from '../database/index.js';
import { resolveLegacyTextProcessingSettings } from '../settings.js';
import { globalSettings } from '../state.js';
import { processPastedText } from '../text-processors.js';
import { markdownEditor } from '../dom.js';

const INTERNAL_IMAGE_PATTERN = /^images\/([^/]+)\.png$/;

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
  }

  .editor-mount .ProseMirror pre code {
    display: block;
    padding: 0;
    white-space: inherit;
    overflow-wrap: inherit;
    word-break: inherit;
  }

  .editor-mount .ProseMirror code,
  .source-editor {
    font-family: monospace;
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
