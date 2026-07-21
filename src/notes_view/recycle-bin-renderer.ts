// Import required DOM elements
import {
  deletedItemsList
} from '../dom.js';

// Import required functions from other modules
import { 
  restoreNote, 
  deleteNotePermanently 
} from '../notes.js';

import { getAllImageObjectsFromDB, restoreImage, deleteImagePermanently } from '../database/index.js';

// Import state from state module
import {
  deletedNotes
} from '../state.js';

import { THIRTY_DAYS_MS } from '../constants.js';
import { createBlobUrlTracker } from '../utils.js';

// Import image modal function
import { showImageModal } from './image-manager.js';
import type { Note, StoredImage } from '../types.js';

type DeletedNoteItem = Note & {
  type: 'note';
  deletedAt: number;
};

type DeletedImageItem = StoredImage & {
  type: 'image';
  deletedAt: number;
};

type DeletedItem = DeletedNoteItem | DeletedImageItem;

const recycleBinBlobUrls = createBlobUrlTracker();

/**
 * Renders the list of deleted items.
 */
// === 휴지통 항목 렌더링 ===

async function renderDeletedItemsList(): Promise<void> {
  recycleBinBlobUrls.revokeAll();
  deletedItemsList.innerHTML = '';

  // 1. 삭제된 노트와 이미지 가져오기
  const deletedImageObjects = (await getAllImageObjectsFromDB()).filter(img => img.deletedAt);
  
  // 2. 노트와 이미지를 합쳐서 정렬
  const deletedItems: DeletedItem[] = [
    ...deletedNotes.map(n => ({
      ...n,
      type: 'note' as const,
      deletedAt: n.metadata.deletedAt as number,
    })),
    ...deletedImageObjects.map(i => ({
      ...i,
      type: 'image' as const,
      deletedAt: i.deletedAt as number,
    }))
  ];
  deletedItems.sort((a, b) => b.deletedAt - a.deletedAt);

  // 3. Render list
  deletedItems.forEach(item => {
    const li = document.createElement('li');
    li.dataset.itemId = item.id;
    li.dataset.itemType = item.type;

    const itemInfo = document.createElement('div');
    itemInfo.classList.add('item-info');

    if (item.type === 'note') {
      itemInfo.classList.add('note-info');
      const titleSpan = document.createElement('span');
      titleSpan.textContent = item.title;
      itemInfo.appendChild(titleSpan);

      const deletionDate = new Date(item.deletedAt + THIRTY_DAYS_MS);
      const deletionDateSpan = document.createElement('span');
      deletionDateSpan.textContent = `Deletes on: ${deletionDate.toLocaleString()}`;
      deletionDateSpan.classList.add('deletion-date');
      itemInfo.appendChild(deletionDateSpan);
    } else { // type === 'image'
      itemInfo.classList.add('image-info');
      const img = document.createElement('img');
      const imageBlob = item.blob;
      if (imageBlob) {
          const blobUrl = recycleBinBlobUrls.create(imageBlob);
          img.src = blobUrl;
          img.onclick = () => showImageModal(blobUrl);
      }
      itemInfo.appendChild(img);

      const textContainer = document.createElement('div');
      textContainer.classList.add('text-container');

      const imageName = document.createElement('span');
      imageName.classList.add('image-name');
      imageName.textContent = `image_${item.id.substring(0, 8)}.png`;
      textContainer.appendChild(imageName);

      const deletionDate = new Date(item.deletedAt + THIRTY_DAYS_MS);
      const deletionDateSpan = document.createElement('span');
      deletionDateSpan.textContent = `Deletes on: ${deletionDate.toLocaleString()}`;
      deletionDateSpan.classList.add('deletion-date');
      textContainer.appendChild(deletionDateSpan);

      itemInfo.appendChild(textContainer);
    }

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');

    const restoreSpan = document.createElement('span');
    restoreSpan.textContent = '♻️';
    restoreSpan.title = `Restore ${item.type === 'note' ? 'Note' : 'Image'}`;
    restoreSpan.classList.add('restore-item-icon');
    restoreSpan.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (item.type === 'note') {
        await restoreNote(item.id);
        renderDeletedItemsList();
      } else {
        await restoreImage(item.id);
        renderDeletedItemsList();
      }
    });

    const deleteSpan = document.createElement('span');
    deleteSpan.textContent = '🗑️';
    deleteSpan.title = `Delete ${item.type === 'note' ? 'Note' : 'Image'} Permanently`;
    deleteSpan.classList.add('delete-item-icon');
    deleteSpan.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (item.type === 'note') {
        await deleteNotePermanently(item.id);
        renderDeletedItemsList();
      } else {
        await deleteImagePermanently(item.id);
        renderDeletedItemsList();
      }
    });

    li.appendChild(itemInfo);
    buttonContainer.appendChild(restoreSpan);
    buttonContainer.appendChild(deleteSpan);
    li.appendChild(buttonContainer);
    deletedItemsList.appendChild(li);
  });
}


// Export functions
export {
  renderDeletedItemsList
};
