import { afterEach, beforeEach, describe, expect, it } from 'vitest';

function createPointerEvent(
  type,
  { x, y, pointerId = 1, pointerType = 'mouse' },
) {
  const event = new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    button: 0,
    clientX: x,
    clientY: y,
  });
  Object.defineProperty(event, 'pointerId', { value: pointerId });
  Object.defineProperty(event, 'pointerType', { value: pointerType });
  return event;
}

function transformScale(image) {
  return Number(/scale\(([^)]+)\)/.exec(image.style.transform)?.[1]);
}

describe('image preview modal', () => {
  let imageModal;

  beforeEach(async () => {
    imageModal = await import('../../src/notes_view/image-modal.js');
    imageModal.closeImageModal();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    imageModal.closeImageModal();
  });

  async function openLoadedModal({ width = 1200, height = 600 } = {}) {
    imageModal.showImageModal('blob:preview');

    const modal = document.querySelector('.image-preview-modal');
    const image = modal.querySelector('img');
    Object.defineProperty(image, 'naturalWidth', {
      configurable: true,
      value: width,
    });
    Object.defineProperty(image, 'naturalHeight', {
      configurable: true,
      value: height,
    });
    image.dispatchEvent(new Event('load'));
    return { modal, image };
  }

  it('opens fitted and centered without changing zoom on image click', async () => {
    const { modal, image } = await openLoadedModal();
    const initialTransform = image.style.transform;

    expect(modal.style.justifyContent).toBe('center');
    expect(modal.style.alignItems).toBe('center');
    expect(initialTransform).toBe('translate(0px, 0px) scale(1)');

    image.click();

    expect(image.style.transform).toBe(initialTransform);
    expect(document.body.contains(modal)).toBe(true);
  });

  it('zooms in and out only for Ctrl+wheel or touchpad pinch wheel events', async () => {
    const { modal, image } = await openLoadedModal();
    const initialTransform = image.style.transform;
    const ordinaryWheel = new WheelEvent('wheel', {
      bubbles: true,
      cancelable: true,
      deltaY: -100,
    });

    window.dispatchEvent(ordinaryWheel);
    expect(ordinaryWheel.defaultPrevented).toBe(false);
    expect(image.style.transform).toBe(initialTransform);

    const zoomIn = new WheelEvent('wheel', {
      bubbles: true,
      cancelable: true,
      ctrlKey: true,
      deltaY: -0.1,
      clientX: 400,
      clientY: 300,
    });
    window.dispatchEvent(zoomIn);
    const enlargedScale = transformScale(image);

    expect(zoomIn.defaultPrevented).toBe(true);
    expect(enlargedScale).toBeGreaterThanOrEqual(1.01);
    expect(image.style.transform).not.toContain('translate(0px, 0px)');

    const zoomOut = new WheelEvent('wheel', {
      bubbles: true,
      cancelable: true,
      ctrlKey: true,
      deltaY: 100,
      clientX: 400,
      clientY: 300,
    });
    window.dispatchEvent(zoomOut);

    expect(zoomOut.defaultPrevented).toBe(true);
    expect(transformScale(image)).toBeLessThan(enlargedScale);
  });

  it('pans while held and resets the view when reopened', async () => {
    const first = await openLoadedModal();

    first.image.dispatchEvent(createPointerEvent('pointerdown', { x: 20, y: 30 }));
    first.image.dispatchEvent(createPointerEvent('pointermove', { x: 55, y: 80 }));
    first.image.dispatchEvent(createPointerEvent('pointerup', { x: 55, y: 80 }));

    expect(first.image.style.transform).toBe('translate(35px, 50px) scale(1)');
    expect(first.image.style.cursor).toBe('grab');

    window.dispatchEvent(new WheelEvent('wheel', {
      bubbles: true,
      cancelable: true,
      ctrlKey: true,
      deltaY: -100,
      clientX: 400,
      clientY: 300,
    }));
    expect(transformScale(first.image)).toBeGreaterThan(1);

    first.modal.click();
    expect(document.body.contains(first.modal)).toBe(false);

    const reopened = await openLoadedModal();
    expect(reopened.image.style.transform).toBe('translate(0px, 0px) scale(1)');
  });

  it('handles a touchscreen two-pointer pinch and centroid movement', async () => {
    const { image } = await openLoadedModal();

    image.dispatchEvent(createPointerEvent('pointerdown', {
      pointerId: 1,
      pointerType: 'touch',
      x: 300,
      y: 300,
    }));
    image.dispatchEvent(createPointerEvent('pointerdown', {
      pointerId: 2,
      pointerType: 'touch',
      x: 500,
      y: 300,
    }));

    const pinchOut = createPointerEvent('pointermove', {
      pointerId: 2,
      pointerType: 'touch',
      x: 550,
      y: 320,
    });
    image.dispatchEvent(pinchOut);

    expect(pinchOut.defaultPrevented).toBe(true);
    expect(transformScale(image)).toBeGreaterThan(1);
    expect(image.style.transform).not.toContain('translate(0px, 0px)');

    const scaleAfterPinchOut = transformScale(image);
    image.dispatchEvent(createPointerEvent('pointermove', {
      pointerId: 2,
      pointerType: 'touch',
      x: 450,
      y: 320,
    }));

    expect(transformScale(image)).toBeLessThan(scaleAfterPinchOut);

    image.dispatchEvent(createPointerEvent('pointerup', {
      pointerId: 2,
      pointerType: 'touch',
      x: 450,
      y: 320,
    }));
    image.dispatchEvent(createPointerEvent('pointerup', {
      pointerId: 1,
      pointerType: 'touch',
      x: 300,
      y: 300,
    }));

    expect(image.style.cursor).toBe('grab');
  });

  it('stops handling global pinch-wheel events after the modal closes', async () => {
    const { modal } = await openLoadedModal();

    expect(imageModal.closeImageModal()).toBe(true);
    expect(document.body.contains(modal)).toBe(false);

    const pinchWheel = new WheelEvent('wheel', {
      bubbles: true,
      cancelable: true,
      ctrlKey: true,
      deltaY: -100,
    });
    window.dispatchEvent(pinchWheel);

    expect(pinchWheel.defaultPrevented).toBe(false);
    expect(imageModal.closeImageModal()).toBe(false);
  });
});
