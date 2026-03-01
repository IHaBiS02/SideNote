import { describe, it, expect, beforeEach } from 'vitest';
import {
  notes, deletedNotes, globalSettings, isGlobalSettings,
  activeNoteId, originalNoteContent, isPreview,
  setNotes, setDeletedNotes, setGlobalSettings, setIsGlobalSettings,
  setActiveNoteId, setOriginalNoteContent, setIsPreview
} from '../../src/state.js';

describe('state', () => {
  beforeEach(() => {
    setNotes([]);
    setDeletedNotes([]);
    setGlobalSettings({});
    setIsGlobalSettings(false);
    setActiveNoteId(null);
    setOriginalNoteContent('');
    setIsPreview(false);
  });

  describe('notes', () => {
    it('should start empty', () => {
      expect(notes).toEqual([]);
    });

    it('should update via setNotes', () => {
      const newNotes = [{ id: '1', title: 'Test' }];
      setNotes(newNotes);
      expect(notes).toEqual(newNotes);
    });
  });

  describe('deletedNotes', () => {
    it('should start empty', () => {
      expect(deletedNotes).toEqual([]);
    });

    it('should update via setDeletedNotes', () => {
      const newDeleted = [{ id: '2', title: 'Deleted' }];
      setDeletedNotes(newDeleted);
      expect(deletedNotes).toEqual(newDeleted);
    });
  });

  describe('globalSettings', () => {
    it('should start empty', () => {
      expect(globalSettings).toEqual({});
    });

    it('should update via setGlobalSettings', () => {
      setGlobalSettings({ fontSize: 14, mode: 'dark' });
      expect(globalSettings.fontSize).toBe(14);
      expect(globalSettings.mode).toBe('dark');
    });
  });

  describe('isGlobalSettings', () => {
    it('should default to false', () => {
      expect(isGlobalSettings).toBe(false);
    });

    it('should toggle via setIsGlobalSettings', () => {
      setIsGlobalSettings(true);
      expect(isGlobalSettings).toBe(true);
    });
  });

  describe('activeNoteId', () => {
    it('should default to null', () => {
      expect(activeNoteId).toBeNull();
    });

    it('should set via setActiveNoteId', () => {
      setActiveNoteId('note-1');
      expect(activeNoteId).toBe('note-1');
    });
  });

  describe('originalNoteContent', () => {
    it('should default to empty string', () => {
      expect(originalNoteContent).toBe('');
    });

    it('should set via setOriginalNoteContent', () => {
      setOriginalNoteContent('# Hello');
      expect(originalNoteContent).toBe('# Hello');
    });
  });

  describe('isPreview', () => {
    it('should default to false', () => {
      expect(isPreview).toBe(false);
    });

    it('should toggle via setIsPreview', () => {
      setIsPreview(true);
      expect(isPreview).toBe(true);
    });
  });
});
