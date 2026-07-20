if (window.location.pathname.endsWith('/dist.html')) {
  const bundlePath = '../dist/wysiwyg-markdown.js';
  await import(/* @vite-ignore */ bundlePath);
} else {
  await import('../src/index');
}
import type {
  EditorExtension,
  EditorMode,
  WysiwygMarkdownElement,
  WysiwygMarkdownInputDetail,
} from '../src/index';
import { sampleMarkdown } from './sample-markdown';

function queryRequired<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Demo element was not found: ${selector}`);
  return element;
}

const editor = queryRequired<WysiwygMarkdownElement>('#editor');
const markdownOutput = queryRequired<HTMLTextAreaElement>('#markdown-output');
const eventLog = queryRequired<HTMLOListElement>('#event-log');
const imageInput = queryRequired<HTMLInputElement>('#image-input');

const memoryImages = new Map<string, File>();

function memoryImageId(source: string): string {
  return source.replace(/^memory-images\//, '');
}

editor.uploadImage = async (file) => {
  const id = crypto.randomUUID();
  memoryImages.set(id, file);
  logEvent('image:upload', { id, name: file.name, size: file.size });
  return `memory-images/${id}`;
};

editor.imageResolver = async (source) => {
  if (!source.startsWith('memory-images/')) return source;
  const file = memoryImages.get(memoryImageId(source));
  return file ? URL.createObjectURL(file) : null;
};

editor.value = sampleMarkdown;
markdownOutput.value = sampleMarkdown;

function logEvent(name: string, detail: unknown): void {
  const item = document.createElement('li');
  item.textContent = `${new Date().toLocaleTimeString()} ${name} ${JSON.stringify(detail)}`;
  eventLog.prepend(item);
  while (eventLog.children.length > 30) {
    eventLog.lastElementChild?.remove();
  }
}

editor.addEventListener('input', (event) => {
  const detail = (event as CustomEvent<WysiwygMarkdownInputDetail>).detail;
  markdownOutput.value = detail.markdown;
  logEvent('input', { source: detail.source, length: detail.markdown.length });
});

for (const eventName of ['change', 'mode-change', 'selection-change', 'editor-error']) {
  editor.addEventListener(eventName, (event) => {
    logEvent(eventName, (event as CustomEvent).detail);
  });
}

document.querySelectorAll<HTMLButtonElement>('[data-mode]').forEach((button) => {
  button.addEventListener('click', () => {
    const mode = button.dataset.mode as EditorMode;
    editor.setMode(mode);
    document.querySelectorAll('[data-mode]').forEach((candidate) => {
      candidate.classList.toggle('active', candidate === button);
    });
  });
});

document.querySelector('#undo')?.addEventListener('click', () => editor.undo());
document.querySelector('#redo')?.addEventListener('click', () => editor.redo());
document.querySelector('#heading')?.addEventListener('click', () => editor.execute('heading1'));
document.querySelector('#bold')?.addEventListener('click', () => editor.execute('toggleBold'));
document.querySelector('#image-button')?.addEventListener('click', () => imageInput.click());
imageInput.addEventListener('change', async () => {
  const file = imageInput.files?.[0];
  if (!file || !editor.uploadImage) return;
  const source = await editor.uploadImage(file);
  if (source) editor.insertImage(source, file.name);
  imageInput.value = '';
});

document.querySelector('#reset')?.addEventListener('click', () => {
  editor.setMarkdown(sampleMarkdown);
  markdownOutput.value = sampleMarkdown;
  logEvent('reset', { length: sampleMarkdown.length });
});

document.querySelector('#apply-source')?.addEventListener('click', () => {
  editor.setMarkdown(markdownOutput.value);
  logEvent('api:setMarkdown', { length: markdownOutput.value.length });
});

document.querySelector('#clear-log')?.addEventListener('click', () => {
  eventLog.replaceChildren();
});

document.querySelector('#theme-toggle')?.addEventListener('click', (event) => {
  const dark = document.documentElement.dataset.theme !== 'dark';
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  (event.currentTarget as HTMLButtonElement).textContent = dark
    ? '라이트 모드'
    : '다크 모드';
});

const dateExtension: EditorExtension = {
  name: 'insert-date',
  priority: 100,
  commands: {
    insertDate: ({ state, dispatch }) => {
      if (!dispatch) return true;
      dispatch(state.tr.insertText(new Date().toISOString().slice(0, 10)));
      return true;
    },
  },
  shortcuts: {
    'Mod-Shift-d': ({ state, dispatch }) => {
      if (!dispatch) return true;
      dispatch(state.tr.insertText(new Date().toISOString().slice(0, 10)));
      return true;
    },
  },
};

document.querySelector('#extension-toggle')?.addEventListener('click', (event) => {
  const button = event.currentTarget as HTMLButtonElement;
  if (editor.getExtensions().some((extension) => extension.name === dateExtension.name)) {
    editor.removeExtension(dateExtension.name);
    button.textContent = '날짜 확장 켜기';
    logEvent('extension:remove', { name: dateExtension.name });
  } else {
    editor.use(dateExtension);
    button.textContent = '날짜 확장 끄기';
    logEvent('extension:add', { name: dateExtension.name });
  }
});
