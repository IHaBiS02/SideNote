import { describe, it, expect, beforeEach } from 'vitest';
import {
  DEFAULT_SETTINGS,
  normalizeGlobalSettings,
  resolveEffectiveSettings,
  resolveLegacyTextProcessingSettings
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
    expect(settings.legacyLineBreakMode).toBe(false);
    expect(settings.autoLineBreak).toBe(false);
    expect(settings.autoAddSpaces).toBe(false);
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

  it('disables legacy line-break processors when legacy mode is off', () => {
    const effective = resolveLegacyTextProcessingSettings({
      legacyLineBreakMode: false,
      autoLineBreak: true,
      autoAddSpaces: true,
      tildeReplacement: true,
    });

    expect(effective.autoLineBreak).toBe(false);
    expect(effective.autoAddSpaces).toBe(false);
    expect(effective.tildeReplacement).toBe(true);
  });

  it('keeps legacy line-break processors when legacy mode is on', () => {
    const effective = resolveLegacyTextProcessingSettings({
      legacyLineBreakMode: true,
      autoLineBreak: true,
      autoAddSpaces: true,
    });

    expect(effective.autoLineBreak).toBe(true);
    expect(effective.autoAddSpaces).toBe(true);
  });
});
