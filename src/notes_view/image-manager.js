// Import required DOM elements
import {
  imageList,
  htmlPreview
} from '../dom.js';

// Import required functions from other modules
import { getAllImageObjectsFromDB, deleteImage } from '../database/index.js';

// Import state from state module
import { 
  notes,
  globalSettings
} from '../state.js';

// Import note renderer for opening notes
import { openNote } from './note-renderer.js';

/**
 * Shows an image in a modal.
 * @param {string} blobUrl The blob URL of the image to show.
 */
// === 이미지 모달 ===

function showImageModal(blobUrl) {
  // 모달 배경 생성
  const modal = document.createElement('div');
  modal.classList.add('image-preview-modal');
  modal.style.position = 'fixed';
  modal.style.left = '0';
  modal.style.top = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
  modal.style.display = 'flex';
  modal.style.boxSizing = 'border-box';
  modal.style.padding = '10%';
  modal.style.zIndex = '1000';
  // 배경 클릭 시 닫기
  modal.onclick = (event) => {
      if (event.target === modal) {
          document.body.removeChild(modal);
      }
  };

  const modalImg = document.createElement('img');
  modalImg.src = blobUrl;
  
  let zoomState = 0; // 0: 화면에 맞춤, 1: 원본 크기
  
  modalImg.onload = () => {
      const naturalWidth = modalImg.naturalWidth;
      const naturalHeight = modalImg.naturalHeight;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const paddingPercent = 0.1; // 10% padding
      const availableWidth = viewportWidth * (1 - 2 * paddingPercent);
      const availableHeight = viewportHeight * (1 - 2 * paddingPercent);
      
      const setZoomState = (state) => {
          if (state === 0) { // Fit with 10% L/R padding, minimum 10% T/B padding
              modal.style.justifyContent = 'center';
              modal.style.alignItems = 'center';
              modal.style.overflow = 'auto';
              modalImg.style.cursor = 'zoom-in';
              
              // Try to fit to width with 10% left/right margins
              const scaleWidth = availableWidth / naturalWidth;
              const scaledHeight = naturalHeight * scaleWidth;
              
              // Check if scaled height fits within available height (10% top/bottom margins)
              let finalScale;
              if (scaledHeight <= availableHeight) {
                  // Image fits with width-based scaling
                  finalScale = scaleWidth;
              } else {
                  // Image is too tall, scale down to maintain 10% top/bottom margins
                  finalScale = availableHeight / naturalHeight;
              }
              
              modalImg.style.width = (naturalWidth * finalScale) + 'px';
              modalImg.style.height = (naturalHeight * finalScale) + 'px';
              modalImg.style.maxWidth = 'none';
              modalImg.style.maxHeight = 'none';
          } else { // state === 1, Enlarge with 10% padding on all sides
              modal.style.overflow = 'auto';
              modalImg.style.cursor = 'zoom-out';
              
              // Calculate scale to fit with 10% margins on all sides
              const scaleWidth = availableWidth / naturalWidth;
              const scaleHeight = availableHeight / naturalHeight;
              const scale = Math.min(scaleWidth, scaleHeight);
              
              // For small images: scale up to use available space with 10% margins
              // For large images: show at natural size (never scale down below 1.0)
              const finalScale = Math.max(1.0, scale);
              
              const finalWidth = naturalWidth * finalScale;
              const finalHeight = naturalHeight * finalScale;
              
              // If scaled image fits within available space: center it
              // If scaled image is larger: align to top-left for proper scrolling
              if (finalWidth <= availableWidth && finalHeight <= availableHeight) {
                  modal.style.justifyContent = 'center';
                  modal.style.alignItems = 'center';
              } else {
                  modal.style.justifyContent = 'flex-start';
                  modal.style.alignItems = 'flex-start';
              }
              
              modalImg.style.width = finalWidth + 'px';
              modalImg.style.height = finalHeight + 'px';
              modalImg.style.maxWidth = 'none';
              modalImg.style.maxHeight = 'none';
          }
      };

      setZoomState(zoomState);
      
      modalImg.onclick = () => {
          zoomState = (zoomState + 1) % 2;
          setZoomState(zoomState);
      };
  };

  modal.appendChild(modalImg);
  document.body.appendChild(modal);
}

/**
 * Renders the list of images.
 */
// === 이미지 관리 화면 렌더링 ===

async function renderImagesList() {
  imageList.innerHTML = '';
  try {
    const imageObjects = await getAllImageObjectsFromDB();
    // 모든 노트 내용을 합쳐서 이미지 사용 여부 확인
    const allNoteContent = notes.map(n => n.content).join('\n');

    const activeImages = imageObjects.filter(img => !img.deletedAt);

    for (const imageObject of activeImages) {
      const imageId = imageObject.id;
      const li = document.createElement('li');
      li.dataset.imageId = imageId;

      const imageInfo = document.createElement('div');
      imageInfo.classList.add('image-info');

      const img = document.createElement('img');
      const imageBlob = imageObject.blob;
      if (imageBlob) {
        const blobUrl = URL.createObjectURL(imageBlob);
        img.src = blobUrl;
        img.onclick = () => showImageModal(blobUrl);
      }
      imageInfo.appendChild(img);

      const imageName = document.createElement('span');
      imageName.classList.add('image-name');
      imageName.textContent = `image_${imageId.substring(0, 8)}.png`;
      
      // 이미지 이름 클릭 시 드롭다운 메뉴
      imageName.onclick = (e) => {
        e.stopPropagation();
        const currentTarget = e.currentTarget;
        const isAlreadyOpen = currentTarget.querySelector('.image-title-dropdown');

        // 모든 드롭다운 닫기
        const allImageDropdowns = document.querySelectorAll('.image-title-dropdown');
        const allNotesDropdowns = document.querySelectorAll('.notes-dropdown');
        allImageDropdowns.forEach(d => d.remove());
        allNotesDropdowns.forEach(d => d.remove());

        if (!isAlreadyOpen) {
          // Create and show the new dropdown
          const dropdown = document.createElement('div');
          dropdown.classList.add('image-title-dropdown');
          
          // Close dropdown when clicking on empty area of dropdown
          dropdown.onclick = (e) => {
            if (e.target === dropdown) {
              dropdown.remove();
            }
          };
          
          const copyMarkdownItem = document.createElement('div');
          copyMarkdownItem.textContent = 'Copy Image Markdown';
          copyMarkdownItem.onclick = async (e) => {
            e.stopPropagation();
            const markdownText = `![Image](images/${imageId}.png)`;
            try {
              await navigator.clipboard.writeText(markdownText);
              dropdown.remove();
            } catch (err) {
              console.error('Failed to copy to clipboard:', err);
              // Fallback for older browsers
              const textArea = document.createElement('textarea');
              textArea.value = markdownText;
              document.body.appendChild(textArea);
              textArea.select();
              document.execCommand('copy');
              document.body.removeChild(textArea);
              dropdown.remove();
            }
          };
          
          dropdown.appendChild(copyMarkdownItem);
          currentTarget.appendChild(dropdown);
        }
      };
      
      imageInfo.appendChild(imageName);

      li.appendChild(imageInfo);

      // 사용 여부 표시 아이콘
      const usageIcon = document.createElement('span');
      usageIcon.classList.add('usage-icon');
      const isUsed = allNoteContent.includes(imageId);
      const notesUsingImage = isUsed ? notes.filter(n => n.content.includes(imageId)) : [];
      
      usageIcon.textContent = isUsed ? '✅' : '❌';
      usageIcon.title = isUsed ? 'Image is used in one or more notes' : 'Image is not used in any note';
      
      if (isUsed) {
        usageIcon.onclick = (e) => {
          e.stopPropagation();
          const currentTarget = e.currentTarget;
          const isAlreadyOpen = currentTarget.querySelector('.notes-dropdown');

          // Close all dropdowns (both notes and image title dropdowns)
          const allNotesDropdowns = document.querySelectorAll('.notes-dropdown');
          const allImageDropdowns = document.querySelectorAll('.image-title-dropdown');
          allNotesDropdowns.forEach(d => d.remove());
          allImageDropdowns.forEach(d => d.remove());

          if (!isAlreadyOpen) {
            // Create and show the new dropdown.
            const dropdown = document.createElement('div');
            dropdown.classList.add('notes-dropdown');
            notesUsingImage.forEach(note => {
              const noteItem = document.createElement('div');
              noteItem.textContent = note.title;
              noteItem.onclick = () => {
                openNote(note.id, false);
                setTimeout(() => {
                  const imageInNote = htmlPreview.querySelector(`img[data-image-id="${imageId}"]`);
                  if (imageInNote) {
                    imageInNote.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }, 200); // Delay to allow rendering
              };
              dropdown.appendChild(noteItem);
            });
            currentTarget.appendChild(dropdown);
          }
        };
      }

      li.appendChild(usageIcon);

      const deleteIcon = document.createElement('span');
      deleteIcon.textContent = '🗑️';
      deleteIcon.classList.add('delete-image-icon');
      deleteIcon.title = 'Move Image to Recycle Bin';
      deleteIcon.onclick = async (e) => {
        e.stopPropagation();
        // 사용 중인 이미지 삭제 방지 설정 확인
        if (globalSettings.preventUsedImageDeletion && isUsed) {
            return;
        }
        try {
          await deleteImage(imageId);
          renderImagesList(); // 목록 새로고침
        } catch (err) {
          console.error('Failed to delete image:', err);
        }
      };
      li.appendChild(deleteIcon);

      imageList.appendChild(li);
    }
  } catch (err) {
    console.error('Failed to render image list:', err);
    imageList.innerHTML = '<li>Error loading images. See console for details.</li>';
  }
}

// Export functions
export {
  showImageModal,
  renderImagesList
};