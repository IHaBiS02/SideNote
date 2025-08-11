// Import required DOM elements
import {
  deletedItemsList
} from '../dom.js';

// Import required functions from other modules
import { 
  restoreNote, 
  deleteNotePermanently 
} from '../notes.js';

import { getAllImageObjectsFromDB, deleteImage } from '../database.js';

// Import state from state module
import { 
  deletedNotes
} from '../state.js';

// Import image modal function
import { showImageModal } from './image-manager.js';

/**
 * Renders the list of deleted items.
 */
// === 휴지통 항목 렌더링 ===

async function renderDeletedItemsList() {
  deletedItemsList.innerHTML = '';

  // 1. 삭제된 노트와 이미지 가져오기
  const deletedImageObjects = (await getAllImageObjectsFromDB()).filter(img => img.deletedAt);
  
  // 2. 노트와 이미지를 합쳐서 정렬
  const deletedItems = [
    ...deletedNotes.map(n => ({ ...n, type: 'note', deletedAt: n.metadata.deletedAt })),
    ...deletedImageObjects.map(i => ({ ...i, type: 'image', deletedAt: i.deletedAt }))
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

      const deletionDate = new Date(item.deletedAt + 30 * 24 * 60 * 60 * 1000);
      const deletionDateSpan = document.createElement('span');
      deletionDateSpan.textContent = `Deletes on: ${deletionDate.toLocaleString()}`;
      deletionDateSpan.classList.add('deletion-date');
      itemInfo.appendChild(deletionDateSpan);
    } else { // type === 'image'
      itemInfo.classList.add('image-info');
      const img = document.createElement('img');
      const imageBlob = item.blob;
      if (imageBlob) {
          const blobUrl = URL.createObjectURL(imageBlob);
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

      const deletionDate = new Date(item.deletedAt + 30 * 24 * 60 * 60 * 1000);
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
    restoreSpan.addEventListener('click', (e) => {
      e.stopPropagation();
      if (item.type === 'note') {
        restoreNote(item.id);
      } else {
        restoreImage(item.id).then(renderDeletedItemsList);
      }
    });

    const deleteSpan = document.createElement('span');
    deleteSpan.textContent = '🗑️';
    deleteSpan.title = `Delete ${item.type === 'note' ? 'Note' : 'Image'} Permanently`;
    deleteSpan.classList.add('delete-item-icon');
    deleteSpan.addEventListener('click', (e) => {
      e.stopPropagation();
      if (item.type === 'note') {
        deleteNotePermanently(item.id);
      } else {
        deleteImagePermanently(item.id).then(renderDeletedItemsList);
      }
    });

    li.appendChild(itemInfo);
    buttonContainer.appendChild(restoreSpan);
    buttonContainer.appendChild(deleteSpan);
    li.appendChild(buttonContainer);
    deletedItemsList.appendChild(li);
  });
}

// We need to import these functions that are not yet defined in database.js
// These are placeholders - they should be imported from the correct module
const restoreImage = async (id) => {
  // This function should be imported from database.js or implemented there
  console.warn('restoreImage function not implemented');
};

const deleteImagePermanently = async (id) => {
  // This function should be imported from database.js or implemented there
  console.warn('deleteImagePermanently function not implemented');
};

// Export functions
export {
  renderDeletedItemsList
};