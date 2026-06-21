import { describe, it, expect, beforeEach } from 'vitest';
import {
  DEFAULT_SETTINGS,
  normalizeGlobalSettings,
  resolveEffectiveSettings
} from '../../src/settings.js';
import { setGlobalSettings } from '../../src/state.js';

describe('settings model helpers', () => {
  beforeEach(() => {
    setGlobalSettings({});
  });

  it('normalizes partial global settings with defaults', () => {
    const settings = normalizeGlobalSettings({ fontSize: 18, mode: 'dark' });

    expect(settings.fontSize).toBe(18);
    expect(settings.mode).toBe('dark');
    expect(settings.title).toBe(DEFAULT_SETTINGS.title);
    expect(settings.autoLineBreak).toBe(true);
  });

  it('resolves note-specific settings over normalized global settings', () => {
    setGlobalSettings({
      title: 'custom',
      fontSize: 14,
      codeBlockHeader: false,
      mode: 'dark',
    });

    const effective = resolveEffectiveSettings({
      settings: {
        fontSize: 20,
        codeBlockHeader: true,
      },
    });

    expect(effective.title).toBe('custom');
    expect(effective.fontSize).toBe(20);
    expect(effective.codeBlockHeader).toBe(true);
    expect(effective.mode).toBe('dark');
  });

  it('does not let note settings override global-only settings', () => {
    setGlobalSettings({ mode: 'light', autoAddSpaces: true });

    const effective = resolveEffectiveSettings({
      settings: {
        mode: 'dark',
        autoAddSpaces: false,
      },
    });

    expect(effective.mode).toBe('light');
    expect(effective.autoAddSpaces).toBe(true);
  });
});
