import { describe, it, expect, beforeEach, vi } from 'vitest';

const dbMocks = vi.hoisted(() => ({
  getAllImageObjectsFromDB: vi.fn(),
  deleteImage: vi.fn().mockResolvedValue(),
}));

vi.mock('../../src/database/index.js', () => ({
  getAllImageObjectsFromDB: dbMocks.getAllImageObjectsFromDB,
  deleteImage: dbMocks.deleteImage,
}));

vi.mock('../../src/notes_view/note-renderer.js', () => ({
  openNote: vi.fn(),
}));

vi.mock('../../src/notes_view/image-modal.js', () => ({
  showImageModal: vi.fn(),
}));

describe('image manager usage detection', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    document.body.innerHTML = `
      <ul id="image-list"></ul>
      <div id="html-preview"></div>
    `;
    URL.createObjectURL = vi.fn(() => 'blob:test-url');
    URL.revokeObjectURL = vi.fn();
  });

  async function renderImages({ notes, images }) {
    dbMocks.getAllImageObjectsFromDB.mockResolvedValue(images);

    const state = await import('../../src/state.js');
    state.setNotes(notes);
    state.setGlobalSettings({ preventUsedImageDeletion: true });

    const { renderImagesList } = await import('../../src/notes_view/image-manager.js');
    await renderImagesList();

    return document.getElementById('image-list');
  }

  it('does not mark an image as used when its id appears only as plain text', async () => {
    const imageList = await renderImages({
      notes: [{ id: 'note-1', title: 'Note', content: 'plain img1 text' }],
      images: [{ id: 'img1', blob: new Blob(['image'], { type: 'image/png' }), deletedAt: null }],
    });

    const usageIcon = imageList.querySelector('[data-image-id="img1"] .usage-icon');
    expect(usageIcon.textContent).toBe('❌');
  });

  it('marks an image as used when it is referenced by markdown image syntax', async () => {
    const imageList = await renderImages({
      notes: [{ id: 'note-1', title: 'Note', content: '![Image](images/img1.png)' }],
      images: [{ id: 'img1', blob: new Blob(['image'], { type: 'image/png' }), deletedAt: null }],
    });

    const usageIcon = imageList.querySelector('[data-image-id="img1"] .usage-icon');
    expect(usageIcon.textContent).toBe('✅');
  });
});
