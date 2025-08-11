// Import required DOM elements
import {
  markdownEditor,
  htmlPreview,
  toggleViewButton
} from '../dom.js';

// Import required functions from other modules
import { pushToHistory } from '../history.js';
import { getImage } from '../database/index.js';

// Import state from state module
import { 
  activeNoteId,
  isPreview,
  setIsPreview
} from '../state.js';

/**
 * Renders the markdown content as HTML.
 */
// === 마크다운 렌더링 ===

function renderMarkdown() {
  // 커스텀 렌더러 설정 (체크박스 지원)
  const renderer = new marked.Renderer();
  renderer.listitem = function(text, task, checked) {
    if (task) {
      return '<li class="task-list-item">' + text + '</li>';
    }
    return '<li>' + text + '</li>';
  };
  renderer.checkbox = function(checked) {
    return `<input type="checkbox" ${checked ? 'checked' : ''}>`;
  };

  // marked 옵션 설정
  marked.setOptions({
    gfm: true,        // GitHub Flavored Markdown 사용
    renderer: renderer,
    highlight: function(code, lang) {
      // 코드 하이라이팅 (highlight.js 사용)
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    }
  });

  const dirtyHtml = marked.parse(markdownEditor.value);
  htmlPreview.innerHTML = DOMPurify.sanitize(dirtyHtml, {
    ADD_TAGS: ['pre', 'code', 'span'],
    ADD_ATTR: ['class']
  });
  // 코드 블록에 줄 번호 추가
  htmlPreview.querySelectorAll('pre code').forEach((block) => {
    // 줄 수 계산
    const lineCount = block.textContent.split('\n').length;
    // 줄 수에 따라 다른 스타일 적용
    if (lineCount === 2) {
      block.parentElement.classList.add('single-line-code');
    } else {
      block.parentElement.classList.add('multi-line-code');
    }

    // 줄 번호 추가
    hljs.lineNumbersBlock(block);
  });
  hljs.highlightAll();

  renderImages();
}

/**
 * Renders images in the preview.
 */
// === 이미지 렌더링 ===

async function renderImages() {
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
          const blobUrl = URL.createObjectURL(imageBlob);
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
function togglePreview() {
  setIsPreview(!isPreview);
  if (isPreview) {
    // 미리보기 모드로 전환
    renderMarkdown();
    htmlPreview.style.display = 'block';
    markdownEditor.style.display = 'none';
    toggleViewButton.textContent = 'Edit';
  } else {
    // 편집 모드로 전환
    htmlPreview.style.display = 'none';
    markdownEditor.style.display = 'block';
    toggleViewButton.textContent = 'Preview';
    markdownEditor.focus();
  }
  pushToHistory({ view: 'editor', params: { noteId: activeNoteId, inEditMode: !isPreview } });
}

// Export functions
export {
  renderMarkdown,
  renderImages,
  togglePreview
};