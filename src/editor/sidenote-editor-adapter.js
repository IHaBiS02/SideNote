import { getImage, saveImage } from '../database/index.js';
import { resolveLegacyTextProcessingSettings } from '../settings.js';
import { globalSettings } from '../state.js';
import { processPastedText } from '../text-processors.js';
import { markdownEditor } from '../dom.js';

const INTERNAL_IMAGE_PATTERN = /^images\/([^/]+)\.png$/;

function initializeWysiwygMarkdownEditor() {
  if (!markdownEditor || typeof markdownEditor.setMode !== 'function') {
    return false;
  }

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
