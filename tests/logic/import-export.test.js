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
  createAllNotesArchive,
  createNoteFolderName,
  createSingleNoteArchive,
  getExportContent,
  parseSnote,
  parseSnotesArchive,
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

    it('should save legacy imported notes in display order', async () => {
      const callOrder = [];
      saveNote.mockImplementation(async (note) => {
        callOrder.push(note.title);
      });

      const notes = [makeNote(3000), makeNote(1000), makeNote(2000)];
      await saveImportedNotes(notes);

      expect(callOrder).toEqual(['Note 3000', 'Note 2000', 'Note 1000']);
    });

    it('should assign decreasing lastModified timestamps in display order', async () => {
      const notes = [makeNote(3000), makeNote(1000), makeNote(2000)];
      const result = await saveImportedNotes(notes);

      for (let i = 1; i < result.length; i++) {
        expect(result[i].metadata.lastModified).toBeLessThan(
          result[i - 1].metadata.lastModified
        );
      }
    });

    it('should sort legacy notes by newest modification before processing', async () => {
      const notes = [makeNote(3000), makeNote(1000), makeNote(2000)];
      await saveImportedNotes(notes);

      expect(notes[0].title).toBe('Note 3000');
      expect(notes[1].title).toBe('Note 2000');
      expect(notes[2].title).toBe('Note 1000');
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

    it('rebases imported pinned and regular order after existing notes', async () => {
      const parsedNotes = [
        { ...makeNote(100), title: 'Pinned A', archiveOrder: 0, isPinned: true, pinOrder: 0 },
        { ...makeNote(300), title: 'Pinned B', archiveOrder: 1, isPinned: true, pinOrder: 0 },
        { ...makeNote(200), title: 'Regular A', archiveOrder: 2, isPinned: false },
        { ...makeNote(400), title: 'Regular B', archiveOrder: 3, isPinned: false },
      ];
      const existingNotes = [
        { id: 'existing-pin', isPinned: true, pinOrder: 7, metadata: { lastModified: 8000 } },
        { id: 'existing-note', isPinned: false, metadata: { lastModified: 9000 } },
      ];

      const result = await saveImportedNotes(parsedNotes, existingNotes);

      expect(result.map(note => note.title)).toEqual([
        'Pinned A',
        'Pinned B',
        'Regular A',
        'Regular B',
      ]);
      expect(result.slice(0, 2).map(note => note.pinOrder)).toEqual([8, 9]);
      expect(result.slice(0, 2).every(note => note.isPinned)).toBe(true);
      expect(result.slice(2).every(note => !note.isPinned)).toBe(true);
      expect(result[2].metadata.lastModified).toBeGreaterThan(9000);
      expect(result[2].metadata.lastModified).toBeGreaterThan(
        result[3].metadata.lastModified,
      );
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

    it('should preserve note content for normal exports', () => {
      const note = makeExportNote();

      expect(getExportContent(note)).toBe('hello\n![Image](images/img1.png)');
    });

    it('should add two-space line breaks for line-break zip exports', async () => {
      const zip = await createSingleNoteArchive(makeExportNote(), {
        addTwoSpaceLineBreaks: true,
      });

      const content = await zip.file('note.md').async('string');

      expect(content).toBe('hello  \n![Image](images/img1.png)');
    });

    it('should use note ids for all-notes archives by default', async () => {
      const zip = await createAllNotesArchive([makeExportNote()]);

      expect(zip.file('note-1/note.md')).toBeTruthy();
      expect(zip.file('manifest.json')).toBeTruthy();
    });

    it('round-trips pinned state and displayed note order through the manifest', async () => {
      const notes = [
        {
          ...makeExportNote(),
          id: 'pinned-note',
          title: 'Pinned',
          content: 'pinned',
          isPinned: true,
          pinOrder: 4,
        },
        {
          ...makeExportNote(),
          id: 'regular-note',
          title: 'Regular',
          content: 'regular',
          isPinned: false,
        },
      ];

      const zip = await createAllNotesArchive(notes);
      const manifest = JSON.parse(
        await zip.file('manifest.json').async('string'),
      );
      const parsedNotes = await parseSnotesArchive(zip);

      expect(manifest).toEqual({
        formatVersion: 1,
        notes: [
          { folder: 'pinned-note', order: 0, isPinned: true, pinOrder: 4 },
          { folder: 'regular-note', order: 1, isPinned: false },
        ],
      });
      expect(parsedNotes.map(note => ({
        title: note.title,
        archiveOrder: note.archiveOrder,
        isPinned: note.isPinned,
        pinOrder: note.pinOrder,
      }))).toEqual([
        { title: 'Pinned', archiveOrder: 0, isPinned: true, pinOrder: 4 },
        { title: 'Regular', archiveOrder: 1, isPinned: false, pinOrder: undefined },
      ]);
    });

    it('continues to parse legacy all-notes archives without a manifest', async () => {
      const zip = new JSZip();
      const folder = zip.folder('legacy-note');
      await addNoteToZip(folder, {
        ...makeExportNote(),
        id: 'legacy-note',
        title: 'Legacy',
        content: 'legacy',
        isPinned: true,
        pinOrder: 3,
      });

      const parsedNotes = await parseSnotesArchive(zip);

      expect(parsedNotes).toHaveLength(1);
      expect(parsedNotes[0].title).toBe('Legacy');
      expect(parsedNotes[0].archiveOrder).toBeUndefined();
      expect(parsedNotes[0].isPinned).toBeUndefined();
      expect(parsedNotes[0].pinOrder).toBeUndefined();
    });

    it('should use sanitized note titles for all-notes zip exports when requested', async () => {
      const notes = [
        { ...makeExportNote(), id: 'note-1', title: 'First Note' },
        { ...makeExportNote(), id: 'note-2', title: 'Bad:/Name?' },
        { ...makeExportNote(), id: 'note-3', title: 'Bad__Name_' },
      ];

      const zip = await createAllNotesArchive(notes, { useTitleFolderNames: true });

      expect(zip.file('First Note/note.md')).toBeTruthy();
      expect(zip.file('Bad__Name_/note.md')).toBeTruthy();
      expect(zip.file('Bad__Name__2/note.md')).toBeTruthy();
    });

    it('should fall back to note id for blank title folder names', () => {
      const usedFolderNames = new Set();

      expect(createNoteFolderName(
        { id: 'note-1', title: '   ' },
        usedFolderNames,
        { useTitleFolderNames: true }
      )).toBe('note-1');
    });
  });
});
