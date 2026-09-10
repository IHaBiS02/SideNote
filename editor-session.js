import './vendor/wysiwyg-markdown.js';
import { highlightCode, SIDENOTE_EDITOR_THEME } from './vendor/sidenote-editor-theme.js';

export function mountEditor(container, zip, settings, draft, options = {}) {
  const editor = document.createElement('wysiwyg-markdown');
  editor.id = options.id || 'markdown-editor';
  editor.setAttribute('aria-label', 'Try editing this note');
  editor.sourceEditScope = 'document';
  editor.themeCss = SIDENOTE_EDITOR_THEME;
  editor.codeHighlighter = highlightCode;
  editor.showCodeLineNumbers = true;
  editor.showCodeBlockHeader = settings.codeBlockHeader !== false;
  editor.preventExtraEmptyParagraphs = settings.preventExtraEmptyParagraphs !== false;
  const number = (value, fallback, min, max) => Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;
  editor.style.fontSize = `${number(settings.fontSize, 12, 1, 96)}px`;
  for (const [name, value] of Object.entries({
    '--editor-line-height': number(settings.lineHeight, 1.5, 1, 3),
    '--editor-heading-line-height': number(settings.lineHeight, 1.5, 1, 3),
    '--editor-source-line-height': number(settings.sourceLineHeight, 1.2, 1, 3),
    '--editor-code-line-height': number(settings.codeLineHeight, 1.2, 1, 3),
  })) editor.style.setProperty(name, String(value));
  let alive = true;
  editor.imageResolver = async source => {
    if (!/^images\/[^/]+\.png$/.test(source)) return /^https?:\/\//i.test(source) ? source : null;
    const bytes = draft.images.get(source) || await zip.file(source)?.async('uint8array');
    if (!bytes || !alive) return null;
    // Each image node owns and revokes its URL, including during mode switches.
    return URL.createObjectURL(new Blob([bytes], { type: 'image/png' }));
  };
  editor.uploadImage = async file => {
    if (!alive) throw new Error('This note is no longer open.');
    const path = `images/${crypto.randomUUID()}.png`;
    draft.images.set(path, file);
    return path;
  };
  editor.value = draft.markdown;
  editor.addEventListener('input', event => {
    if (alive && typeof event.detail?.markdown === 'string') {
      draft.markdown = event.detail.markdown;
      options.onInput?.(draft.markdown);
    }
  });
  const toggle = document.querySelector(options.toggle || '#toggle-view-button');
  const updateMode = () => { toggle.textContent = editor.mode === 'source' ? 'WYSIWYG' : 'Edit'; };
  editor.addEventListener('mode-change', updateMode);
  toggle.onclick = () => { editor.setMode(editor.mode === 'source' ? 'wysiwyg' : 'source'); };
  editor.addEventListener('keydown', event => {
    if (editor.mode === 'source' && !event.isComposing && (event.key === 'Escape' || (event.key === 'Enter' && event.shiftKey))) {
      event.preventDefault(); editor.setMode('wysiwyg');
    }
  });
  container.replaceChildren(editor);
  updateMode();
  return () => {
    alive = false;
    editor.remove();
    toggle.onclick = null;
  };
}
