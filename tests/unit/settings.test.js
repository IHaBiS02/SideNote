import { describe, it, expect, beforeEach } from 'vitest';
import {
  DEFAULT_SETTINGS,
  applyMode,
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
    const settings = normalizeGlobalSettings({
      fontSize: 18,
      mode: 'dark',
      autoAddSpaces: true,
    });

    expect(settings.fontSize).toBe(18);
    expect(settings.mode).toBe('dark');
    expect(settings.wysiwygPreview).toBe(true);
    expect(settings.title).toBe(DEFAULT_SETTINGS.title);
    expect(settings.legacyLineBreakMode).toBe(false);
    expect(settings.autoLineBreak).toBe(false);
    expect(settings.showTildeReplacementButton).toBe(false);
    expect(settings).not.toHaveProperty('autoAddSpaces');
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
    setGlobalSettings({
      mode: 'light',
      legacyLineBreakMode: true,
      wysiwygPreview: false,
    });

    const effective = resolveEffectiveSettings({
      settings: {
        mode: 'dark',
        legacyLineBreakMode: false,
        wysiwygPreview: true,
      },
    });

    expect(effective.mode).toBe('light');
    expect(effective.legacyLineBreakMode).toBe(true);
    expect(effective.wysiwygPreview).toBe(false);
  });

  it('disables legacy line-break processors when legacy mode is off', () => {
    const effective = resolveLegacyTextProcessingSettings({
      legacyLineBreakMode: false,
      autoLineBreak: true,
      tildeReplacement: true,
    });

    expect(effective.autoLineBreak).toBe(false);
    expect(effective.tildeReplacement).toBe(false);
  });

  it('keeps legacy line-break processors when legacy mode is on', () => {
    const effective = resolveLegacyTextProcessingSettings({
      legacyLineBreakMode: true,
      autoLineBreak: true,
    });

    expect(effective.autoLineBreak).toBe(true);
  });

  it('keeps tilde replacement independent from legacy mode when its toolbar button is enabled', () => {
    const effective = resolveLegacyTextProcessingSettings({
      legacyLineBreakMode: false,
      showTildeReplacementButton: true,
      tildeReplacement: true,
    });

    expect(effective.autoLineBreak).toBe(false);
    expect(effective.tildeReplacement).toBe(true);
  });

  it('applies light and dark modes without a separate syntax-theme stylesheet', () => {
    document.body.className = '';

    applyMode('dark');
    expect(document.body.classList.contains('dark-mode')).toBe(true);

    applyMode('light');
    expect(document.body.classList.contains('dark-mode')).toBe(false);
  });
});
