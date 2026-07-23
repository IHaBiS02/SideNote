import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  createPinnedNoteDragController,
} from '../../src/notes_view/pinned-note-drag.js';

function createPointerEvent(type, {
  x,
  y,
  pointerId = 1,
  button = 0,
  buttons = type === 'pointerup' ? 0 : 1,
} = {}) {
  const event = new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    button,
    buttons,
    clientX: x,
    clientY: y,
  });
  Object.defineProperty(event, 'pointerId', { value: pointerId });
  Object.defineProperty(event, 'isPrimary', { value: true });
  return event;
}

function noteItem(id, pinned) {
  const item = document.createElement('li');
  item.dataset.noteId = id;
  item.dataset.pinned = String(pinned);
  item.innerHTML = `<span>${id}</span><div class="button-container"></div>`;
  return item;
}

function setBounds(item, top, height = 40) {
  item.getBoundingClientRect = () => ({
    top,
    bottom: top + height,
    left: 0,
    right: 200,
    width: 200,
    height,
    x: 0,
    y: top,
    toJSON: () => ({}),
  });
}

describe('pinned note long-press dragging', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = '<ul id="note-list"></ul>';
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('uses a 150ms long-press delay by default', () => {
    const list = document.querySelector('#note-list');
    const pinned = noteItem('pinned', true);
    list.append(pinned);
    setBounds(pinned, 0);
    const controller = createPinnedNoteDragController(list, vi.fn());

    pinned.dispatchEvent(createPointerEvent('pointerdown', { x: 10, y: 10 }));
    vi.advanceTimersByTime(149);
    expect(pinned.classList.contains('pinned-note-dragging')).toBe(false);

    vi.advanceTimersByTime(1);
    expect(pinned.classList.contains('pinned-note-dragging')).toBe(true);

    window.dispatchEvent(createPointerEvent('pointercancel', { x: 10, y: 10 }));
    controller.destroy();
  });

  it('reorders pinned notes after a long press and suppresses the drop click', () => {
    const list = document.querySelector('#note-list');
    const first = noteItem('pinned-1', true);
    const second = noteItem('pinned-2', true);
    const unpinned = noteItem('regular', false);
    list.append(first, second, unpinned);
    setBounds(first, 0);
    setBounds(second, 40);
    setBounds(unpinned, 80);
    const onReorder = vi.fn();
    const clickSpy = vi.fn();
    const controller = createPinnedNoteDragController(list, onReorder, {
      longPressDelayMs: 100,
    });
    list.addEventListener('click', clickSpy);

    second.dispatchEvent(createPointerEvent('pointerdown', { x: 20, y: 60 }));
    vi.advanceTimersByTime(100);

    expect(second.classList.contains('pinned-note-dragging')).toBe(true);
    expect(second.getAttribute('aria-grabbed')).toBe('true');
    expect(second.style.left).toBe('8px');
    expect(second.style.width).toBe('184px');
    expect(list.querySelector('.pinned-note-drop-placeholder')).not.toBeNull();

    vi.advanceTimersByTime(1_000);
    window.dispatchEvent(createPointerEvent('pointermove', { x: 20, y: 5 }));
    second.dispatchEvent(createPointerEvent('lostpointercapture', {
      x: 20,
      y: 5,
      buttons: 1,
    }));

    expect(second.classList.contains('pinned-note-dragging')).toBe(true);
    expect(
      list.firstElementChild.classList.contains('pinned-note-drop-placeholder'),
    ).toBe(true);
    expect(second.style.top).toBe('-15px');

    window.dispatchEvent(createPointerEvent('pointerup', { x: 20, y: 5 }));

    expect(Array.from(list.children, item => item.dataset.noteId)).toEqual([
      'pinned-2',
      'pinned-1',
      'regular',
    ]);
    expect(onReorder).toHaveBeenCalledWith(['pinned-2', 'pinned-1']);
    expect(second.classList.contains('pinned-note-dragging')).toBe(false);
    expect(second.hasAttribute('aria-grabbed')).toBe(false);
    expect(second.style.left).toBe('');
    expect(second.style.top).toBe('');
    expect(list.querySelector('.pinned-note-drop-placeholder')).toBeNull();

    const click = new MouseEvent('click', { bubbles: true, cancelable: true });
    second.dispatchEvent(click);
    expect(click.defaultPrevented).toBe(true);
    expect(clickSpy).not.toHaveBeenCalled();
    controller.destroy();
  });

  it('keeps a short tap and an early scroll gesture out of drag mode', () => {
    const list = document.querySelector('#note-list');
    const pinned = noteItem('pinned', true);
    list.append(pinned, noteItem('regular', false));
    const onReorder = vi.fn();
    const controller = createPinnedNoteDragController(list, onReorder, {
      longPressDelayMs: 100,
      moveTolerancePx: 8,
    });

    pinned.dispatchEvent(createPointerEvent('pointerdown', { x: 10, y: 10 }));
    window.dispatchEvent(createPointerEvent('pointermove', { x: 10, y: 30 }));
    vi.advanceTimersByTime(100);
    window.dispatchEvent(createPointerEvent('pointerup', { x: 10, y: 30 }));

    expect(pinned.classList.contains('pinned-note-dragging')).toBe(false);
    expect(onReorder).not.toHaveBeenCalled();

    const click = new MouseEvent('click', { bubbles: true, cancelable: true });
    pinned.dispatchEvent(click);
    expect(click.defaultPrevented).toBe(false);
    controller.destroy();
  });

  it('moves the drop gap only after crossing a stable boundary', () => {
    const list = document.querySelector('#note-list');
    const first = noteItem('pinned-1', true);
    const second = noteItem('pinned-2', true);
    const third = noteItem('pinned-3', true);
    const unpinned = noteItem('regular', false);
    list.append(first, second, third, unpinned);
    setBounds(first, 0);
    setBounds(second, 40);
    setBounds(third, 80);
    const insertBeforeSpy = vi.spyOn(list, 'insertBefore');
    const controller = createPinnedNoteDragController(list, vi.fn(), {
      longPressDelayMs: 100,
    });

    first.dispatchEvent(createPointerEvent('pointerdown', { x: 20, y: 20 }));
    vi.advanceTimersByTime(100);

    expect(insertBeforeSpy).toHaveBeenCalledTimes(1);

    window.dispatchEvent(createPointerEvent('pointermove', { x: 20, y: 69 }));
    window.dispatchEvent(createPointerEvent('pointermove', { x: 20, y: 68 }));
    expect(insertBeforeSpy).toHaveBeenCalledTimes(1);

    window.dispatchEvent(createPointerEvent('pointermove', { x: 20, y: 71 }));
    expect(insertBeforeSpy).toHaveBeenCalledTimes(2);
    expect(list.querySelector('.pinned-note-drop-placeholder').nextSibling)
      .toBe(third);

    window.dispatchEvent(createPointerEvent('pointermove', { x: 20, y: 51 }));
    window.dispatchEvent(createPointerEvent('pointermove', { x: 20, y: 50 }));
    expect(insertBeforeSpy).toHaveBeenCalledTimes(2);

    window.dispatchEvent(createPointerEvent('pointermove', { x: 20, y: 49 }));
    expect(insertBeforeSpy).toHaveBeenCalledTimes(3);
    expect(list.querySelector('.pinned-note-drop-placeholder').nextSibling)
      .toBe(second);

    window.dispatchEvent(createPointerEvent('pointerup', { x: 20, y: 49 }));
    controller.destroy();
  });

  it('does not start dragging from pin and delete controls', () => {
    const list = document.querySelector('#note-list');
    const pinned = noteItem('pinned', true);
    list.append(pinned);
    const onReorder = vi.fn();
    const controller = createPinnedNoteDragController(list, onReorder, {
      longPressDelayMs: 100,
    });
    const controls = pinned.querySelector('.button-container');

    controls.dispatchEvent(createPointerEvent('pointerdown', { x: 10, y: 10 }));
    vi.advanceTimersByTime(100);
    window.dispatchEvent(createPointerEvent('pointerup', { x: 10, y: 10 }));

    expect(pinned.classList.contains('pinned-note-dragging')).toBe(false);
    expect(onReorder).not.toHaveBeenCalled();
    controller.destroy();
  });

  it('restores the original order when an active pointer is cancelled', () => {
    const list = document.querySelector('#note-list');
    const first = noteItem('pinned-1', true);
    const second = noteItem('pinned-2', true);
    const unpinned = noteItem('regular', false);
    list.append(first, second, unpinned);
    setBounds(first, 0);
    setBounds(second, 40);
    const onReorder = vi.fn();
    const controller = createPinnedNoteDragController(list, onReorder, {
      longPressDelayMs: 100,
    });

    second.dispatchEvent(createPointerEvent('pointerdown', { x: 20, y: 60 }));
    vi.advanceTimersByTime(100);
    window.dispatchEvent(createPointerEvent('pointermove', { x: 20, y: 5 }));
    window.dispatchEvent(createPointerEvent('pointercancel', { x: 20, y: 5 }));

    expect(Array.from(list.children, item => item.dataset.noteId)).toEqual([
      'pinned-1',
      'pinned-2',
      'regular',
    ]);
    expect(second.classList.contains('pinned-note-dragging')).toBe(false);
    expect(list.querySelector('.pinned-note-drop-placeholder')).toBeNull();
    expect(onReorder).not.toHaveBeenCalled();
    controller.destroy();
  });
});
