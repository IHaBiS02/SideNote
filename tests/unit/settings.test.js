import { describe, it, expect, beforeEach } from 'vitest';
import {
  DEFAULT_SETTINGS,
  applyMode,
  normalizeGlobalSettings,
  normalizeLineHeight,
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
    expect(settings.lineHeight).toBe(1.5);
    expect(settings.sourceLineHeight).toBe(1.2);
    expect(settings.codeLineHeight).toBe(1.2);
    expect(settings.mode).toBe('dark');
    expect(settings.wysiwygPreview).toBe(true);
    expect(settings.title).toBe(DEFAULT_SETTINGS.title);
    expect(settings.legacyLineBreakMode).toBe(false);
    expect(settings.autoLineBreak).toBe(false);
    expect(settings.showTildeReplacementButton).toBe(false);
    expect(settings).not.toHaveProperty('autoAddSpaces');
  });

  it('normalizes line spacing to the supported range and precision', () => {
    expect(normalizeLineHeight(undefined)).toBe(1.5);
    expect(normalizeLineHeight(0.5)).toBe(1);
    expect(normalizeLineHeight(2.04)).toBe(2);
    expect(normalizeLineHeight(2.06)).toBe(2.1);
    expect(normalizeLineHeight(4)).toBe(3);
    expect(normalizeLineHeight(undefined, 1.2)).toBe(1.2);
  });

  it('resolves note-specific settings over normalized global settings', () => {
    setGlobalSettings({
      title: 'custom',
      fontSize: 14,
      lineHeight: 1.7,
      sourceLineHeight: 1.3,
      codeLineHeight: 1.4,
      codeBlockHeader: false,
      mode: 'dark',
    });

    const effective = resolveEffectiveSettings({
      settings: {
        fontSize: 20,
        lineHeight: 2.1,
        sourceLineHeight: 1.8,
        codeLineHeight: 1.9,
        codeBlockHeader: true,
      },
    });

    expect(effective.title).toBe('custom');
    expect(effective.fontSize).toBe(20);
    expect(effective.lineHeight).toBe(2.1);
    expect(effective.sourceLineHeight).toBe(1.8);
    expect(effective.codeLineHeight).toBe(1.9);
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
