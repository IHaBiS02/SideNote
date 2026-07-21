import { markdownEditor, toggleViewButton } from '../dom.js';
import { pushToHistory, getHistory, getHistoryIndex, moveBack } from '../history.js';
import { normalizeGlobalSettings } from '../settings.js';
import {
  activeNoteId,
  globalSettings,
  isPreview,
  setIsPreview,
} from '../state.js';

/** Applies the current Preview/Edit state to the shared editor component. */
function applyEditorDisplayMode(): void {
  markdownEditor.style.display = 'block';

  if (isPreview) {
    markdownEditor.setMode?.(
      normalizeGlobalSettings(globalSettings).wysiwygPreview ? 'wysiwyg' : 'readonly',
    );
    toggleViewButton.textContent = 'Edit';
    return;
  }

  markdownEditor.setMode?.('source');
  toggleViewButton.textContent = 'Preview';
  markdownEditor.focus();
}

/** Toggles between the configured Preview mode and full-document source mode. */
function togglePreview(): void {
  const wasEditMode = !isPreview;
  setIsPreview(!isPreview);
  applyEditorDisplayMode();

  if (wasEditMode && isPreview) {
    const history = getHistory();
    const currentIndex = getHistoryIndex();
    const previousNode = currentIndex > 0 ? history[currentIndex - 1] : undefined;
    if (
      previousNode?.view === 'editor'
      && previousNode.params?.noteId === activeNoteId
      && !previousNode.params.inEditMode
    ) {
      moveBack();
      return;
    }
  }

  pushToHistory({
    view: 'editor',
    params: { noteId: activeNoteId, inEditMode: !isPreview },
  });
}

export { applyEditorDisplayMode, togglePreview };
