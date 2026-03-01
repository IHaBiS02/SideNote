import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock database module
vi.mock('../../src/database/index.js', () => ({
  saveImage: vi.fn().mockResolvedValue(),
  saveNote: vi.fn().mockResolvedValue(),
}));

import { processSnote } from '../../src/import_export.js';
import { saveImage, saveNote } from '../../src/database/index.js';

// Helper to create a mock JSZip object
function createMockZip({ metadata, content, images = [] }) {
  const files = {};

  if (metadata !== undefined) {
    files['metadata.json'] = {
      async: vi.fn().mockResolvedValue(JSON.stringify(metadata)),
    };
  }

  if (content !== undefined) {
    files['note.md'] = {
      async: vi.fn().mockResolvedValue(content),
    };
  }

  const imageFiles = [];
  images.forEach(img => {
    imageFiles.push({
      name: `images/${img.id}.png`,
      dir: false,
      async: vi.fn().mockResolvedValue(new Blob(['fake image'], { type: 'image/png' })),
    });
  });

  return {
    file: (name) => files[name] || null,
    folder: (name) => {
      if (name === 'images' && images.length > 0) {
        return {
          forEach: (callback) => {
            imageFiles.forEach(f => callback(f.name.replace('images/', ''), f));
          },
        };
      }
      return {
        forEach: () => {},
      };
    },
  };
}

describe('import_export', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('processSnote', () => {
    it('should parse a valid .snote zip and return a note object', async () => {
      const metadata = {
        title: 'Test Note',
        settings: { fontSize: 14 },
        metadata: {
          createdAt: 1000,
          lastModified: 2000,
        },
      };
      const content = '# Hello World';

      const zip = createMockZip({ metadata, content });
      const result = await processSnote(zip);

      expect(result).toBeDefined();
      expect(result.title).toBe('Test Note');
      expect(result.content).toBe('# Hello World');
      expect(result.settings.fontSize).toBe(14);
      expect(result.isPinned).toBe(false);
    });

    it('should generate a new UUID for the imported note', async () => {
      const zip = createMockZip({
        metadata: { title: 'Note', settings: {}, metadata: {} },
        content: 'content',
      });

      const result = await processSnote(zip);
      expect(result.id).toBeTruthy();
      expect(typeof result.id).toBe('string');
    });

    it('should preserve original timestamps from metadata', async () => {
      const zip = createMockZip({
        metadata: {
          title: 'Note',
          settings: {},
          metadata: { createdAt: 1234567890, lastModified: 1234567999 },
        },
        content: 'test',
      });

      const result = await processSnote(zip);
      expect(result.metadata.createdAt).toBe(1234567890);
      expect(result.metadata.lastModified).toBe(1234567999);
    });

    it('should use current time when metadata has no timestamps', async () => {
      const before = Date.now();
      const zip = createMockZip({
        metadata: { title: 'Note', settings: {} },
        content: 'test',
      });

      const result = await processSnote(zip);
      const after = Date.now();
      expect(result.metadata.createdAt).toBeGreaterThanOrEqual(before);
      expect(result.metadata.createdAt).toBeLessThanOrEqual(after);
    });

    it('should save images from the images folder', async () => {
      const zip = createMockZip({
        metadata: { title: 'Note', settings: {}, metadata: {} },
        content: '![img](images/img1.png)',
        images: [{ id: 'img1' }, { id: 'img2' }],
      });

      await processSnote(zip);
      expect(saveImage).toHaveBeenCalledTimes(2);
      expect(saveImage).toHaveBeenCalledWith('img1', expect.anything());
      expect(saveImage).toHaveBeenCalledWith('img2', expect.anything());
    });

    it('should save the note to the database', async () => {
      const zip = createMockZip({
        metadata: { title: 'Note', settings: {}, metadata: {} },
        content: 'test',
      });

      await processSnote(zip);
      expect(saveNote).toHaveBeenCalledTimes(1);
      expect(saveNote).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Note',
        content: 'test',
      }));
    });

    it('should throw for invalid .snote format (missing metadata)', async () => {
      const zip = createMockZip({ content: 'test' });
      await expect(processSnote(zip)).rejects.toThrow('Invalid .snote format');
    });

    it('should throw for invalid .snote format (missing note.md)', async () => {
      const zip = createMockZip({ metadata: { title: 'Note' } });
      await expect(processSnote(zip)).rejects.toThrow('Invalid .snote format');
    });

    it('should handle .snote with no images folder', async () => {
      const zip = createMockZip({
        metadata: { title: 'Note', settings: {}, metadata: {} },
        content: 'no images',
      });

      const result = await processSnote(zip);
      expect(result).toBeDefined();
      expect(saveImage).not.toHaveBeenCalled();
    });
  });
});
