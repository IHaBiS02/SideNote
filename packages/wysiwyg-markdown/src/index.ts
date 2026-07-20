import { WysiwygMarkdownElement } from './element/wysiwyg-markdown';

export { WysiwygMarkdownElement } from './element/wysiwyg-markdown';
export type {
  CodeHighlighter,
  CodeHighlightToken,
  EditorMode,
  ImageResolver,
  ImageUploadHandler,
  PastedTextTransformer,
  SourceEditScope,
  WysiwygMarkdownInputDetail,
} from './element/wysiwyg-markdown';
export { parseMarkdown, serializeMarkdown, markdownSchema } from './core/markdown';
export type {
  EditorCommand,
  EditorCommandContext,
} from './core/commands';
export type {
  EditorExtension,
  EditorInputRule,
  EditorInputRuleContext,
} from './extensions/types';

if (!customElements.get('wysiwyg-markdown')) {
  customElements.define('wysiwyg-markdown', WysiwygMarkdownElement);
}
