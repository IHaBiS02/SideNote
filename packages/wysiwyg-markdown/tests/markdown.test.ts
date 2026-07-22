import { describe, expect, it } from 'vitest';
import syntaxTestMarkdown from '../MARKDOWN_SYNTAX_TEST.md?raw';
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

  it('serializes automatic links with explicit Markdown link syntax', () => {
    const url = 'https://youtu.be/YcO-MxPf_Vg?si=--UyINcJ33oxOCE-';

    expect(serializeMarkdown(parseMarkdown(url))).toBe(`[${url}](${url})`);
    expect(serializeMarkdown(parseMarkdown(`<${url}>`))).toBe(`[${url}](${url})`);
    expect(
      serializeMarkdown(parseMarkdown('[Example 방문하기](https://example.com)')),
    ).toBe('[Example 방문하기](https://example.com)');
  });

  it('keeps the manual syntax test document in sync with every supported node and mark', () => {
    const document = parseMarkdown(syntaxTestMarkdown);
    const nodeTypes = new Set<string>([document.type.name]);
    const markTypes = new Set<string>();

    document.descendants((node) => {
      nodeTypes.add(node.type.name);
      node.marks.forEach((mark) => markTypes.add(mark.type.name));
    });

    expect(nodeTypes).toEqual(
      new Set([
        'doc',
        'paragraph',
        'blockquote',
        'horizontal_rule',
        'heading',
        'code_block',
        'ordered_list',
        'bullet_list',
        'list_item',
        'text',
        'image',
        'hard_break',
        'soft_break',
        'table',
        'table_row',
        'table_header',
        'table_cell',
      ]),
    );
    expect(markTypes).toEqual(
      new Set(['em', 'strong', 'link', 'code', 'strike']),
    );
  });
});
