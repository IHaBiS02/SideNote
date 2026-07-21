// Import required DOM elements
import {
  markdownEditor,
  htmlPreview,
  toggleViewButton
} from '../dom.js';

// Import required functions from other modules
import { pushToHistory, getHistory, getHistoryIndex, moveBack } from '../history.js';
import { getImage } from '../database/index.js';
import { createBlobUrlTracker } from '../utils.js';
import { isCodeBlockHeaderEnabled, normalizeGlobalSettings } from '../settings.js';

// Import state from state module
import { 
  activeNoteId,
  globalSettings,
  isPreview,
  notes,
  setIsPreview
} from '../state.js';
import type { Note } from '../types.js';

const previewBlobUrls = createBlobUrlTracker();

/**
 * Renders the markdown content as HTML.
 */
// === 마크다운 렌더링 ===

function getCodeBlockLanguage(block: Element): string {
  const languageClass = Array.from(block.classList).find((className) => className.startsWith('language-'));
  if (!languageClass) {
    return 'text';
  }

  return languageClass.replace('language-', '') || 'text';
}

async function copyTextToClipboard(text: string): Promise<void> {
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.top = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
  } finally {
    document.body.removeChild(textarea);
  }
}

function showCopyFeedback(button: HTMLButtonElement, text: string): void {
  const originalText = button.dataset.defaultText || button.textContent;
  button.textContent = text;
  setTimeout(() => {
    button.textContent = originalText;
  }, 1000);
}

function addCodeBlockHeader(
  block: Element,
  language: string,
  codeText: string,
): void {
  const pre = block.parentElement;
  if (!pre || pre.classList.contains('code-block-body')) {
    return;
  }

  const container = document.createElement('div');
  container.className = 'code-block-container';

  const header = document.createElement('div');
  header.className = 'code-block-header';

  const languageLabel = document.createElement('span');
  languageLabel.className = 'code-block-language';
  languageLabel.textContent = language;

  const copyButton = document.createElement('button');
  copyButton.type = 'button';
  copyButton.className = 'copy-code-button';
  copyButton.title = 'Copy code';
  copyButton.setAttribute('aria-label', 'Copy code');
  copyButton.textContent = '📄';
  copyButton.dataset.defaultText = copyButton.textContent;
  copyButton.addEventListener('click', async (e) => {
    e.stopPropagation();
    try {
      await copyTextToClipboard(codeText);
      showCopyFeedback(copyButton, '✓');
    } catch (err) {
      console.error('Failed to copy code block:', err);
      showCopyFeedback(copyButton, '!');
    }
  });

  header.appendChild(languageLabel);
  header.appendChild(copyButton);

  pre.classList.add('code-block-body');
  pre.parentNode?.insertBefore(container, pre);
  container.appendChild(header);
  container.appendChild(pre);
}

function getActiveNote(): Note | undefined {
  return notes.find(note => note.id === activeNoteId);
}

function configureMarkdownRenderer(): void {
  // 커스텀 렌더러 설정 (체크박스 지원)
  const renderer = new marked.Renderer();
  renderer.listitem = function(text: unknown, task: unknown) {
    if (task) {
      return '<li class="task-list-item">' + String(text) + '</li>';
    }
    return '<li>' + String(text) + '</li>';
  };
  renderer.checkbox = function(checked: unknown) {
    return `<input type="checkbox" ${checked ? 'checked' : ''}>`;
  };

  // marked 옵션 설정
  marked.setOptions({
    gfm: true,        // GitHub Flavored Markdown 사용
    breaks: !normalizeGlobalSettings(globalSettings).legacyLineBreakMode,
    renderer: renderer,
    highlight: function(code: string, lang: string) {
      // 코드 하이라이팅 (highlight.js 사용)
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    }
  });
}

function renderMarkdownToHtml(markdown: string): string {
  configureMarkdownRenderer();
  const dirtyHtml = marked.parse(markdown);
  return DOMPurify.sanitize(dirtyHtml, {
    ADD_TAGS: ['pre', 'code', 'span'],
    ADD_ATTR: ['class']
  });
}

function decorateCodeBlocks(
  container: ParentNode,
  note: Note | undefined = getActiveNote(),
): void {
  // 코드 블록에 줄 번호 추가
  container.querySelectorAll('pre code').forEach((block) => {
    const codeText = block.textContent ?? '';
    const language = getCodeBlockLanguage(block);

    // 줄 수 계산
    const lineCount = codeText.split('\n').length;
    // 줄 수에 따라 다른 스타일 적용
    if (lineCount === 2) {
      block.parentElement?.classList.add('single-line-code');
    } else {
      block.parentElement?.classList.add('multi-line-code');
    }

    if (isCodeBlockHeaderEnabled(note)) {
      addCodeBlockHeader(block, language, codeText);
    }

    // 줄 번호 추가
    hljs.lineNumbersBlock(block);
  });
  hljs.highlightAll();
}

function renderMarkdown(): void {
  htmlPreview.innerHTML = renderMarkdownToHtml(markdownEditor.value);
  decorateCodeBlocks(htmlPreview, getActiveNote());
  renderImages();
}

/**
 * Applies the current Preview/Edit state to the shared editor component.
 * Preview uses either the editable or read-only ProseMirror mode according to
 * the global preference; source mode always exposes the complete Markdown.
 */
function applyEditorDisplayMode(): void {
  htmlPreview.hidden = true;
  htmlPreview.setAttribute('aria-hidden', 'true');
  htmlPreview.style.display = 'none';
  markdownEditor.style.display = 'block';

  if (isPreview) {
    const previewMode = normalizeGlobalSettings(globalSettings).wysiwygPreview
      ? 'wysiwyg'
      : 'readonly';
    markdownEditor.setMode?.(previewMode);
    toggleViewButton.textContent = 'Edit';
    return;
  }

  markdownEditor.setMode?.('source');
  toggleViewButton.textContent = 'Preview';
  markdownEditor.focus();
}

/**
 * Renders images in the preview.
 */
// === 이미지 렌더링 ===

async function renderImages(): Promise<void> {
  previewBlobUrls.revokeAll();
  const images = htmlPreview.querySelectorAll('img');
  for (const img of images) {
    const src = img.getAttribute('src');
    // images/[id].png 형식의 내부 이미지 처리
    if (src && src.startsWith('images/')) {
      const imageId = src.substring(7, src.lastIndexOf('.'));
      img.dataset.imageId = imageId; // 스크롤용 data 속성 추가
      try {
        const imageBlob = await getImage(imageId);
        if (imageBlob) {
          const blobUrl = previewBlobUrls.create(imageBlob);
          img.src = blobUrl;
        } else {
          img.alt = `Image not found: ${imageId}`;
        }
      } catch (err) {
        console.error(`Failed to load image ${imageId} from DB:`, err);
        img.alt = `Error loading image: ${imageId}`;
      }
    }
  }
}

/**
 * Toggles between the editor and preview modes.
 */
// 편집/미리보기 모드 전환
function togglePreview(): void {
  const wasEditMode = !isPreview; // 전환 전 edit 모드 여부 저장
  setIsPreview(!isPreview);
  applyEditorDisplayMode();

  // History 처리: edit -> preview 전환 시 이전 노드가 preview면 돌아가기
  if (wasEditMode && isPreview) {
    // edit에서 preview로 전환하는 경우
    const history = getHistory();
    const currentIndex = getHistoryIndex();
    
    // 이전 history node가 존재하고, 같은 노트의 preview 모드인지 확인
    if (currentIndex > 0 && history[currentIndex - 1]) {
      const previousNode = history[currentIndex - 1];
      if (previousNode.view === 'editor' && 
          previousNode.params && 
          previousNode.params.noteId === activeNoteId && 
          !previousNode.params.inEditMode) {
        // 이전 노드가 같은 노트의 preview 모드면 뒤로 가기
        moveBack();
        return;
      }
    }
  }

  // 일반적인 경우: 새 history 항목 추가
  pushToHistory({ view: 'editor', params: { noteId: activeNoteId, inEditMode: !isPreview } });
}

// Export functions
export {
  configureMarkdownRenderer,
  renderMarkdownToHtml,
  decorateCodeBlocks,
  renderMarkdown,
  renderImages,
  applyEditorDisplayMode,
  togglePreview
};
