import { describe, expect, it, vi } from 'vitest';
import '../src/index';
import type { WysiwygMarkdownElement } from '../src/element/wysiwyg-markdown';

async function createEditor(markdown = ''): Promise<WysiwygMarkdownElement> {
  const editor = document.createElement('wysiwyg-markdown');
  editor.value = markdown;
  document.body.append(editor);
  await editor.updateComplete;
  return editor;
}

describe('wysiwyg-markdown element', () => {
  it('renders Markdown and exposes its canonical value', async () => {
    const editor = await createEditor('# Hello');

    expect(editor.getMarkdown()).toBe('# Hello');
    expect(editor.renderRoot.querySelector('h1')?.textContent).toBe('Hello');
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
    const language = editor.renderRoot.querySelector('.code-block-language');
    const copyButton = editor.renderRoot.querySelector<HTMLButtonElement>('.copy-code-button');

    expect(header?.hidden).toBe(false);
    expect(language?.textContent).toBe('text');
    copyButton?.click();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(writeText).toHaveBeenCalledWith('first line\nsecond line');
    expect(copyButton?.textContent).toBe('✓');
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

  it('can be disconnected and connected again', async () => {
    const editor = await createEditor('# Reconnect');
    editor.remove();
    document.body.append(editor);
    await editor.updateComplete;

    expect(editor.renderRoot.querySelector('h1')?.textContent).toBe('Reconnect');
    expect(editor.execute('heading2')).toBe(true);
  });
});
