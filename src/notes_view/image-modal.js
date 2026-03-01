/**
 * Shows an image in a modal.
 * @param {string} blobUrl The blob URL of the image to show.
 */
function showImageModal(blobUrl) {
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
  modal.onclick = (event) => {
      if (event.target === modal) {
          document.body.removeChild(modal);
      }
  };

  const modalImg = document.createElement('img');
  modalImg.src = blobUrl;

  let zoomState = 0; // 0: fit to screen, 1: native size

  modalImg.onload = () => {
      const naturalWidth = modalImg.naturalWidth;
      const naturalHeight = modalImg.naturalHeight;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const paddingPercent = 0.1;
      const availableWidth = viewportWidth * (1 - 2 * paddingPercent);
      const availableHeight = viewportHeight * (1 - 2 * paddingPercent);

      const setZoomState = (state) => {
          if (state === 0) {
              modal.style.justifyContent = 'center';
              modal.style.alignItems = 'center';
              modal.style.overflow = 'auto';
              modalImg.style.cursor = 'zoom-in';

              const scaleWidth = availableWidth / naturalWidth;
              const scaledHeight = naturalHeight * scaleWidth;

              let finalScale;
              if (scaledHeight <= availableHeight) {
                  finalScale = scaleWidth;
              } else {
                  finalScale = availableHeight / naturalHeight;
              }

              modalImg.style.width = (naturalWidth * finalScale) + 'px';
              modalImg.style.height = (naturalHeight * finalScale) + 'px';
              modalImg.style.maxWidth = 'none';
              modalImg.style.maxHeight = 'none';
          } else {
              modal.style.overflow = 'auto';
              modalImg.style.cursor = 'zoom-out';

              const scaleWidth = availableWidth / naturalWidth;
              const scaleHeight = availableHeight / naturalHeight;
              const scale = Math.min(scaleWidth, scaleHeight);

              const finalScale = Math.max(1.0, scale);

              const finalWidth = naturalWidth * finalScale;
              const finalHeight = naturalHeight * finalScale;

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

export { showImageModal };
