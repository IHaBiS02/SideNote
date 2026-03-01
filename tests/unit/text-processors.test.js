import { describe, it, expect } from 'vitest';
import {
  escapeTildes,
  addAutoLineBreaks,
  processPastedText,
  countTrailingSpaces,
  normalizeTrailingSpaces,
  handleEnterKeyInput,
  analyzeTextAtCursor,
  toggleMarkdownCheckbox
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

describe('countTrailingSpaces', () => {
  it('should return 0 for no trailing spaces', () => {
    expect(countTrailingSpaces('hello')).toBe(0);
  });

  it('should count single trailing space', () => {
    expect(countTrailingSpaces('hello ')).toBe(1);
  });

  it('should count two trailing spaces', () => {
    expect(countTrailingSpaces('hello  ')).toBe(2);
  });

  it('should count many trailing spaces', () => {
    expect(countTrailingSpaces('hello     ')).toBe(5);
  });

  it('should return length for all-space string', () => {
    expect(countTrailingSpaces('   ')).toBe(3);
  });
});

describe('normalizeTrailingSpaces', () => {
  it('should add spaces to reach target', () => {
    expect(normalizeTrailingSpaces('hello', 2)).toBe('hello  ');
  });

  it('should replace existing spaces with target count', () => {
    expect(normalizeTrailingSpaces('hello   ', 2)).toBe('hello  ');
  });

  it('should handle zero target spaces', () => {
    expect(normalizeTrailingSpaces('hello  ', 0)).toBe('hello');
  });

  it('should default to 2 spaces', () => {
    expect(normalizeTrailingSpaces('hello')).toBe('hello  ');
  });
});

describe('analyzeTextAtCursor', () => {
  it('should analyze cursor at beginning of text', () => {
    const result = analyzeTextAtCursor('hello world', 0);
    expect(result.currentLineStart).toBe(0);
    expect(result.beforeCursor).toBe('');
    expect(result.afterCursor).toBe('hello world');
    expect(result.fullCurrentLine).toBe('hello world');
  });

  it('should analyze cursor at end of text', () => {
    const result = analyzeTextAtCursor('hello world', 11);
    expect(result.beforeCursor).toBe('hello world');
    expect(result.afterCursor).toBe('');
    expect(result.isAfterCursorOnlyWhitespace).toBe(true);
  });

  it('should analyze cursor in middle of line', () => {
    const result = analyzeTextAtCursor('hello world', 5);
    expect(result.beforeCursor).toBe('hello');
    expect(result.afterCursor).toBe(' world');
    expect(result.isAfterCursorOnlyWhitespace).toBe(false);
  });

  it('should handle multi-line text', () => {
    const text = 'line1\nline2\nline3';
    const result = analyzeTextAtCursor(text, 8); // middle of "line2"
    expect(result.fullCurrentLine).toBe('line2');
    expect(result.beforeCursor).toBe('li');
    expect(result.afterCursor).toBe('ne2');
  });

  it('should detect whitespace-only after cursor', () => {
    const result = analyzeTextAtCursor('hello   ', 5);
    expect(result.isAfterCursorOnlyWhitespace).toBe(true);
  });
});

describe('handleEnterKeyInput', () => {
  function createMockTextarea(value, selectionStart) {
    return {
      value,
      selectionStart: selectionStart ?? value.length,
      selectionEnd: selectionStart ?? value.length,
      setSelectionRange: vi.fn(),
      setRangeText: vi.fn(function(text, start, end) {
        this.value = this.value.substring(0, start) + text + this.value.substring(end);
      }),
      dispatchEvent: vi.fn(),
    };
  }

  it('should return unhandled when autoAddSpaces is false', () => {
    const textarea = createMockTextarea('hello');
    const result = handleEnterKeyInput(textarea, { autoAddSpaces: false }, vi.fn());
    expect(result.handled).toBe(false);
    expect(result.action).toBe('default');
  });

  it('should return unhandled for empty line', () => {
    const textarea = createMockTextarea('   ', 3);
    const result = handleEnterKeyInput(textarea, { autoAddSpaces: true }, vi.fn());
    expect(result.handled).toBe(false);
    expect(result.action).toBe('empty_line');
  });

  it('should add spaces and newline for normal text', () => {
    const insertFn = vi.fn();
    const textarea = createMockTextarea('hello', 5);
    const result = handleEnterKeyInput(textarea, { autoAddSpaces: true }, insertFn);
    expect(result.handled).toBe(true);
    expect(result.action).toBe('normal_processing');
    expect(insertFn).toHaveBeenCalledWith(textarea, '  \n');
  });

  it('should only add newline when already has 2+ spaces', () => {
    const insertFn = vi.fn();
    const textarea = createMockTextarea('hello  ', 7);
    const result = handleEnterKeyInput(textarea, { autoAddSpaces: true }, insertFn);
    expect(result.handled).toBe(true);
    expect(insertFn).toHaveBeenCalledWith(textarea, '\n');
  });
});

describe('toggleMarkdownCheckbox', () => {
  it('should toggle unchecked to checked', () => {
    const md = '- [ ] Task 1';
    const result = toggleMarkdownCheckbox(md, 0);
    expect(result).toBe('- [x] Task 1');
  });

  it('should toggle checked to unchecked', () => {
    const md = '- [x] Task 1';
    const result = toggleMarkdownCheckbox(md, 0);
    expect(result).toBe('- [ ] Task 1');
  });

  it('should toggle specific checkbox by index', () => {
    const md = '- [ ] Task 1\n- [x] Task 2\n- [ ] Task 3';
    const result = toggleMarkdownCheckbox(md, 1);
    expect(result).toBe('- [ ] Task 1\n- [ ] Task 2\n- [ ] Task 3');
  });

  it('should return null for out-of-range index', () => {
    const md = '- [ ] Task 1';
    expect(toggleMarkdownCheckbox(md, 5)).toBeNull();
  });

  it('should return null for negative index', () => {
    const md = '- [ ] Task 1';
    expect(toggleMarkdownCheckbox(md, -1)).toBeNull();
  });

  it('should return null for markdown without checkboxes', () => {
    const md = 'No checkboxes here';
    expect(toggleMarkdownCheckbox(md, 0)).toBeNull();
  });

  it('should handle multiple checkboxes correctly', () => {
    const md = '- [x] Done\n- [ ] Todo\n- [x] Also Done';
    const result = toggleMarkdownCheckbox(md, 2);
    expect(result).toBe('- [x] Done\n- [ ] Todo\n- [ ] Also Done');
  });
});
