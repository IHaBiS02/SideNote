import { describe, expect, it } from 'vitest';
import { parseMarkdown, serializeMarkdown } from '../src/core/markdown';

describe('Markdown conversion', () => {
  it('round-trips the supported document structure', () => {
    const source = [
      '# Heading',
      '',
      'A paragraph with **bold**, *italic*, and `code`.',
      '',
      '- first',
      '- second',
      '',
      '> quote',
    ].join('\n');

    const serialized = serializeMarkdown(parseMarkdown(source));

    expect(serialized).toContain('# Heading');
    expect(serialized).toContain('**bold**');
    expect(serialized).toContain('*italic*');
    // The serializer intentionally canonicalizes unordered list markers.
    expect(serialized).toContain('* first');
    expect(serialized).toContain('> quote');
  });

  it('accepts an empty document', () => {
    expect(serializeMarkdown(parseMarkdown(''))).toBe('');
  });

  it('preserves GFM task lists and strikethrough', () => {
    const source = ['- [ ] open', '- [x] done', '', '~~removed~~'].join('\n');

    const serialized = serializeMarkdown(parseMarkdown(source));

    expect(serialized).toContain('* [ ] open');
    expect(serialized).toContain('* [x] done');
    expect(serialized).toContain('~~removed~~');
  });

  it('preserves GFM tables and alignment', () => {
    const source = [
      '| Left | Center | Right |',
      '| :--- | :---: | ---: |',
      '| one | **two** | three |',
    ].join('\n');

    const serialized = serializeMarkdown(parseMarkdown(source));

    expect(serialized).toContain('| Left | Center | Right |');
    expect(serialized).toContain('| :--- | :---: | ---: |');
    expect(serialized).toContain('| one | **two** | three |');
  });

  it('keeps soft line breaks as plain newlines', () => {
    const source = 'first line\nsecond line';

    expect(serializeMarkdown(parseMarkdown(source))).toBe(source);
  });
});
