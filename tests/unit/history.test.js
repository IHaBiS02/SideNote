import { describe, it, expect, beforeEach } from 'vitest';
import {
  pushToHistory,
  moveBack,
  moveForward,
  canMoveBack,
  canMoveForward,
  getCurrentHistoryState,
  clearHistory,
  getHistory,
  getHistoryIndex,
  goToHistoryState
} from '../../src/history.js';

describe('history', () => {
  beforeEach(() => {
    clearHistory();
  });

  describe('pushToHistory', () => {
    it('should add state to history', () => {
      pushToHistory({ view: 'list' });
      expect(getHistory()).toHaveLength(1);
      expect(getCurrentHistoryState()).toEqual({ view: 'list' });
    });

    it('should prevent duplicate consecutive states', () => {
      pushToHistory({ view: 'list' });
      pushToHistory({ view: 'list' });
      expect(getHistory()).toHaveLength(1);
    });

    it('should allow different states', () => {
      pushToHistory({ view: 'list' });
      pushToHistory({ view: 'editor', params: { noteId: '1', inEditMode: true } });
      expect(getHistory()).toHaveLength(2);
    });

    it('should truncate future history when branching', () => {
      pushToHistory({ view: 'list' });
      pushToHistory({ view: 'editor', params: { noteId: '1' } });
      pushToHistory({ view: 'settings', params: { isGlobal: true } });
      moveBack(); // now at editor
      moveBack(); // now at list
      pushToHistory({ view: 'recycleBin' }); // branch
      expect(getHistory()).toHaveLength(2); // list + recycleBin
    });

    it('should respect 512 limit', () => {
      for (let i = 0; i < 520; i++) {
        pushToHistory({ view: 'editor', params: { noteId: String(i) } });
      }
      expect(getHistory()).toHaveLength(512);
    });
  });

  describe('moveBack / moveForward', () => {
    it('should move back to previous state', () => {
      pushToHistory({ view: 'list' });
      pushToHistory({ view: 'editor', params: { noteId: '1' } });
      const state = moveBack();
      expect(state.view).toBe('list');
    });

    it('should move forward to next state', () => {
      pushToHistory({ view: 'list' });
      pushToHistory({ view: 'editor', params: { noteId: '1' } });
      moveBack();
      const state = moveForward();
      expect(state.view).toBe('editor');
    });

    it('should return undefined when at beginning', () => {
      pushToHistory({ view: 'list' });
      expect(moveBack()).toBeUndefined();
    });

    it('should return undefined when at end', () => {
      pushToHistory({ view: 'list' });
      expect(moveForward()).toBeUndefined();
    });
  });

  describe('canMoveBack / canMoveForward', () => {
    it('should not move back with single entry', () => {
      pushToHistory({ view: 'list' });
      expect(canMoveBack()).toBe(false);
    });

    it('should move back with multiple entries', () => {
      pushToHistory({ view: 'list' });
      pushToHistory({ view: 'editor', params: { noteId: '1' } });
      expect(canMoveBack()).toBe(true);
    });

    it('should not move forward at end', () => {
      pushToHistory({ view: 'list' });
      pushToHistory({ view: 'editor', params: { noteId: '1' } });
      expect(canMoveForward()).toBe(false);
    });

    it('should move forward after moving back', () => {
      pushToHistory({ view: 'list' });
      pushToHistory({ view: 'editor', params: { noteId: '1' } });
      moveBack();
      expect(canMoveForward()).toBe(true);
    });
  });

  describe('clearHistory', () => {
    it('should empty the history', () => {
      pushToHistory({ view: 'list' });
      pushToHistory({ view: 'editor', params: { noteId: '1' } });
      clearHistory();
      expect(getHistory()).toHaveLength(0);
      expect(getHistoryIndex()).toBe(-1);
      expect(getCurrentHistoryState()).toBeUndefined();
    });
  });

  describe('goToHistoryState', () => {
    it('should jump to specific index', () => {
      pushToHistory({ view: 'list' });
      pushToHistory({ view: 'editor', params: { noteId: '1' } });
      pushToHistory({ view: 'settings', params: { isGlobal: true } });
      goToHistoryState(0);
      expect(getCurrentHistoryState().view).toBe('list');
      expect(getHistoryIndex()).toBe(0);
    });

    it('should ignore invalid index', () => {
      pushToHistory({ view: 'list' });
      goToHistoryState(99);
      expect(getHistoryIndex()).toBe(0);
      goToHistoryState(-1);
      expect(getHistoryIndex()).toBe(0);
    });
  });

  describe('getHistory / getHistoryIndex', () => {
    it('should return a copy of history array', () => {
      pushToHistory({ view: 'list' });
      const history = getHistory();
      history.push({ view: 'fake' });
      expect(getHistory()).toHaveLength(1);
    });

    it('should return -1 for empty history', () => {
      expect(getHistoryIndex()).toBe(-1);
    });

    it('should track index correctly', () => {
      pushToHistory({ view: 'list' });
      expect(getHistoryIndex()).toBe(0);
      pushToHistory({ view: 'editor', params: { noteId: '1' } });
      expect(getHistoryIndex()).toBe(1);
      moveBack();
      expect(getHistoryIndex()).toBe(0);
    });
  });
});
