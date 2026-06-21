import { describe, it, expect, beforeEach, vi } from 'vitest';
import JSZip from 'jszip';

// Mock database module
vi.mock('../../src/database/index.js', () => ({
  saveImage: vi.fn().mockResolvedValue(),
  saveNote: vi.fn().mockResolvedValue(),
  getImage: vi.fn().mockResolvedValue(new Blob(['fake image'], { type: 'image/png' })),
}));

import {
  addNoteToZip,
  createSingleNoteArchive,
  parseSnote,
  processSnote,
  saveImportedNotes,
  saveParsedSnoteImages
} from '../../src/import_export.js';
import { getImage, saveImage, saveNote } from '../../src/database/index.js';

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
    globalThis.JSZip = JSZip;
  });

  describe('parseSnote', () => {
    it('should parse a .snote zip without saving notes or images', async () => {
      const zip = createMockZip({
        metadata: { title: 'Parsed', settings: { fontSize: 16 }, metadata: {} },
        content: '![img](images/img1.png)',
        images: [{ id: 'img1' }],
      });

      const result = await parseSnote(zip);

      expect(result.title).toBe('Parsed');
      expect(result.content).toBe('![img](images/img1.png)');
      expect(result.settings.fontSize).toBe(16);
      expect(result.images).toHaveLength(1);
      expect(saveImage).not.toHaveBeenCalled();
      expect(saveNote).not.toHaveBeenCalled();
    });

    it('should save parsed images separately when requested', async () => {
      const parsed = await parseSnote(createMockZip({
        metadata: { title: 'Parsed', settings: {}, metadata: {} },
        content: 'content',
        images: [{ id: 'img1' }, { id: 'img2' }],
      }));

      await saveParsedSnoteImages(parsed);

      expect(saveImage).toHaveBeenCalledTimes(2);
      expect(saveImage).toHaveBeenCalledWith('img1', expect.anything());
      expect(saveImage).toHaveBeenCalledWith('img2', expect.anything());
      expect(saveNote).not.toHaveBeenCalled();
    });
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

  describe('saveImportedNotes', () => {
    function makeNote(lastModified) {
      return {
        id: crypto.randomUUID(),
        title: `Note ${lastModified}`,
        content: 'test',
        settings: {},
        metadata: { createdAt: 1000, lastModified },
        isPinned: false,
      };
    }

    it('should call saveNote sequentially for all notes', async () => {
      const callOrder = [];
      saveNote.mockImplementation(async (note) => {
        callOrder.push(note.title);
      });

      const notes = [makeNote(3000), makeNote(1000), makeNote(2000)];
      await saveImportedNotes(notes);

      expect(callOrder).toEqual(['Note 1000', 'Note 2000', 'Note 3000']);
    });

    it('should assign increasing lastModified timestamps', async () => {
      const notes = [makeNote(3000), makeNote(1000), makeNote(2000)];
      const result = await saveImportedNotes(notes);

      for (let i = 1; i < result.length; i++) {
        expect(result[i].metadata.lastModified).toBeGreaterThan(
          result[i - 1].metadata.lastModified
        );
      }
    });

    it('should sort notes by lastModified before processing', async () => {
      const notes = [makeNote(3000), makeNote(1000), makeNote(2000)];
      await saveImportedNotes(notes);

      expect(notes[0].title).toBe('Note 1000');
      expect(notes[1].title).toBe('Note 2000');
      expect(notes[2].title).toBe('Note 3000');
    });

    it('should not call saveNote for empty array', async () => {
      await saveImportedNotes([]);
      expect(saveNote).not.toHaveBeenCalled();
    });

    it('should call saveNote exactly once per note', async () => {
      const notes = [makeNote(100), makeNote(200), makeNote(300)];
      await saveImportedNotes(notes);
      expect(saveNote).toHaveBeenCalledTimes(3);
    });
  });

  describe('export helpers', () => {
    function makeExportNote() {
      return {
        id: 'note-1',
        title: 'Export Me',
        content: 'hello\n![Image](images/img1.png)',
        settings: { fontSize: 14 },
        metadata: { createdAt: 1000, lastModified: 2000 },
      };
    }

    it('should add note metadata, content, and referenced images to a zip target', async () => {
      const zip = new JSZip();
      await addNoteToZip(zip, makeExportNote());

      expect(zip.file('metadata.json')).toBeTruthy();
      expect(zip.file('note.md')).toBeTruthy();
      expect(zip.file('images/img1.png')).toBeTruthy();
      expect(getImage).toHaveBeenCalledWith('img1');
    });

    it('should create a single-note archive with the expected files', async () => {
      const zip = await createSingleNoteArchive(makeExportNote());

      const metadata = JSON.parse(await zip.file('metadata.json').async('string'));
      const content = await zip.file('note.md').async('string');

      expect(metadata.title).toBe('Export Me');
      expect(content).toBe('hello\n![Image](images/img1.png)');
      expect(zip.file('images/img1.png')).toBeTruthy();
    });
  });
});
