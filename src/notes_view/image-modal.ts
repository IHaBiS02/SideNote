const MODAL_PADDING_RATIO = 0.1;
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 10;
const WHEEL_ZOOM_SPEED = 0.01;
const MIN_WHEEL_ZOOM_STEP = 0.01;
const MAX_WHEEL_ZOOM_STEP = 0.2;

interface GesturePoint {
  x: number;
  y: number;
}

interface PinchSnapshot {
  center: GesturePoint;
  distance: number;
}

interface ActiveImageModal {
  modal: HTMLDivElement;
  zoomBetween(
    fromClientPoint: GesturePoint,
    toClientPoint: GesturePoint,
    factor: number,
  ): void;
}

let activeImageModal: ActiveImageModal | null = null;

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

function handleImageModalWheel(event: WheelEvent): void {
  if (!activeImageModal) return;
  if (!activeImageModal.modal.isConnected) {
    activeImageModal = null;
    return;
  }
  if (!event.ctrlKey) return;

  event.preventDefault();
  const pointer = { x: event.clientX, y: event.clientY };
  activeImageModal.zoomBetween(pointer, pointer, wheelZoomFactor(event));
}

// Ctrl+wheel works in both browser families, and Firefox exposes touchpad
// pinch through the same event shape. Chromium extension Side Panels may
// consume physical touchpad pinch before it reaches the DOM, so that gesture
// is intentionally not treated as supported there.
window.addEventListener('wheel', handleImageModalWheel, {
  capture: true,
  passive: false,
});

function getPinchSnapshot(
  touchPointers: Map<number, GesturePoint>,
): PinchSnapshot | null {
  const [first, second] = Array.from(touchPointers.values());
  if (!first || !second) return null;

  return {
    center: {
      x: (first.x + second.x) / 2,
      y: (first.y + second.y) / 2,
    },
    distance: Math.hypot(second.x - first.x, second.y - first.y),
  };
}

/**
 * Closes the active image modal and clears all transient gesture state.
 * @returns Whether a connected modal was closed.
 */
function closeImageModal(): boolean {
  if (!activeImageModal) return false;

  const { modal } = activeImageModal;
  activeImageModal = null;
  if (!modal.isConnected) return false;

  modal.remove();
  return true;
}

/**
 * Shows an image in a centered modal with cross-browser gesture zoom and
 * pointer panning.
 * @param {string} blobUrl The blob URL of the image to show.
 */
function showImageModal(blobUrl: string): void {
  closeImageModal();

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
  let pinchSnapshot: PinchSnapshot | null = null;
  const touchPointers = new Map<number, GesturePoint>();

  const applyTransform = (): void => {
    modalImg.style.transform =
      `translate(${offsetX}px, ${offsetY}px) scale(${zoom})`;
  };

  const toModalPoint = (clientPoint: GesturePoint): GesturePoint => {
    const bounds = modal.getBoundingClientRect();
    return {
      x: clientPoint.x - (bounds.left + bounds.width / 2),
      y: clientPoint.y - (bounds.top + bounds.height / 2),
    };
  };

  const zoomBetween = (
    fromClientPoint: GesturePoint,
    toClientPoint: GesturePoint,
    factor: number,
  ): void => {
    const nextZoom = clamp(zoom * factor, MIN_ZOOM, MAX_ZOOM);
    if (nextZoom === zoom) return;

    const fromPoint = toModalPoint(fromClientPoint);
    const toPoint = toModalPoint(toClientPoint);
    const ratio = nextZoom / zoom;
    offsetX = toPoint.x - (fromPoint.x - offsetX) * ratio;
    offsetY = toPoint.y - (fromPoint.y - offsetY) * ratio;
    zoom = nextZoom;
    applyTransform();
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

  const beginDrag = (pointerId: number, point: GesturePoint): void => {
    dragging = true;
    dragPointerId = pointerId;
    dragStartX = point.x;
    dragStartY = point.y;
    dragOriginX = offsetX;
    dragOriginY = offsetY;
    modalImg.style.cursor = 'grabbing';
  };

  const finishDrag = (pointerId: number): void => {
    if (!dragging || pointerId !== dragPointerId) return;
    dragging = false;
    dragPointerId = -1;
    modalImg.style.cursor = 'grab';
  };

  const finishTouchPointer = (pointerId: number): void => {
    if (!touchPointers.has(pointerId)) return;

    touchPointers.delete(pointerId);
    pinchSnapshot = null;

    const remainingPointer = touchPointers.entries().next().value as
      | [number, GesturePoint]
      | undefined;
    if (remainingPointer) {
      beginDrag(remainingPointer[0], remainingPointer[1]);
    } else {
      dragging = false;
      dragPointerId = -1;
      modalImg.style.cursor = 'grab';
    }
  };

  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeImageModal();
  });

  modalImg.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    event.preventDefault();

    const point = { x: event.clientX, y: event.clientY };
    modalImg.setPointerCapture?.(event.pointerId);

    if (event.pointerType === 'touch') {
      touchPointers.set(event.pointerId, point);
      if (touchPointers.size === 1) {
        beginDrag(event.pointerId, point);
      } else {
        dragging = false;
        dragPointerId = -1;
        pinchSnapshot = getPinchSnapshot(touchPointers);
        modalImg.style.cursor = 'grabbing';
      }
      return;
    }

    beginDrag(event.pointerId, point);
  });

  modalImg.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') {
      if (!touchPointers.has(event.pointerId)) return;
      event.preventDefault();
      touchPointers.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY,
      });

      if (touchPointers.size >= 2) {
        const nextSnapshot = getPinchSnapshot(touchPointers);
        if (
          pinchSnapshot
          && nextSnapshot
          && pinchSnapshot.distance > 0
          && nextSnapshot.distance > 0
        ) {
          zoomBetween(
            pinchSnapshot.center,
            nextSnapshot.center,
            nextSnapshot.distance / pinchSnapshot.distance,
          );
        }
        pinchSnapshot = nextSnapshot;
        return;
      }
    }

    if (!dragging || event.pointerId !== dragPointerId) return;
    event.preventDefault();
    offsetX = dragOriginX + event.clientX - dragStartX;
    offsetY = dragOriginY + event.clientY - dragStartY;
    applyTransform();
  });

  const finishPointer = (event: PointerEvent): void => {
    if (event.pointerType === 'touch') {
      finishTouchPointer(event.pointerId);
      return;
    }
    finishDrag(event.pointerId);
  };

  modalImg.addEventListener('pointerup', finishPointer);
  modalImg.addEventListener('pointercancel', finishPointer);
  modalImg.addEventListener('lostpointercapture', finishPointer);
  modalImg.addEventListener('dragstart', (event) => event.preventDefault());
  modalImg.addEventListener('load', resetView);

  modal.appendChild(modalImg);
  document.body.appendChild(modal);
  activeImageModal = { modal, zoomBetween };
  modalImg.src = blobUrl;
}

export {
  closeImageModal,
  showImageModal,
};
