const DEFAULT_LONG_PRESS_DELAY_MS = 400;
const DEFAULT_MOVE_TOLERANCE_PX = 8;
const SUPPRESS_CLICK_DURATION_MS = 600;
const FLOATING_HORIZONTAL_INSET_PX = 8;

interface PinnedNoteDragOptions {
  longPressDelayMs?: number;
  moveTolerancePx?: number;
}

interface DragCandidate {
  item: HTMLLIElement;
  noteId: string;
  pointerId: number;
  startX: number;
  startY: number;
  timerId: number;
}

interface ActiveDrag {
  item: HTMLLIElement;
  placeholder: HTMLLIElement;
  originalNextSibling: ChildNode | null;
  noteId: string;
  pointerId: number;
  grabOffsetY: number;
}

interface PinnedNoteDragController {
  destroy: () => void;
}

type ReorderPinnedNotes = (
  orderedNoteIds: string[],
) => void | Promise<void>;

function findPinnedNoteItem(
  list: HTMLElement,
  target: EventTarget | null,
): HTMLLIElement | null {
  if (!(target instanceof Element)) return null;
  const item = target.closest<HTMLLIElement>(
    'li[data-note-id][data-pinned="true"]',
  );
  return item && list.contains(item) ? item : null;
}

function pinnedNoteIds(list: HTMLElement): string[] {
  return Array.from(
    list.querySelectorAll<HTMLLIElement>('li[data-pinned="true"]'),
  ).map(item => item.dataset.noteId).filter((id): id is string => Boolean(id));
}

function movePinnedPlaceholderAtPointer(
  list: HTMLElement,
  drag: ActiveDrag,
  clientY: number,
): void {
  const otherPinnedItems = Array.from(
    list.querySelectorAll<HTMLLIElement>('li[data-pinned="true"]'),
  ).filter(candidate => candidate !== drag.item);
  const insertBefore = otherPinnedItems.find((candidate) => {
    const bounds = candidate.getBoundingClientRect();
    return clientY < bounds.top + bounds.height / 2;
  });

  if (insertBefore) {
    list.insertBefore(drag.placeholder, insertBefore);
    return;
  }

  const firstUnpinnedItem = list.querySelector<HTMLLIElement>(
    'li[data-pinned="false"]',
  );
  list.insertBefore(drag.placeholder, firstUnpinnedItem);
}

function clearFloatingStyles(item: HTMLLIElement): void {
  item.style.removeProperty('left');
  item.style.removeProperty('top');
  item.style.removeProperty('width');
  item.style.removeProperty('height');
}

/**
 * Adds long-press pointer reordering to the pinned section of a note list.
 */
function createPinnedNoteDragController(
  list: HTMLElement,
  onReorder: ReorderPinnedNotes,
  options: PinnedNoteDragOptions = {},
): PinnedNoteDragController {
  const longPressDelayMs = options.longPressDelayMs
    ?? DEFAULT_LONG_PRESS_DELAY_MS;
  const moveTolerancePx = options.moveTolerancePx
    ?? DEFAULT_MOVE_TOLERANCE_PX;
  let candidate: DragCandidate | null = null;
  let activeDrag: ActiveDrag | null = null;
  let suppressedClickNoteId: string | null = null;
  let suppressClickUntil = 0;

  const clearCandidate = (): void => {
    if (!candidate) return;
    window.clearTimeout(candidate.timerId);
    candidate = null;
  };

  const releasePointer = (drag: ActiveDrag): void => {
    try {
      if (drag.item.hasPointerCapture?.(drag.pointerId)) {
        drag.item.releasePointerCapture?.(drag.pointerId);
      }
    } catch {
      // The browser may already have released capture during cancellation.
    }
  };

  const cleanUpActiveDrag = (drag: ActiveDrag): void => {
    drag.placeholder.remove();
    drag.item.classList.remove('pinned-note-dragging');
    drag.item.removeAttribute('aria-grabbed');
    clearFloatingStyles(drag.item);
    list.classList.remove('pinned-note-reorder-active');
    releasePointer(drag);
  };

  const activateCandidate = (): void => {
    const current = candidate;
    if (!current || !current.item.isConnected) {
      clearCandidate();
      return;
    }

    const bounds = current.item.getBoundingClientRect();
    const placeholder = document.createElement('li');
    placeholder.classList.add('pinned-note-drop-placeholder');
    placeholder.setAttribute('aria-hidden', 'true');
    placeholder.setAttribute('role', 'presentation');
    placeholder.style.setProperty(
      '--pinned-note-placeholder-height',
      `${bounds.height}px`,
    );

    const originalNextSibling = current.item.nextSibling;
    list.insertBefore(placeholder, current.item);

    candidate = null;
    activeDrag = {
      item: current.item,
      placeholder,
      originalNextSibling,
      noteId: current.noteId,
      pointerId: current.pointerId,
      grabOffsetY: Math.min(
        bounds.height,
        Math.max(0, current.startY - bounds.top),
      ),
    };
    suppressedClickNoteId = current.noteId;
    suppressClickUntil = Number.POSITIVE_INFINITY;
    list.classList.add('pinned-note-reorder-active');
    current.item.classList.add('pinned-note-dragging');
    current.item.setAttribute('aria-grabbed', 'true');
    current.item.style.left = `${bounds.left + FLOATING_HORIZONTAL_INSET_PX}px`;
    current.item.style.top = `${bounds.top}px`;
    current.item.style.width = `${Math.max(
      0,
      bounds.width - FLOATING_HORIZONTAL_INSET_PX * 2,
    )}px`;
    current.item.style.height = `${bounds.height}px`;

    try {
      current.item.setPointerCapture?.(current.pointerId);
    } catch {
      // Window listeners continue the drag if pointer capture is unavailable.
    }
  };

  const finishActiveDrag = (event?: PointerEvent): void => {
    const finishedDrag = activeDrag;
    if (!finishedDrag) return;
    activeDrag = null;
    if (event?.cancelable) event.preventDefault();

    list.insertBefore(finishedDrag.item, finishedDrag.placeholder);
    cleanUpActiveDrag(finishedDrag);
    suppressClickUntil = Date.now() + SUPPRESS_CLICK_DURATION_MS;

    void Promise.resolve(onReorder(pinnedNoteIds(list))).catch((error) => {
      console.error('Failed to reorder pinned notes:', error);
    });
  };

  const cancelActiveDrag = (): void => {
    const cancelledDrag = activeDrag;
    if (!cancelledDrag) return;
    activeDrag = null;

    if (
      cancelledDrag.originalNextSibling
      && cancelledDrag.originalNextSibling.parentNode === list
    ) {
      list.insertBefore(cancelledDrag.item, cancelledDrag.originalNextSibling);
    } else {
      list.appendChild(cancelledDrag.item);
    }
    cleanUpActiveDrag(cancelledDrag);
    suppressedClickNoteId = null;
    suppressClickUntil = 0;
  };

  const handlePointerDown = (event: PointerEvent): void => {
    if (event.button !== 0 || event.isPrimary === false || candidate || activeDrag) {
      return;
    }
    if (event.target instanceof Element
      && event.target.closest('.button-container')) {
      return;
    }

    const item = findPinnedNoteItem(list, event.target);
    const noteId = item?.dataset.noteId;
    if (!item || !noteId) return;

    candidate = {
      item,
      noteId,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      timerId: window.setTimeout(activateCandidate, longPressDelayMs),
    };
  };

  const handlePointerMove = (event: PointerEvent): void => {
    if (candidate && event.pointerId === candidate.pointerId) {
      const distance = Math.hypot(
        event.clientX - candidate.startX,
        event.clientY - candidate.startY,
      );
      if (distance > moveTolerancePx) clearCandidate();
      return;
    }

    if (!activeDrag || event.pointerId !== activeDrag.pointerId) return;
    if (event.cancelable) event.preventDefault();

    activeDrag.item.style.top = `${event.clientY - activeDrag.grabOffsetY}px`;
    movePinnedPlaceholderAtPointer(list, activeDrag, event.clientY);
  };

  const handlePointerUp = (event: PointerEvent): void => {
    if (candidate && event.pointerId === candidate.pointerId) {
      clearCandidate();
      return;
    }
    if (activeDrag && event.pointerId === activeDrag.pointerId) {
      finishActiveDrag(event);
    }
  };

  const handlePointerCancel = (event: PointerEvent): void => {
    if (candidate && event.pointerId === candidate.pointerId) {
      clearCandidate();
      return;
    }
    if (activeDrag && event.pointerId === activeDrag.pointerId) {
      cancelActiveDrag();
    }
  };

  const handleClick = (event: MouseEvent): void => {
    if (!suppressedClickNoteId || Date.now() > suppressClickUntil) {
      suppressedClickNoteId = null;
      return;
    }
    const item = event.target instanceof Element
      ? event.target.closest<HTMLLIElement>('li[data-note-id]')
      : null;
    if (item?.dataset.noteId !== suppressedClickNoteId) return;

    suppressedClickNoteId = null;
    event.preventDefault();
    event.stopImmediatePropagation();
  };

  const handleContextMenu = (event: MouseEvent): void => {
    const item = findPinnedNoteItem(list, event.target);
    if (item && (candidate?.item === item || activeDrag?.item === item)) {
      event.preventDefault();
    }
  };

  const handleTouchMove = (event: TouchEvent): void => {
    if (activeDrag && event.cancelable) event.preventDefault();
  };

  const handleWindowBlur = (): void => {
    clearCandidate();
    cancelActiveDrag();
  };

  list.addEventListener('pointerdown', handlePointerDown);
  list.addEventListener('click', handleClick, true);
  list.addEventListener('contextmenu', handleContextMenu);
  list.addEventListener('touchmove', handleTouchMove, { passive: false });
  window.addEventListener('pointermove', handlePointerMove, { passive: false });
  window.addEventListener('pointerup', handlePointerUp);
  window.addEventListener('pointercancel', handlePointerCancel);
  window.addEventListener('blur', handleWindowBlur);

  return {
    destroy: () => {
      clearCandidate();
      cancelActiveDrag();
      list.removeEventListener('pointerdown', handlePointerDown);
      list.removeEventListener('click', handleClick, true);
      list.removeEventListener('contextmenu', handleContextMenu);
      list.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerCancel);
      window.removeEventListener('blur', handleWindowBlur);
    },
  };
}

export {
  createPinnedNoteDragController,
};

export type {
  PinnedNoteDragController,
  PinnedNoteDragOptions,
};
