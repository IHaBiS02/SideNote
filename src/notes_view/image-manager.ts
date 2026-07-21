// Import required DOM elements
import {
  imageList,
  markdownEditor
} from '../dom.js';

// Import required functions from other modules
import { getAllImageObjectsFromDB, deleteImage } from '../database/index.js';
import { createBlobUrlTracker, extractImageIds } from '../utils.js';
import { normalizeGlobalSettings } from '../settings.js';

// Import state from state module
import {
  notes,
  globalSettings
} from '../state.js';

// Import note renderer for opening notes
import { openNote } from './note-renderer.js';

// Import image modal
import { showImageModal } from './image-modal.js';
import type { Note } from '../types.js';

const imageListBlobUrls = createBlobUrlTracker();

/**
 * Renders the list of images.
 */
async function renderImagesList(): Promise<void> {
  imageListBlobUrls.revokeAll();
  imageList.innerHTML = '';
  try {
    const imageObjects = await getAllImageObjectsFromDB();
    const imageUsageMap = new Map<string, Note[]>();
    for (const note of notes) {
      for (const imageId of extractImageIds(note.content || '')) {
        if (!imageUsageMap.has(imageId)) {
          imageUsageMap.set(imageId, []);
        }
        imageUsageMap.get(imageId)?.push(note);
      }
    }

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
        const blobUrl = imageListBlobUrls.create(imageBlob);
        img.src = blobUrl;
        img.onclick = () => showImageModal(blobUrl);
      }
      imageInfo.appendChild(img);

      const imageName = document.createElement('span');
      imageName.classList.add('image-name');
      imageName.textContent = `image_${imageId.substring(0, 8)}.png`;

      imageName.onclick = (e) => {
        e.stopPropagation();
        const currentTarget = e.currentTarget as HTMLElement;
        const isAlreadyOpen = currentTarget.querySelector('.image-title-dropdown');

        const allImageDropdowns = document.querySelectorAll('.image-title-dropdown');
        const allNotesDropdowns = document.querySelectorAll('.notes-dropdown');
        allImageDropdowns.forEach(d => d.remove());
        allNotesDropdowns.forEach(d => d.remove());

        if (!isAlreadyOpen) {
          const dropdown = document.createElement('div');
          dropdown.classList.add('image-title-dropdown');

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

      const usageIcon = document.createElement('span');
      usageIcon.classList.add('usage-icon');
      const notesUsingImage = imageUsageMap.get(imageId) || [];
      const isUsed = notesUsingImage.length > 0;

      usageIcon.textContent = isUsed ? '✅' : '❌';
      usageIcon.title = isUsed ? 'Image is used in one or more notes' : 'Image is not used in any note';

      if (isUsed) {
        usageIcon.onclick = (e) => {
          e.stopPropagation();
          const currentTarget = e.currentTarget as HTMLElement;
          const isAlreadyOpen = currentTarget.querySelector('.notes-dropdown');

          const allNotesDropdowns = document.querySelectorAll('.notes-dropdown');
          const allImageDropdowns = document.querySelectorAll('.image-title-dropdown');
          allNotesDropdowns.forEach(d => d.remove());
          allImageDropdowns.forEach(d => d.remove());

          if (!isAlreadyOpen) {
            const dropdown = document.createElement('div');
            dropdown.classList.add('notes-dropdown');
            notesUsingImage.forEach(note => {
              const noteItem = document.createElement('div');
              noteItem.textContent = note.title;
              noteItem.onclick = () => {
                openNote(note.id, false);
                void markdownEditor.updateComplete.then(() => {
                  markdownEditor.scrollToImage(`images/${imageId}.png`);
                });
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
        if (normalizeGlobalSettings(globalSettings).preventUsedImageDeletion && isUsed) {
            return;
        }
        try {
          await deleteImage(imageId);
          renderImagesList();
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
