import { beforeEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const mocks = vi.hoisted(() => ({
  getImage: vi.fn(),
  saveImage: vi.fn(),
  processPastedText: vi.fn((text) => `processed:${text}`),
  resolveLegacyTextProcessingSettings: vi.fn(() => ({ legacyLineBreakMode: false })),
}));

vi.mock('../../src/database/index.js', () => ({
  getImage: mocks.getImage,
  saveImage: mocks.saveImage,
}));

vi.mock('../../src/settings.js', () => ({
  resolveLegacyTextProcessingSettings: mocks.resolveLegacyTextProcessingSettings,
}));

vi.mock('../../src/state.js', () => ({
  globalSettings: { tildeReplacement: true },
}));

vi.mock('../../src/text-processors.js', () => ({
  processPastedText: mocks.processPastedText,
}));

describe('SideNote WYSIWYG editor adapter', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    document.body.innerHTML = '<div id="markdown-editor"></div>';
    globalThis.hljs = {
      getLanguage: vi.fn(language => language === 'js'),
      highlight: vi.fn(() => ({
        value: '<span class="hljs-keyword">const</span> value = <span class="hljs-number">1</span>;'
      })),
      highlightAuto: vi.fn(() => ({
        value: '<span class="hljs-keyword">const</span> value = 1;'
      })),
    };
  });

  async function initializeEditor() {
    const editor = document.getElementById('markdown-editor');
    editor.setMode = vi.fn();
    const adapter = await import('../../src/editor/sidenote-editor-adapter.js');
    expect(adapter.initializeWysiwygMarkdownEditor()).toBe(true);
    expect(editor.sourceEditScope).toBe('document');
    expect(editor.showCodeLineNumbers).toBe(true);
    expect(editor.themeCss).toContain('white-space: pre-wrap');
    expect(editor.themeCss).toContain('.code-block-header');
    expect(editor.themeCss).toContain('var(--editor-code-header-background)');
    expect(editor.themeCss).toContain('font-family: var(--editor-code-font-family)');
    expect(editor.themeCss).toContain('padding: var(--editor-padding)');
    expect(editor.themeCss).toContain('background: var(--editor-code-background)');
    expect(editor.themeCss).toContain('color: var(--editor-code-line-number-color)');
    expect(editor.themeCss).toContain('pre.code-line-numbers');
    expect(editor.themeCss).toContain('pre.code-line-numbers code');
    expect(editor.themeCss).toContain('.code-block-content[data-line-numbers] > pre');
    expect(editor.themeCss).toContain('line-height: var(--editor-code-line-height)');
    expect(editor.themeCss).toContain('line-height: var(--editor-source-line-height)');
    expect(editor.themeCss).toContain('word-break: keep-all');
    expect(editor.themeCss).toContain('background: var(--editor-inline-code-background)');
    return { adapter, editor };
  }

  it('stores pasted images and returns a stable Markdown image path', async () => {
    const { editor } = await initializeEditor();
    const file = new File(['image'], 'sample.png', { type: 'image/png' });

    const source = await editor.uploadImage(file);

    expect(source).toMatch(/^images\/.+\.png$/);
    expect(mocks.saveImage).toHaveBeenCalledWith(
      source.slice('images/'.length, -'.png'.length),
      file
    );
  });

  it('resolves internal images and leaves external URLs unchanged', async () => {
    const { editor } = await initializeEditor();
    const blob = new Blob(['image'], { type: 'image/png' });
    mocks.getImage.mockResolvedValue(blob);
    const originalCreateObjectURL = URL.createObjectURL;
    const createObjectURL = vi.fn(() => 'blob:resolved');
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: createObjectURL,
    });

    await expect(editor.imageResolver('images/image-1.png')).resolves.toBe('blob:resolved');
    await expect(editor.imageResolver('https://example.com/image.png')).resolves.toBe(
      'https://example.com/image.png'
    );
    expect(mocks.getImage).toHaveBeenCalledWith('image-1');
    expect(createObjectURL).toHaveBeenCalledWith(blob);

    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: originalCreateObjectURL,
    });
  });

  it('passes pasted text through SideNote legacy text settings', async () => {
    const { editor } = await initializeEditor();

    expect(editor.transformPastedText('hello')).toBe('processed:hello');
    expect(mocks.resolveLegacyTextProcessingSettings).toHaveBeenCalledWith({
      tildeReplacement: true,
    });
  });

  it('forwards mode changes to the custom element API', async () => {
    const { adapter, editor } = await initializeEditor();

    adapter.setEditorMode('readonly');

    expect(editor.setMode).toHaveBeenCalledWith('readonly');
  });

  it('converts highlight.js markup into editable decoration ranges', async () => {
    const { editor } = await initializeEditor();

    expect(editor.codeHighlighter('const value = 1;', 'js')).toEqual([
      { from: 0, to: 5, className: 'hljs-keyword' },
      { from: 14, to: 15, className: 'hljs-number' }
    ]);
    expect(globalThis.hljs.highlight).toHaveBeenCalledWith('const value = 1;', {
      language: 'js',
      ignoreIllegals: true
    });
  });

  it('auto-detects an unlabeled code block like the 4.1.14 preview', async () => {
    const { editor } = await initializeEditor();

    expect(editor.codeHighlighter('const value = 1;', '')).toEqual([
      { from: 0, to: 5, className: 'hljs-keyword' }
    ]);
    expect(globalThis.hljs.highlightAuto).toHaveBeenCalledWith('const value = 1;');
  });

  it('leaves an unknown labeled language unhighlighted', async () => {
    const { editor } = await initializeEditor();

    expect(editor.codeHighlighter('example', 'unknown-language')).toEqual([]);
    expect(globalThis.hljs.highlight).not.toHaveBeenCalled();
    expect(globalThis.hljs.highlightAuto).not.toHaveBeenCalled();
  });
});

describe('4.1.14 packaged Preview theme compatibility', () => {
  const lightCss = readFileSync(resolve('sidepanel.css'), 'utf8');
  const darkCss = readFileSync(resolve('dark_mode.css'), 'utf8');
  const sidePanelHtml = readFileSync(resolve('sidepanel.html'), 'utf8');

  it('loads reset CSS before an explicit cross-browser typography baseline', () => {
    expect(sidePanelHtml).toContain('vendor/reset.css');
    expect(lightCss).toContain('--sidenote-font-family: Arial, sans-serif;');
    expect(lightCss).toContain('--sidenote-line-height: 1.5;');
    expect(lightCss).toContain('font-weight: 700;');
    expect(lightCss).toContain('--editor-line-height: var(--sidenote-line-height);');
    expect(lightCss).toContain('--editor-heading-line-height: var(--sidenote-line-height);');
    expect(lightCss).toContain('--editor-source-line-height: 1.2;');
    expect(lightCss).toContain('--editor-code-line-height: 1.2;');
  });

  it('keeps the legacy browser monospace font and light code colors', () => {
    expect(lightCss).toContain('--editor-padding: 10px;');
    expect(lightCss).toContain('--editor-code-font-family: monospace;');
    expect(lightCss).toContain('--editor-code-content-padding: 5px;');
    expect(lightCss).toContain('--editor-code-background: #fafafa;');
    expect(lightCss).toContain('--editor-code-color: #383a42;');
    expect(lightCss).toContain('--editor-code-header-background: #f5f5f5;');
    expect(lightCss).toContain('--editor-code-line-number-color: black;');
  });

  it('keeps the legacy dark code surfaces and Atom One token colors', () => {
    expect(darkCss).toContain('--editor-code-background: #2d2d2d;');
    expect(darkCss).toContain('--editor-code-header-background: #252525;');
    expect(darkCss).toContain('--editor-code-color: #abb2bf;');
    expect(darkCss).toContain('--editor-hl-comment: #5c6370;');
    expect(darkCss).toContain('--editor-hl-keyword: #c678dd;');
    expect(darkCss).toContain('--editor-hl-string: #98c379;');
  });
});
