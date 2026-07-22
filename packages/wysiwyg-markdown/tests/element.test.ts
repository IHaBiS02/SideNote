import { describe, expect, it, vi } from 'vitest';
import { Selection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import '../src/index';
import type { WysiwygMarkdownElement } from '../src/element/wysiwyg-markdown';
import { editorStyles } from '../src/element/styles';

async function createEditor(markdown = ''): Promise<WysiwygMarkdownElement> {
  const editor = document.createElement('wysiwyg-markdown');
  editor.value = markdown;
  document.body.append(editor);
  await editor.updateComplete;
  return editor;
}

function selectDocumentEnd(editor: WysiwygMarkdownElement): void {
  editor.use({
    name: 'test-select-document-end',
    commands: {
      selectDocumentEnd: ({ state, dispatch }) => {
        if (dispatch) {
          dispatch(state.tr.setSelection(Selection.atEnd(state.doc)));
        }
        return true;
      },
    },
  });
  editor.execute('selectDocumentEnd');
}

describe('wysiwyg-markdown element', () => {
  it('uses one background variable across every fenced code body layer', () => {
    expect(editorStyles.cssText).toContain(
      '--editor-code-background: var(--editor-muted-background)',
    );
    expect(editorStyles.cssText).toContain(
      '.editor-mount .ProseMirror .code-block-content > pre > code',
    );
    expect(editorStyles.cssText).toContain(
      'background: var(--editor-code-background)',
    );
    expect(editorStyles.cssText).toContain(
      '--editor-code-content-padding: 5px',
    );
    expect(editorStyles.cssText).toContain(
      'padding: var(--editor-code-content-padding)',
    );
    expect(editorStyles.cssText).toContain(
      'column-gap: var(--editor-code-content-padding)',
    );
    expect(editorStyles.cssText).toContain(
      'padding-inline: 0 var(--editor-code-content-padding)',
    );
    expect(editorStyles.cssText).toContain('--editor-line-height: 1.5');
    expect(editorStyles.cssText).toContain(
      '--editor-list-marker-color: color-mix(in srgb, currentColor 60%, transparent)',
    );
    expect(editorStyles.cssText).toContain(
      'color: var(--editor-list-marker-color)',
    );
    expect(editorStyles.cssText).toContain('--editor-table-border-color: currentColor');
    expect(editorStyles.cssText).toContain(
      'border: 1px solid var(--editor-table-border-color)',
    );
    expect(editorStyles.cssText).toContain('--editor-heading-line-height: 1.5');
    expect(editorStyles.cssText).toContain('--editor-source-line-height: 1.2');
    expect(editorStyles.cssText).toContain('--editor-code-line-height: 1.2');
    expect(editorStyles.cssText).toContain(
      'line-height: var(--editor-source-line-height)',
    );
    expect(editorStyles.cssText).toContain(
      'line-height: var(--editor-code-line-height)',
    );
    expect(editorStyles.cssText).toContain(
      '.editor-mount .ProseMirror pre.code-block-body',
    );
    expect(editorStyles.cssText).toContain('margin-block: 0.67em');
    expect(editorStyles.cssText).toContain('font-weight: 700');
  });

  it('renders Markdown and exposes its canonical value', async () => {
    const editor = await createEditor('# Hello');

    expect(editor.getMarkdown()).toBe('# Hello');
    expect(editor.renderRoot.querySelector('h1')?.textContent).toBe('Hello');
  });

  it('centers default table cells while preserving explicit Markdown alignment', async () => {
    const editor = await createEditor([
      '| Default | Left | Right |',
      '| --- | :--- | ---: |',
      '| one | two | three |',
    ].join('\n'));
    const headers = editor.renderRoot.querySelectorAll('th');
    const cells = editor.renderRoot.querySelectorAll('td');

    expect(editorStyles.cssText).toContain('text-align: center');
    expect(editorStyles.cssText).toContain('--editor-table-aligned-cell-padding: 5px');
    expect(editorStyles.cssText).toContain(
      'padding-left: var(--editor-table-aligned-cell-padding)',
    );
    expect(editorStyles.cssText).toContain(
      'padding-right: var(--editor-table-aligned-cell-padding)',
    );
    expect(headers[0]?.getAttribute('style')).toBeNull();
    expect(headers[1]?.getAttribute('style')).toContain('text-align: left');
    expect(headers[2]?.getAttribute('style')).toContain('text-align: right');
    expect(cells[0]?.getAttribute('style')).toBeNull();
    expect(cells[1]?.getAttribute('style')).toContain('text-align: left');
    expect(cells[2]?.getAttribute('style')).toContain('text-align: right');
  });

  it('updates the document through setMarkdown', async () => {
    const editor = await createEditor('Initial');

    editor.setMarkdown('## Updated');
    await editor.updateComplete;

    expect(editor.getMarkdown()).toBe('## Updated');
    expect(editor.renderRoot.querySelector('h2')?.textContent).toBe('Updated');
  });

  it('keeps raw source text until source mode is committed', async () => {
    const editor = await createEditor('# Before');
    editor.setMode('source');
    await editor.updateComplete;

    const source = editor.renderRoot.querySelector<HTMLTextAreaElement>('#document-source');
    expect(source).not.toBeNull();
    source!.value = '# After';
    source!.dispatchEvent(new InputEvent('input', { bubbles: true }));
    await editor.updateComplete;

    expect(editor.value).toBe('# After');
    expect(editor.renderRoot.querySelector('h1')?.textContent).toBe('Before');

    editor.setMode('wysiwyg');
    await editor.updateComplete;
    expect(editor.renderRoot.querySelector('h1')?.textContent).toBe('After');

    expect(editor.undo()).toBe(true);
    await editor.updateComplete;
    expect(editor.renderRoot.querySelector('h1')?.textContent).toBe('Before');
  });

  it('opens the full document source editor on double-click by default', async () => {
    const editor = await createEditor('# Heading\n\nParagraph');
    editor.setMode('readonly');
    await editor.updateComplete;

    editor.renderRoot.querySelector<HTMLElement>('#editor-mount')!.dispatchEvent(
      new MouseEvent('dblclick', { bubbles: true }),
    );
    await editor.updateComplete;

    const source = editor.renderRoot.querySelector<HTMLTextAreaElement>('#document-source');
    expect(editor.mode).toBe('source');
    expect(source?.hidden).toBe(false);
    expect(source?.value).toBe('# Heading\n\nParagraph');

    source!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', ctrlKey: true, bubbles: true }),
    );
    await editor.updateComplete;
    expect(editor.mode).toBe('readonly');
  });

  it('places the source caret at the matching Markdown syntax position', async () => {
    const cases = [
      { markdown: '# Heading\n\nParagraph', position: 5, expectedOffset: 6 },
      {
        markdown: 'Before [Example](https://example.com) after',
        position: 18,
        expectedOffset: 40,
      },
      {
        markdown: '```js\nfirst\nsecond\n```',
        position: 10,
        expectedOffset: 15,
      },
    ];
    const positionAtCoords = vi
      .spyOn(EditorView.prototype, 'posAtCoords')
      .mockReturnValue({ pos: 0, inside: 0 });

    try {
      for (const { markdown, position, expectedOffset } of cases) {
        const editor = await createEditor(markdown);
        editor.setMode('readonly');
        await editor.updateComplete;
        positionAtCoords.mockReturnValue({ pos: position, inside: 0 });

        editor.renderRoot
          .querySelector<HTMLElement>('#editor-mount')!
          .dispatchEvent(
            new MouseEvent('dblclick', { bubbles: true, clientX: 40, clientY: 20 }),
          );
        await editor.updateComplete;
        await Promise.resolve();

        const source = editor.renderRoot.querySelector<HTMLTextAreaElement>(
          '#document-source',
        );
        expect(source?.value).toBe(markdown);
        expect(source?.selectionStart).toBe(expectedOffset);
        expect(source?.selectionEnd).toBe(expectedOffset);

        const selections: Array<{ from: number; to: number }> = [];
        editor.addEventListener('selection-change', (event) => {
          selections.push(
            (event as CustomEvent<{ from: number; to: number }>).detail,
          );
        });
        source!.setSelectionRange(expectedOffset, expectedOffset);
        editor.setMode('wysiwyg');
        await editor.updateComplete;
        expect(selections.at(-1)).toEqual({ from: position, to: position });
        editor.remove();
      }
    } finally {
      positionAtCoords.mockRestore();
    }
  });

  it('centers the synchronized caret when switching in both directions', async () => {
    const editor = await createEditor('# Heading\n\nParagraph');
    const source = editor.renderRoot.querySelector<HTMLTextAreaElement>(
      '#document-source',
    )!;
    const mount = editor.renderRoot.querySelector<HTMLElement>('#editor-mount')!;
    source.style.fontSize = '16px';
    source.style.lineHeight = '20px';
    Object.defineProperties(source, {
      clientWidth: { configurable: true, value: 400 },
      clientHeight: { configurable: true, value: 200 },
      scrollHeight: { configurable: true, value: 1000 },
    });
    Object.defineProperties(mount, {
      clientHeight: { configurable: true, value: 200 },
      scrollHeight: { configurable: true, value: 1000 },
    });

    const rectangle = (top: number, bottom: number): DOMRect =>
      ({
        x: 0,
        y: top,
        top,
        bottom,
        left: 0,
        right: 400,
        width: 400,
        height: bottom - top,
        toJSON: () => ({}),
      }) as DOMRect;
    const positionAtCoords = vi
      .spyOn(EditorView.prototype, 'posAtCoords')
      .mockReturnValue({ pos: 5, inside: 0 });
    const coordsAtPos = vi.spyOn(EditorView.prototype, 'coordsAtPos').mockReturnValue({
      top: 500,
      bottom: 520,
      left: 0,
      right: 0,
    });
    const boundingRect = vi
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockImplementation(function (this: HTMLElement) {
        if (this.classList.contains('source-caret-marker')) return rectangle(500, 520);
        if (this.classList.contains('source-caret-mirror')) return rectangle(0, 1000);
        if (this.id === 'editor-mount') return rectangle(0, 200);
        return rectangle(0, 0);
      });

    try {
      mount.dispatchEvent(
        new MouseEvent('dblclick', { bubbles: true, clientX: 40, clientY: 20 }),
      );
      await editor.updateComplete;

      expect(source.selectionStart).toBe(6);
      expect(source.scrollTop).toBe(410);

      source.setSelectionRange(6, 6);
      mount.scrollTop = 0;
      editor.setMode('wysiwyg');
      await editor.updateComplete;

      expect(coordsAtPos).toHaveBeenCalledWith(5);
      expect(mount.scrollTop).toBe(410);
    } finally {
      boundingRect.mockRestore();
      coordsAtPos.mockRestore();
      positionAtCoords.mockRestore();
    }
  });

  it('keeps block source editing as an explicit opt-in', async () => {
    const editor = await createEditor('Paragraph');

    expect(editor.sourceEditScope).toBe('document');
    editor.sourceEditScope = 'block';
    await editor.updateComplete;

    expect(editor.getAttribute('source-edit-scope')).toBe('block');
  });

  it('applies trusted host theme CSS inside the shadow root', async () => {
    const editor = await createEditor('Paragraph');
    editor.themeCss = '.ProseMirror pre { white-space: pre-wrap; }';
    await editor.updateComplete;

    expect(
      editor.renderRoot.querySelector<HTMLStyleElement>('#host-theme')?.textContent,
    ).toContain('white-space: pre-wrap');
  });

  it('renders fenced code language and copies the raw code', async () => {
    const editor = await createEditor('```text\nfirst line\nsecond line\n```');
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    const header = editor.renderRoot.querySelector<HTMLElement>('.code-block-header');
    const language = editor.renderRoot.querySelector<HTMLInputElement>(
      '.code-block-language-editor',
    );
    const copyButton = editor.renderRoot.querySelector<HTMLButtonElement>('.copy-code-button');

    expect(header?.hidden).toBe(false);
    expect(language?.value).toBe('text');
    copyButton?.click();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(writeText).toHaveBeenCalledWith('first line\nsecond line');
    expect(copyButton?.textContent).toBe('✓');
  });

  it('edits the fenced code language from the non-content code header', async () => {
    const editor = await createEditor('```javascript\nasdfasdfasdfasdf\n```');
    const header = editor.renderRoot.querySelector<HTMLElement>('.code-block-header');
    const languageEditor = editor.renderRoot.querySelector<HTMLInputElement>(
      '.code-block-language-editor',
    );
    const languageDisplay = editor.renderRoot.querySelector<HTMLElement>(
      '.code-block-language-display',
    );

    expect(header?.contentEditable).toBe('false');
    expect(languageEditor?.value).toBe('javascript');
    expect(languageDisplay?.textContent).toBe('javascript');
    expect(languageEditor?.nextElementSibling).toBe(languageDisplay);
    expect(languageEditor?.readOnly).toBe(false);
    languageEditor?.focus();
    expect((editor.renderRoot as ShadowRoot).activeElement).toBe(languageEditor);
    const inputListener = vi.fn();
    editor.addEventListener('input', inputListener);

    languageEditor!.value = 'typescript';
    languageEditor?.dispatchEvent(
      new InputEvent('input', { bubbles: true, composed: true }),
    );
    expect(inputListener).not.toHaveBeenCalled();
    languageEditor?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
    );
    await editor.updateComplete;

    expect(languageEditor?.readOnly).toBe(false);
    expect(languageEditor?.value).toBe('typescript');
    expect(languageDisplay?.textContent).toBe('typescript');
    expect(editor.value).toBe('```typescript\nasdfasdfasdfasdf\n```');
    expect(inputListener).toHaveBeenCalledTimes(1);

    languageEditor?.focus();
    languageEditor!.value = '';
    languageEditor?.blur();
    await editor.updateComplete;

    expect(languageEditor?.value).toBe('');
    expect(languageEditor?.placeholder).toBe('text');
    expect(languageDisplay?.textContent).toBe('text');
    expect(editor.value).toBe('```\nasdfasdfasdfasdf\n```');
  });

  it('cancels fenced code language editing with Escape', async () => {
    const editor = await createEditor('```javascript\nconst value = 1;\n```');
    const languageEditor = editor.renderRoot.querySelector<HTMLInputElement>(
      '.code-block-language-editor',
    );

    expect(languageEditor?.readOnly).toBe(false);
    languageEditor?.focus();
    languageEditor!.value = 'typescript';
    languageEditor?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );

    expect(languageEditor?.readOnly).toBe(false);
    expect(languageEditor?.value).toBe('javascript');
    expect(editor.value).toBe('```javascript\nconst value = 1;\n```');
  });

  it('locks code language controls outside editable WYSIWYG mode', async () => {
    const editor = await createEditor('```javascript\nconst value = 1;\n```');
    const languageEditor = editor.renderRoot.querySelector<HTMLInputElement>(
      '.code-block-language-editor',
    );

    expect(languageEditor?.readOnly).toBe(false);
    editor.setMode('readonly');
    await editor.updateComplete;
    expect(languageEditor?.readOnly).toBe(true);

    editor.setMode('wysiwyg');
    await editor.updateComplete;
    expect(languageEditor?.readOnly).toBe(false);
  });

  it('can hide code block headers without changing the code block', async () => {
    const editor = await createEditor('```js\nconst value = 1;\n```');
    editor.showCodeBlockHeader = false;
    await editor.updateComplete;

    expect(editor.renderRoot.querySelector<HTMLElement>('.code-block-header')?.hidden).toBe(true);
    expect(editor.renderRoot.querySelector('.code-block-body > code')?.textContent).toBe(
      'const value = 1;',
    );
  });

  it('renders host-provided syntax tokens as editable decorations', async () => {
    const editor = await createEditor('```js\nconst value = 1;\n```');
    const highlighter = vi.fn(() => [
      { from: 0, to: 5, className: 'hljs-keyword' },
      { from: 14, to: 15, className: 'hljs-number' },
    ]);

    editor.codeHighlighter = highlighter;
    await editor.updateComplete;

    expect(highlighter).toHaveBeenCalledWith('const value = 1;', 'js');
    expect(editor.renderRoot.querySelector('.hljs-keyword')?.textContent).toBe('const');
    expect(editor.renderRoot.querySelector('.hljs-number')?.textContent).toBe('1');
    expect(
      editor.renderRoot
        .querySelector('.code-block-body > code')
        ?.getAttribute('contenteditable'),
    ).not.toBe('false');
  });

  it('shows a non-editable line number gutter when enabled', async () => {
    const editor = await createEditor('```text\nfirst\nsecond\n```');
    editor.showCodeLineNumbers = true;
    await editor.updateComplete;

    const gutter = editor.renderRoot.querySelector<HTMLElement>('.code-line-numbers');
    expect(gutter?.hidden).toBe(false);
    expect(gutter?.textContent).toBe('1\n2');
    expect(gutter?.tagName).toBe('PRE');
    expect(gutter?.querySelector('code')?.textContent).toBe('1\n2');
    expect(gutter?.contentEditable).toBe('false');
    expect(editor.renderRoot.querySelector('.code-block-body > code')?.textContent).toBe(
      'first\nsecond',
    );
  });

  it('hides the line number gutter for a single-line code block', async () => {
    const editor = await createEditor('```text\nsingle line\n```');
    editor.showCodeLineNumbers = true;
    await editor.updateComplete;

    const gutter = editor.renderRoot.querySelector<HTMLElement>('.code-line-numbers');
    const content = editor.renderRoot.querySelector<HTMLElement>('.code-block-content');
    expect(gutter?.hidden).toBe(true);
    expect(content?.hasAttribute('data-line-numbers')).toBe(false);
  });

  it('inserts a soft line break with Shift+Enter in WYSIWYG mode', async () => {
    const editor = await createEditor('first line');
    const proseMirror = editor.renderRoot.querySelector<HTMLElement>('.ProseMirror');

    proseMirror?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true, bubbles: true }),
    );
    await editor.updateComplete;

    expect(editor.renderRoot.querySelectorAll('.ProseMirror > p')).toHaveLength(1);
    expect(editor.renderRoot.querySelector('br[data-soft-break]')).not.toBeNull();
    expect(editor.value).toContain('\n');
    expect(editor.value).not.toContain('\n\n');
  });

  it.each([
    ['bullet', '* Item', 'ul', /\* Next/],
    ['ordered', '1. Item', 'ol', /2\. Next/],
  ])(
    'continues a %s list with the next item when Enter is pressed',
    async (_kind, markdown, listSelector, nextItemPattern) => {
      const editor = await createEditor(markdown);
      const proseMirror = editor.renderRoot.querySelector<HTMLElement>('.ProseMirror');
      selectDocumentEnd(editor);

      proseMirror?.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Enter',
          bubbles: true,
          cancelable: true,
        }),
      );
      await editor.updateComplete;

      expect(
        editor.renderRoot.querySelectorAll(`${listSelector} > li`),
      ).toHaveLength(2);
      expect(editor.insertText('Next')).toBe(true);
      await editor.updateComplete;
      expect(editor.value).toMatch(nextItemPattern);
    },
  );

  it.each([
    ['bullet', '* Item', 'ul'],
    ['ordered', '1. Item', 'ol'],
  ])(
    'keeps Shift+Enter inside the current %s list item',
    async (_kind, markdown, listSelector) => {
      const editor = await createEditor(markdown);
      const proseMirror = editor.renderRoot.querySelector<HTMLElement>('.ProseMirror');
      selectDocumentEnd(editor);

      proseMirror?.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Enter',
          shiftKey: true,
          bubbles: true,
          cancelable: true,
        }),
      );
      await editor.updateComplete;

      expect(
        editor.renderRoot.querySelectorAll(`${listSelector} > li`),
      ).toHaveLength(1);
      expect(
        editor.renderRoot.querySelector(`${listSelector} br[data-soft-break]`),
      ).not.toBeNull();
    },
  );

  it.each([
    ['bullet', '* ', 'ul'],
    ['ordered', '1. ', 'ol'],
  ])(
    'exits an empty %s list item when Enter is pressed',
    async (_kind, markdown, listSelector) => {
      const editor = await createEditor(markdown);
      const proseMirror = editor.renderRoot.querySelector<HTMLElement>('.ProseMirror');
      selectDocumentEnd(editor);

      proseMirror?.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Enter',
          bubbles: true,
          cancelable: true,
        }),
      );
      await editor.updateComplete;

      expect(editor.renderRoot.querySelector(listSelector)).toBeNull();
      expect(editor.renderRoot.querySelector('.ProseMirror > p')).not.toBeNull();
    },
  );

  it.each([
    [
      'bullet',
      '* Parent\n* Child',
      'ul',
      /\* Parent\n\s+\* Child/,
      /\* Parent\n\n?\* Child/,
    ],
    [
      'ordered',
      '1. Parent\n2. Child',
      'ol',
      /1\. Parent\n\s+1\. Child/,
      /1\. Parent\n\n?2\. Child/,
    ],
  ])(
    'indents and outdents a %s list item with Tab and Shift+Tab',
    async (
      _kind,
      markdown,
      listSelector,
      nestedMarkdownPattern,
      flatMarkdownPattern,
    ) => {
      const editor = await createEditor(markdown);
      const proseMirror = editor.renderRoot.querySelector<HTMLElement>('.ProseMirror');
      selectDocumentEnd(editor);

      const indentEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
        cancelable: true,
      });
      proseMirror?.dispatchEvent(indentEvent);
      await editor.updateComplete;

      expect(indentEvent.defaultPrevented).toBe(true);
      expect(
        editor.renderRoot.querySelectorAll(
          `${listSelector} > li > ${listSelector} > li`,
        ),
      ).toHaveLength(1);
      expect(editor.value).toMatch(nestedMarkdownPattern);

      const outdentEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      });
      proseMirror?.dispatchEvent(outdentEvent);
      await editor.updateComplete;

      expect(outdentEvent.defaultPrevented).toBe(true);
      expect(
        editor.renderRoot.querySelectorAll(`${listSelector} > li`),
      ).toHaveLength(2);
      expect(
        editor.renderRoot.querySelector(`${listSelector} > li > ${listSelector}`),
      ).toBeNull();
      expect(editor.value).toMatch(flatMarkdownPattern);
    },
  );

  it.each([
    ['bullet', '* Only item'],
    ['ordered', '1. Only item'],
  ])(
    'does not alter a first %s list item when it cannot be indented',
    async (_kind, markdown) => {
      const editor = await createEditor(markdown);
      const proseMirror = editor.renderRoot.querySelector<HTMLElement>('.ProseMirror');
      selectDocumentEnd(editor);

      proseMirror?.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Tab',
          bubbles: true,
          cancelable: true,
        }),
      );
      await editor.updateComplete;

      expect(editor.value).toBe(markdown);
    },
  );

  it('turns an empty heading into a paragraph with Backspace', async () => {
    const editor = await createEditor('');
    const proseMirror = editor.renderRoot.querySelector<HTMLElement>('.ProseMirror');

    expect(editor.execute('heading2')).toBe(true);
    expect(editor.getMarkdown()).toBe('## ');
    expect(editor.renderRoot.querySelector('.ProseMirror > h2')).not.toBeNull();

    proseMirror?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }),
    );
    await editor.updateComplete;

    expect(editor.renderRoot.querySelector('.ProseMirror > h2')).toBeNull();
    expect(editor.renderRoot.querySelector('.ProseMirror > p')).not.toBeNull();
    expect(editor.getMarkdown()).toBe('');
  });

  it('opens a link in a new tab on middle click', async () => {
    const editor = await createEditor('[Example](https://example.com/path)');
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    const link = editor.renderRoot.querySelector<HTMLAnchorElement>('a');

    link?.dispatchEvent(
      new MouseEvent('auxclick', {
        button: 1,
        bubbles: true,
        composed: true,
        cancelable: true,
      }),
    );

    expect(open).toHaveBeenCalledWith(
      'https://example.com/path',
      '_blank',
      'noopener,noreferrer',
    );
    open.mockRestore();
  });

  it('dispatches input events for commands', async () => {
    const editor = await createEditor('paragraph');
    const listener = vi.fn();
    editor.addEventListener('input', listener);

    expect(editor.execute('heading1')).toBe(true);
    await editor.updateComplete;

    expect(listener).toHaveBeenCalled();
    expect(editor.value).toBe('# paragraph');
  });

  it('registers and removes behavior extensions', async () => {
    const editor = await createEditor('text');
    editor.use({
      name: 'append-mark',
      commands: {
        appendMark: ({ state, dispatch }) => {
          if (dispatch) dispatch(state.tr.insertText('!'));
          return true;
        },
      },
    });

    expect(editor.execute('appendMark')).toBe(true);
    expect(editor.removeExtension('append-mark')).toBe(true);
    expect(editor.execute('appendMark')).toBe(false);
  });

  it('inserts images and resolves host-managed image sources', async () => {
    const editor = await createEditor('');
    const resolver = vi.fn(async () => 'data:image/png;base64,AA==');
    editor.imageResolver = resolver;

    expect(editor.insertImage('images/example.png', 'Example')).toBe(true);
    await editor.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 0));

    const image = editor.renderRoot.querySelector<HTMLImageElement>('img');
    expect(editor.value).toContain('![Example](images/example.png)');
    expect(resolver).toHaveBeenCalledWith('images/example.png');
    expect(image?.src).toBe('data:image/png;base64,AA==');
  });

  it('exposes image activation and source-based scrolling without leaking Shadow DOM', async () => {
    const editor = await createEditor('![Example](images/example.png)');
    const image = editor.renderRoot.querySelector<HTMLImageElement>('img');
    const scrollIntoView = vi.fn();
    image!.scrollIntoView = scrollIntoView;
    const activate = vi.fn();
    editor.addEventListener('image-activate', activate);

    image!.click();

    expect(activate).toHaveBeenCalledOnce();
    expect(activate.mock.calls[0][0].detail).toMatchObject({
      source: 'images/example.png',
      displaySource: expect.any(String),
    });
    expect(editor.scrollToImage('images/example.png')).toBe(true);
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'center' });
    expect(editor.scrollToImage('images/missing.png')).toBe(false);
  });

  it('does not mutate content while disabled', async () => {
    const editor = await createEditor('unchanged');
    editor.disabled = true;
    await editor.updateComplete;

    expect(editor.insertText('changed')).toBe(false);
    expect(editor.value).toBe('unchanged');
  });

  it('renders task list checkboxes from Markdown', async () => {
    const editor = await createEditor('- [ ] open\n- [x] done');
    const checkboxes = editor.renderRoot.querySelectorAll<HTMLInputElement>(
      'li[data-task] > input[type="checkbox"]',
    );

    expect(checkboxes).toHaveLength(2);
    expect(checkboxes[0].checked).toBe(false);
    expect(checkboxes[1].checked).toBe(true);

    checkboxes[0].checked = true;
    checkboxes[0].dispatchEvent(new Event('change', { bubbles: true }));
    await editor.updateComplete;
    expect(editor.value).toContain('* [x] open');
  });

  it('does not open source mode when a task checkbox is double-clicked', async () => {
    const editor = await createEditor('- [ ] task');
    const checkbox = editor.renderRoot.querySelector<HTMLInputElement>(
      'li[data-task] > input[type="checkbox"]',
    );

    checkbox!.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    await editor.updateComplete;

    const source = editor.renderRoot.querySelector<HTMLTextAreaElement>(
      '#document-source',
    );
    expect(editor.mode).toBe('wysiwyg');
    expect(source?.hidden).toBe(true);
  });

  it('can be disconnected and connected again', async () => {
    const editor = await createEditor('# Reconnect');
    editor.remove();
    document.body.append(editor);
    await editor.updateComplete;

    expect(editor.renderRoot.querySelector('h1')?.textContent).toBe('Reconnect');
    expect(editor.execute('heading2')).toBe(true);
  });
});
