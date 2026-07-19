import { beforeEach, describe, expect, it, vi } from 'vitest';

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
      }))
    };
  });

  async function initializeEditor() {
    const editor = document.getElementById('markdown-editor');
    editor.setMode = vi.fn();
    const adapter = await import('../../src/editor/sidenote-editor-adapter.js');
    expect(adapter.initializeWysiwygMarkdownEditor()).toBe(true);
    expect(editor.sourceEditScope).toBe('document');
    expect(editor.themeCss).toContain('white-space: pre-wrap');
    expect(editor.themeCss).toContain('.code-block-header');
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
});
