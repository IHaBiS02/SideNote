import { describe, it, expect } from 'vitest';
import {
  escapeTildes,
  addAutoLineBreaks,
  processPastedText
} from '../../src/text-processors.js';

describe('escapeTildes', () => {
  it('should escape single tilde', () => {
    expect(escapeTildes('hello~world')).toBe('hello\\~world');
  });

  it('should escape multiple tildes', () => {
    expect(escapeTildes('~~strikethrough~~')).toBe('\\~\\~strikethrough\\~\\~');
  });

  it('should return empty string unchanged', () => {
    expect(escapeTildes('')).toBe('');
  });

  it('should not double-escape already escaped tildes', () => {
    // Current behavior: escapes the backslash's tilde again
    const result = escapeTildes('\\~');
    expect(result).toBe('\\\\~');
  });

  it('should handle text without tildes', () => {
    expect(escapeTildes('no tildes here')).toBe('no tildes here');
  });
});

describe('addAutoLineBreaks', () => {
  it('should return single-line text unchanged', () => {
    expect(addAutoLineBreaks('hello')).toBe('hello');
  });

  it('should add two spaces to non-empty non-last lines', () => {
    const result = addAutoLineBreaks('line1\nline2\nline3');
    expect(result).toBe('line1  \nline2  \nline3');
  });

  it('should not add spaces to empty lines', () => {
    const result = addAutoLineBreaks('line1\n\nline3');
    expect(result).toBe('line1  \n\nline3');
  });

  it('should return empty string unchanged', () => {
    expect(addAutoLineBreaks('')).toBe('');
  });

  it('should trim existing trailing spaces before adding', () => {
    const result = addAutoLineBreaks('line1   \nline2');
    expect(result).toBe('line1  \nline2');
  });
});

describe('processPastedText', () => {
  it('should return original text with no settings', () => {
    expect(processPastedText('hello', {})).toBe('hello');
  });

  it('should apply tilde escaping when enabled', () => {
    const result = processPastedText('~test~', { tildeReplacement: true });
    expect(result).toBe('\\~test\\~');
  });

  it('should apply auto line breaks when enabled', () => {
    const result = processPastedText('a\nb', { autoLineBreak: true });
    expect(result).toBe('a  \nb');
  });

  it('should apply both settings together', () => {
    const result = processPastedText('~a\n~b', { tildeReplacement: true, autoLineBreak: true });
    expect(result).toBe('\\~a  \n\\~b');
  });

  it('should not apply disabled settings', () => {
    const result = processPastedText('~a\n~b', { tildeReplacement: false, autoLineBreak: false });
    expect(result).toBe('~a\n~b');
  });
});
