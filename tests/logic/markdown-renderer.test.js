import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../../src/database/index.js', () => ({
  getImage: vi.fn().mockResolvedValue(null),
}));

describe('markdown renderer code blocks', () => {
  const codeText = 'set CLAUDE_CODE_NO_FLICKER=1\nclaude\n';

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    document.body.innerHTML = `
      <textarea id="markdown-editor"></textarea>
      <div id="html-preview"></div>
      <button id="toggle-view-button"></button>
    `;

    globalThis.marked = {
      Renderer: class {},
      setOptions: vi.fn(),
      parse: vi.fn(() => `<pre><code class="language-bash">${codeText}</code></pre>`),
    };
    globalThis.DOMPurify = {
      sanitize: vi.fn((html) => html),
    };
    globalThis.hljs = {
      getLanguage: vi.fn(() => true),
      highlight: vi.fn((code) => ({ value: code })),
      highlightAll: vi.fn(),
      lineNumbersBlock: vi.fn((block) => {
        block.textContent = `1 ${codeText.split('\n')[0]}\n2 claude`;
      }),
    };
  });

  async function renderCodeBlock({ globalSettings = {}, noteSettings, activeNoteId = 'note-1' } = {}) {
    const state = await import('../../src/state.js');
    state.setGlobalSettings(globalSettings);
    state.setActiveNoteId(activeNoteId);
    state.setNotes(noteSettings ? [{
      id: activeNoteId,
      settings: noteSettings,
    }] : []);

    const { renderMarkdown } = await import('../../src/notes_view/markdown-renderer.js');

    document.getElementById('markdown-editor').value = '```bash\n' + codeText + '```';
    renderMarkdown();

    return document.getElementById('html-preview');
  }

  it('adds a language header and copy button above fenced code blocks', async () => {
    const preview = await renderCodeBlock();

    expect(preview.querySelector('.code-block-container')).toBeTruthy();
    expect(preview.querySelector('.code-block-language').textContent).toBe('bash');
    expect(preview.querySelector('.copy-code-button').textContent).toBe('📄');
    expect(preview.querySelector('pre').classList.contains('code-block-body')).toBe(true);
    expect(globalThis.hljs.lineNumbersBlock).toHaveBeenCalled();
  });

  it('copies the original code text without line numbers', async () => {
    const writeText = vi.fn().mockResolvedValue();
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });

    await renderCodeBlock();
    document.querySelector('.copy-code-button').click();

    expect(writeText).toHaveBeenCalledWith(codeText);
  });

  it('does not add the header when the global setting is disabled', async () => {
    const preview = await renderCodeBlock({
      globalSettings: { codeBlockHeader: false },
    });

    expect(preview.querySelector('.code-block-header')).toBeNull();
    expect(preview.querySelector('pre code')).toBeTruthy();
  });

  it('uses the note setting before the global code block header setting', async () => {
    const preview = await renderCodeBlock({
      globalSettings: { codeBlockHeader: false },
      noteSettings: { codeBlockHeader: true },
    });

    expect(preview.querySelector('.code-block-header')).toBeTruthy();
  });

  it('allows a note setting to hide the header when the global setting is enabled', async () => {
    const preview = await renderCodeBlock({
      globalSettings: { codeBlockHeader: true },
      noteSettings: { codeBlockHeader: false },
    });

    expect(preview.querySelector('.code-block-header')).toBeNull();
  });
});
