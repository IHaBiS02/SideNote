import MarkdownIt from 'markdown-it';
import { Schema, type MarkSpec, type Node as ProseMirrorNode } from 'prosemirror-model';
import {
  defaultMarkdownParser,
  defaultMarkdownSerializer,
  MarkdownParser,
  MarkdownSerializer,
  type MarkdownSerializerState,
  schema as commonMarkSchema,
} from 'prosemirror-markdown';

const baseListItem = commonMarkSchema.spec.nodes.get('list_item');
if (!baseListItem) throw new Error('CommonMark list_item schema is unavailable.');

const nodes = commonMarkSchema.spec.nodes
  .update('list_item', {
    ...baseListItem,
    attrs: {
      checked: { default: null },
    },
    parseDOM: [
      {
        tag: 'li',
        getAttrs: (element) => {
          const item = element as HTMLElement;
          if (!item.hasAttribute('data-task')) return { checked: null };
          return { checked: item.getAttribute('data-checked') === 'true' };
        },
      },
    ],
    toDOM(node) {
      const checked = node.attrs.checked;
      return [
        'li',
        checked === null
          ? {}
          : {
              'data-task': 'true',
              'data-checked': checked ? 'true' : 'false',
            },
        0,
      ];
    },
  })
  .append({
    soft_break: {
      inline: true,
      group: 'inline',
      selectable: false,
      parseDOM: [{ tag: 'br[data-soft-break]' }],
      toDOM() {
        return ['br', { 'data-soft-break': 'true' }];
      },
    },
    table: {
      content: 'table_row+',
      group: 'block',
      isolating: true,
      parseDOM: [{ tag: 'table' }],
      toDOM() {
        return ['table', ['tbody', 0]];
      },
    },
    table_row: {
      content: '(table_header | table_cell)+',
      parseDOM: [{ tag: 'tr' }],
      toDOM() {
        return ['tr', 0];
      },
    },
    table_header: {
      attrs: { align: { default: null } },
      content: 'inline*',
      defining: true,
      parseDOM: [{ tag: 'th' }],
      toDOM(node) {
        return ['th', node.attrs.align ? { style: `text-align: ${node.attrs.align}` } : {}, 0];
      },
    },
    table_cell: {
      attrs: { align: { default: null } },
      content: 'inline*',
      defining: true,
      parseDOM: [{ tag: 'td' }],
      toDOM(node) {
        return ['td', node.attrs.align ? { style: `text-align: ${node.attrs.align}` } : {}, 0];
      },
    },
  });

const marks = commonMarkSchema.spec.marks.append({
  strike: {
    parseDOM: [
      { tag: 's' },
      { tag: 'del' },
      { style: 'text-decoration=line-through' },
    ],
    toDOM() {
      return ['s', 0];
    },
  } satisfies MarkSpec,
});

export const markdownSchema = new Schema({ nodes, marks });

function alignmentFromStyle(style: string | null): { align: string | null } {
  const alignment = /text-align:\s*(left|center|right)/i.exec(style ?? '')?.[1];
  return { align: alignment?.toLowerCase() ?? null };
}

const tokenizer = new MarkdownIt('default', {
  html: false,
  linkify: true,
});

tokenizer.core.ruler.after('inline', 'sidenote-task-list', (state) => {
  for (let index = 0; index < state.tokens.length; index += 1) {
    const item = state.tokens[index];
    if (item.type !== 'list_item_open') continue;

    for (let childIndex = index + 1; childIndex < state.tokens.length; childIndex += 1) {
      const inline = state.tokens[childIndex];
      if (inline.type === 'list_item_close') break;
      if (inline.type !== 'inline') continue;

      const marker = /^\[([ xX])\]\s+/.exec(inline.content);
      if (!marker) break;
      item.meta = {
        ...item.meta,
        task: true,
        checked: marker[1].toLowerCase() === 'x',
      };
      inline.content = inline.content.slice(marker[0].length);
      const firstText = inline.children?.find((child) => child.type === 'text');
      if (firstText) firstText.content = firstText.content.slice(marker[0].length);
      break;
    }
  }
});

const parserTokens = {
  ...defaultMarkdownParser.tokens,
  list_item: {
    block: 'list_item',
    getAttrs: (token: { meta?: { task?: boolean; checked?: boolean } }) => ({
      checked: token.meta?.task ? Boolean(token.meta.checked) : null,
    }),
  },
  softbreak: { node: 'soft_break' },
  s: { mark: 'strike' },
  table: { block: 'table' },
  thead: { ignore: true },
  tbody: { ignore: true },
  tr: { block: 'table_row' },
  th: {
    block: 'table_header',
    getAttrs: (token: { attrGet(name: string): string | null }) =>
      alignmentFromStyle(token.attrGet('style')),
  },
  td: {
    block: 'table_cell',
    getAttrs: (token: { attrGet(name: string): string | null }) =>
      alignmentFromStyle(token.attrGet('style')),
  },
};

const markdownParser = new MarkdownParser(markdownSchema, tokenizer, parserTokens);

let markdownSerializer: MarkdownSerializer;

function serializeTableCell(node: ProseMirrorNode): string {
  const paragraph = markdownSchema.nodes.paragraph.create(null, node.content);
  const document = markdownSchema.topNodeType.create(null, [paragraph]);
  return markdownSerializer
    .serialize(document)
    .trim()
    .replace(/(?<!\\)\|/g, '\\|')
    .replace(/\n/g, '<br>');
}

function tableDelimiter(alignment: string | null): string {
  if (alignment === 'left') return ':---';
  if (alignment === 'center') return ':---:';
  if (alignment === 'right') return '---:';
  return '---';
}

function renderTable(state: MarkdownSerializerState, node: ProseMirrorNode): void {
  const rows: string[][] = [];
  const alignments: Array<string | null> = [];

  node.forEach((row, _offset, rowIndex) => {
    const cells: string[] = [];
    row.forEach((cell, _cellOffset, cellIndex) => {
      cells.push(serializeTableCell(cell));
      if (rowIndex === 0) alignments[cellIndex] = cell.attrs.align ?? null;
    });
    rows.push(cells);
  });

  if (!rows.length) return;
  const columnCount = Math.max(...rows.map((row) => row.length));
  const normalize = (row: string[]) => [
    ...row,
    ...Array.from({ length: columnCount - row.length }, () => ''),
  ];
  const line = (row: string[]) => `| ${normalize(row).join(' | ')} |`;
  const output = [
    line(rows[0]),
    line(
      Array.from({ length: columnCount }, (_, index) =>
        tableDelimiter(alignments[index] ?? null),
      ),
    ),
    ...rows.slice(1).map(line),
  ];

  state.write(output.join('\n'));
  state.closeBlock(node);
}

markdownSerializer = new MarkdownSerializer(
  {
    ...defaultMarkdownSerializer.nodes,
    list_item(state, node) {
      if (node.attrs.checked !== null) {
        state.write(`[${node.attrs.checked ? 'x' : ' '}] `);
      }
      state.renderContent(node);
    },
    soft_break(state) {
      state.write('\n');
    },
    table: renderTable,
    table_row() {},
    table_header() {},
    table_cell() {},
  },
  {
    ...defaultMarkdownSerializer.marks,
    strike: {
      open: '~~',
      close: '~~',
      mixable: true,
      expelEnclosingWhitespace: true,
    },
  },
);

export function parseMarkdown(markdown: string): ProseMirrorNode {
  return markdownParser.parse(markdown ?? '');
}

export function serializeMarkdown(document: ProseMirrorNode): string {
  return markdownSerializer.serialize(document);
}
