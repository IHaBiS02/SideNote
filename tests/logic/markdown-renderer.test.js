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

  it('adds a language header and copy button above fenced code blocks', async () => {
    const { renderMarkdown } = await import('../../src/notes_view/markdown-renderer.js');

    document.getElementById('markdown-editor').value = '```bash\n' + codeText + '```';
    renderMarkdown();

    const preview = document.getElementById('html-preview');
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
    const { renderMarkdown } = await import('../../src/notes_view/markdown-renderer.js');

    document.getElementById('markdown-editor').value = '```bash\n' + codeText + '```';
    renderMarkdown();
    document.querySelector('.copy-code-button').click();

    expect(writeText).toHaveBeenCalledWith(codeText);
  });
});
