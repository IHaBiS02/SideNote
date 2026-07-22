const MODAL_PADDING_RATIO = 0.1;
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 10;
const WHEEL_ZOOM_SPEED = 0.01;
const MIN_WHEEL_ZOOM_STEP = 0.01;
const MAX_WHEEL_ZOOM_STEP = 0.2;

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function normalizedWheelDelta(event: WheelEvent): number {
  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) return event.deltaY * 16;
  if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
    return event.deltaY * window.innerHeight;
  }
  return event.deltaY;
}

function wheelZoomFactor(event: WheelEvent): number {
  const delta = normalizedWheelDelta(event);
  if (delta === 0) return 1;

  let exponent = clamp(
    -delta * WHEEL_ZOOM_SPEED,
    -MAX_WHEEL_ZOOM_STEP,
    MAX_WHEEL_ZOOM_STEP,
  );
  if (Math.abs(exponent) < MIN_WHEEL_ZOOM_STEP) {
    exponent = Math.sign(exponent) * MIN_WHEEL_ZOOM_STEP;
  }
  return Math.exp(exponent);
}

/**
 * Shows an image in a centered modal with gesture zoom and pointer panning.
 * @param {string} blobUrl The blob URL of the image to show.
 */
function showImageModal(blobUrl: string): void {
  const modal = document.createElement('div');
  modal.classList.add('image-preview-modal');
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', 'Image preview');
  modal.style.position = 'fixed';
  modal.style.inset = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
  modal.style.display = 'flex';
  modal.style.justifyContent = 'center';
  modal.style.alignItems = 'center';
  modal.style.boxSizing = 'border-box';
  modal.style.padding = '10%';
  modal.style.overflow = 'hidden';
  modal.style.zIndex = '1000';

  const modalImg = document.createElement('img');
  modalImg.alt = 'Image preview';
  modalImg.draggable = false;
  modalImg.style.maxWidth = 'none';
  modalImg.style.maxHeight = 'none';
  modalImg.style.flex = '0 0 auto';
  modalImg.style.cursor = 'grab';
  modalImg.style.userSelect = 'none';
  modalImg.style.touchAction = 'none';
  modalImg.style.transformOrigin = 'center center';
  modalImg.style.willChange = 'transform';
  modalImg.style.setProperty('-webkit-user-drag', 'none');

  let zoom = 1;
  let offsetX = 0;
  let offsetY = 0;
  let dragging = false;
  let dragPointerId = -1;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragOriginX = 0;
  let dragOriginY = 0;

  const applyTransform = (): void => {
    modalImg.style.transform =
      `translate(${offsetX}px, ${offsetY}px) scale(${zoom})`;
  };

  const resetView = (): void => {
    zoom = 1;
    offsetX = 0;
    offsetY = 0;

    const naturalWidth = modalImg.naturalWidth;
    const naturalHeight = modalImg.naturalHeight;
    if (naturalWidth > 0 && naturalHeight > 0) {
      const availableWidth = window.innerWidth * (1 - 2 * MODAL_PADDING_RATIO);
      const availableHeight = window.innerHeight * (1 - 2 * MODAL_PADDING_RATIO);
      const fitScale = Math.min(
        availableWidth / naturalWidth,
        availableHeight / naturalHeight,
      );
      modalImg.style.width = `${naturalWidth * fitScale}px`;
      modalImg.style.height = `${naturalHeight * fitScale}px`;
    }

    applyTransform();
  };

  modal.addEventListener('click', (event) => {
    if (event.target === modal) modal.remove();
  });

  modal.addEventListener(
    'wheel',
    (event) => {
      if (!event.ctrlKey) return;
      event.preventDefault();

      const nextZoom = clamp(
        zoom * wheelZoomFactor(event),
        MIN_ZOOM,
        MAX_ZOOM,
      );
      if (nextZoom === zoom) return;

      const bounds = modal.getBoundingClientRect();
      const pointerX = event.clientX - (bounds.left + bounds.width / 2);
      const pointerY = event.clientY - (bounds.top + bounds.height / 2);
      const ratio = nextZoom / zoom;
      offsetX = pointerX - (pointerX - offsetX) * ratio;
      offsetY = pointerY - (pointerY - offsetY) * ratio;
      zoom = nextZoom;
      applyTransform();
    },
    { passive: false },
  );

  modalImg.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    dragging = true;
    dragPointerId = event.pointerId;
    dragStartX = event.clientX;
    dragStartY = event.clientY;
    dragOriginX = offsetX;
    dragOriginY = offsetY;
    modalImg.style.cursor = 'grabbing';
    modalImg.setPointerCapture?.(event.pointerId);
  });

  modalImg.addEventListener('pointermove', (event) => {
    if (!dragging || event.pointerId !== dragPointerId) return;
    event.preventDefault();
    offsetX = dragOriginX + event.clientX - dragStartX;
    offsetY = dragOriginY + event.clientY - dragStartY;
    applyTransform();
  });

  const finishDrag = (event: PointerEvent): void => {
    if (!dragging || event.pointerId !== dragPointerId) return;
    dragging = false;
    dragPointerId = -1;
    modalImg.style.cursor = 'grab';
  };

  modalImg.addEventListener('pointerup', finishDrag);
  modalImg.addEventListener('pointercancel', finishDrag);
  modalImg.addEventListener('lostpointercapture', finishDrag);
  modalImg.addEventListener('dragstart', (event) => event.preventDefault());
  modalImg.addEventListener('load', resetView);

  modal.appendChild(modalImg);
  document.body.appendChild(modal);
  modalImg.src = blobUrl;
}

export { showImageModal };
