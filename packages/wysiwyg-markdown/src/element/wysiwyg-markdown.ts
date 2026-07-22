import { LitElement, html, nothing, type PropertyValues } from 'lit';
import { baseKeymap, chainCommands, newlineInCode } from 'prosemirror-commands';
import { history, redo, undo } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import type { Node as ProseMirrorNode } from 'prosemirror-model';
import {
  liftListItem,
  sinkListItem,
  splitListItem,
} from 'prosemirror-schema-list';
import {
  EditorState,
  Plugin,
  Selection,
  type Transaction,
} from 'prosemirror-state';
import {
  Decoration,
  DecorationSet,
  EditorView,
  type NodeView,
} from 'prosemirror-view';
import {
  clearEmptyHeading,
  standardCommands,
  type EditorCommand,
} from '../core/commands';
import {
  markdownSchema,
  parseMarkdown,
  serializeMarkdown,
} from '../core/markdown';
import { ExtensionRegistry } from '../extensions/registry';
import { createStandardInputRules } from '../extensions/standard';
import type { EditorExtension } from '../extensions/types';
import { editorStyles } from './styles';

export type EditorMode = 'wysiwyg' | 'source' | 'readonly';
export type SourceEditScope = 'document' | 'block';

interface BlockSourceRange {
  from: number;
  to: number;
}

export interface WysiwygMarkdownInputDetail {
  markdown: string;
  source: 'keyboard' | 'paste' | 'command' | 'source-edit' | 'api';
}

export interface WysiwygMarkdownImageActivateDetail {
  source: string;
  displaySource: string;
}

export type ImageUploadHandler = (file: File) => Promise<string | null>;
export type ImageResolver = (source: string) => Promise<string | null> | string | null;
export type PastedTextTransformer = (text: string) => string;
export interface CodeHighlightToken {
  from: number;
  to: number;
  className: string;
}
export type CodeHighlighter = (
  code: string,
  language: string,
) => readonly CodeHighlightToken[];

export class WysiwygMarkdownElement extends LitElement {
  static formAssociated = true;

  static properties = {
    value: { type: String },
    mode: { type: String, reflect: true },
    placeholder: { type: String },
    readonly: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    name: { type: String, reflect: true },
    sourceEditScope: { type: String, attribute: 'source-edit-scope', reflect: true },
    showCodeBlockHeader: {
      type: Boolean,
      attribute: 'show-code-block-header',
      reflect: true,
    },
    showCodeLineNumbers: {
      type: Boolean,
      attribute: 'show-code-line-numbers',
      reflect: true,
    },
    codeHighlighter: { attribute: false },
    themeCss: { attribute: false },
    blockSourceOpen: { state: true },
    blockSourceValue: { state: true },
  };

  static styles = editorStyles;

  value = '';
  mode: EditorMode = 'wysiwyg';
  placeholder = '';
  readonly = false;
  disabled = false;
  name = '';
  sourceEditScope: SourceEditScope = 'document';
  showCodeBlockHeader = true;
  showCodeLineNumbers = false;
  codeHighlighter?: CodeHighlighter;
  themeCss = '';
  uploadImage?: ImageUploadHandler;
  imageResolver?: ImageResolver;
  transformPastedText?: PastedTextTransformer;

  protected blockSourceOpen = false;
  protected blockSourceValue = '';
  protected documentSourceValue = '';

  #view?: EditorView;
  #registry = new ExtensionRegistry();
  #blockSourceRange?: BlockSourceRange;
  #lastDocumentMarkdown = '';
  #plugins: Plugin[] = [];
  readonly #historyPlugin = history();
  readonly #standardInputRulesPlugin = createStandardInputRules();
  readonly #codeHighlightPlugin = new Plugin({
    props: {
      decorations: (state) => this.#createCodeHighlightDecorations(state.doc),
    },
  });
  readonly #historyKeymapPlugin = keymap({
    'Mod-z': undo,
    'Shift-Mod-z': redo,
    'Mod-y': redo,
  });
  readonly #blockEditingKeymapPlugin = keymap({
    Backspace: clearEmptyHeading,
  });
  readonly #lineBreakKeymapPlugin = keymap({
    'Shift-Enter': chainCommands(newlineInCode, (state, dispatch) => {
      const softBreak = state.schema.nodes.soft_break;
      const { $from, $to } = state.selection;
      if (!softBreak || !$from.sameParent($to) || !$from.parent.inlineContent) return false;
      if (dispatch) {
        dispatch(state.tr.replaceSelectionWith(softBreak.create()).scrollIntoView());
      }
      return true;
    }),
  });
  readonly #listEditingKeymapPlugin = keymap({
    Enter: splitListItem(markdownSchema.nodes.list_item),
    Tab: sinkListItem(markdownSchema.nodes.list_item),
    'Shift-Tab': liftListItem(markdownSchema.nodes.list_item),
  });
  readonly #baseKeymapPlugin = keymap(baseKeymap);
  #internals?: ElementInternals;
  #defaultValue = '';
  #sourceReturnMode: Exclude<EditorMode, 'source'> = 'wysiwyg';
  #pendingSourceOffset?: number;
  #pendingWysiwygPosition?: number;

  constructor() {
    super();
    if (typeof this.attachInternals === 'function') {
      this.#internals = this.attachInternals();
    }
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (!this.hasAttribute('role')) this.setAttribute('role', 'textbox');
    if (!this.hasAttribute('aria-multiline')) {
      this.setAttribute('aria-multiline', 'true');
    }
    if (this.hasUpdated && !this.#view) {
      this.updateComplete.then(() => this.#mountEditor());
    }
  }

  render() {
    const sourceMode = this.mode === 'source';
    const empty = !this.value.trim();

    return html`
      <div class="surface" part="surface">
        ${empty && !sourceMode && this.placeholder
          ? html`<div class="placeholder" part="placeholder">${this.placeholder}</div>`
          : nothing}
        <div
          id="editor-mount"
          class="editor-mount"
          part="editor"
          ?hidden=${sourceMode}
          @dblclick=${this.#handleEditorDoubleClick}
        ></div>
        <textarea
          id="document-source"
          class="source-editor"
          part="source-editor"
          aria-label="Markdown source"
          spellcheck="false"
          ?hidden=${!sourceMode}
          ?readonly=${this.readonly}
          ?disabled=${this.disabled}
          .value=${this.documentSourceValue}
          @input=${this.#handleDocumentSourceInput}
          @keydown=${this.#handleDocumentSourceKeyDown}
          @paste=${this.#handleDocumentSourcePaste}
        ></textarea>
        ${this.blockSourceOpen
          ? html`
              <section class="block-source-panel" part="block-source-panel">
                <textarea
                  id="block-source"
                  aria-label="Block Markdown source"
                  spellcheck="false"
                  .value=${this.blockSourceValue}
                  @input=${this.#handleBlockSourceInput}
                  @keydown=${this.#handleBlockSourceKeyDown}
                ></textarea>
                <div class="block-source-actions">
                  <button type="button" @click=${this.cancelBlockSourceEdit}>취소</button>
                  <button
                    type="button"
                    class="primary"
                    @click=${this.applyBlockSourceEdit}
                  >적용</button>
                </div>
              </section>
            `
          : nothing}
        <style id="host-theme"></style>
      </div>
    `;
  }

  protected firstUpdated(): void {
    this.#mountEditor();
  }

  protected willUpdate(changed: PropertyValues<this>): void {
    if (!this.hasUpdated && changed.has('value')) {
      this.value = serializeMarkdown(this.#parseOrReport(this.value));
    }
    if (changed.has('mode')) {
      const previousMode = changed.get('mode');
      if (this.mode === 'source') {
        this.documentSourceValue = this.value;
        if (previousMode !== 'source' && this.#pendingSourceOffset === undefined) {
          this.#pendingSourceOffset = this.#view
            ? this.#markdownOffsetAtPosition(this.#view.state.selection.head)
            : undefined;
        }
      } else if (previousMode === 'source') {
        const source = this.renderRoot.querySelector<HTMLTextAreaElement>(
          '#document-source',
        );
        const markdown = source?.value ?? this.documentSourceValue;
        const offset = source?.selectionStart ?? markdown.length;
        this.#pendingWysiwygPosition = this.#proseMirrorPositionAtMarkdownOffset(
          markdown,
          offset,
        );
      }
    }
  }

  #mountEditor(): void {
    if (this.#view) return;
    const mount = this.renderRoot.querySelector<HTMLElement>('#editor-mount');
    if (!mount) throw new Error('Editor mount element was not created.');

    const document = this.#parseOrReport(this.value);
    this.#lastDocumentMarkdown = serializeMarkdown(document);
    this.#defaultValue = this.value;
    this.documentSourceValue = this.value;
    this.#plugins = this.#createPlugins();
    const state = EditorState.create({
      doc: document,
      schema: markdownSchema,
      plugins: this.#plugins,
    });

    this.#view = new EditorView(mount, {
      state,
      editable: () => this.#isEditable(),
      dispatchTransaction: (transaction) => this.#dispatchTransaction(transaction),
      transformPastedText: (text) => this.transformPastedText?.(text) ?? text,
      handlePaste: (view, event) => this.#handleImagePaste(view, event),
      handleDOMEvents: {
        blur: () => {
          this.#emitChange('keyboard');
          return false;
        },
        auxclick: (_view, event) => this.#handleLinkAuxClick(event),
        click: (_view, event) => this.#handleImageActivate(event),
      },
      nodeViews: {
        code_block: (node, view, getPos) =>
          this.#createCodeBlockNodeView(node, view, getPos),
        image: (node) => this.#createImageNodeView(node),
        list_item: (node, view, getPos) =>
          this.#createListItemNodeView(node, view, getPos),
      },
    });
    this.#syncFormValue();
  }

  protected updated(changed: PropertyValues<this>): void {
    if (!this.#view) return;

    if (
      changed.has('value') &&
      this.mode !== 'source' &&
      this.value !== this.#lastDocumentMarkdown
    ) {
      this.#replaceDocument(this.value, false);
    }

    if (changed.has('mode')) {
      const previousMode = changed.get('mode');
      const enteringSource = previousMode !== 'source' && this.mode === 'source';
      const leavingSource = previousMode === 'source' && this.mode !== 'source';
      if (leavingSource) {
        this.#replaceDocument(this.documentSourceValue, true, 'source-edit');
      }
      this.#view.setProps({ editable: () => this.#isEditable() });
      if (enteringSource) {
        const offset = this.#pendingSourceOffset;
        this.#pendingSourceOffset = undefined;
        this.#focusSourceAtOffset(offset);
      } else if (leavingSource) {
        const position = this.#pendingWysiwygPosition;
        this.#pendingWysiwygPosition = undefined;
        if (position !== undefined) this.#focusWysiwygAtPosition(position);
      }
      this.dispatchEvent(
        new CustomEvent('mode-change', {
          detail: { mode: this.mode },
          bubbles: true,
          composed: true,
        }),
      );
    }

    if (changed.has('readonly') || changed.has('disabled')) {
      this.#view.setProps({ editable: () => this.#isEditable() });
    }

    if (
      changed.has('mode') ||
      changed.has('readonly') ||
      changed.has('disabled')
    ) {
      this.#refreshTaskCheckboxes();
    }

    if (
      changed.has('showCodeBlockHeader') ||
      changed.has('showCodeLineNumbers') ||
      changed.has('mode') ||
      changed.has('readonly') ||
      changed.has('disabled')
    ) {
      this.#refreshCodeBlockChrome();
    }

    if (changed.has('codeHighlighter')) {
      this.#view.dispatch(this.#view.state.tr);
    }

    if (changed.has('value') || changed.has('disabled')) {
      this.#syncFormValue();
    }

    if (changed.has('themeCss')) {
      const theme = this.renderRoot.querySelector<HTMLStyleElement>('#host-theme');
      if (theme) theme.textContent = this.themeCss;
    }
  }

  disconnectedCallback(): void {
    this.#view?.destroy();
    this.#view = undefined;
    super.disconnectedCallback();
  }

  getMarkdown(): string {
    return this.value;
  }

  setMarkdown(markdown: string): void {
    this.value = markdown ?? '';
    if (this.mode === 'source') this.documentSourceValue = this.value;
  }

  formResetCallback(): void {
    this.setMarkdown(this.#defaultValue);
  }

  setMode(mode: EditorMode): void {
    if (!['wysiwyg', 'source', 'readonly'].includes(mode)) {
      throw new Error(`Unsupported editor mode: ${mode}`);
    }
    if (mode === 'source' && this.mode !== 'source') {
      this.#sourceReturnMode = this.mode;
      if (this.#pendingSourceOffset === undefined && this.#view) {
        this.#pendingSourceOffset = this.#markdownOffsetAtPosition(
          this.#view.state.selection.head,
        );
      }
    }
    this.mode = mode;
  }

  override focus(options?: FocusOptions): void {
    if (this.mode === 'source') {
      this.updateComplete.then(() =>
        this.renderRoot.querySelector<HTMLTextAreaElement>('#document-source')?.focus(options),
      );
      return;
    }
    this.#view?.focus();
  }

  undo(): boolean {
    if (!this.#view) return false;
    return undo(
      this.#view.state,
      (transaction) =>
        this.#view?.dispatch(transaction.setMeta('wysiwygMarkdownSource', 'command')),
      this.#view,
    );
  }

  redo(): boolean {
    if (!this.#view) return false;
    return redo(
      this.#view.state,
      (transaction) =>
        this.#view?.dispatch(transaction.setMeta('wysiwygMarkdownSource', 'command')),
      this.#view,
    );
  }

  execute(commandName: string): boolean {
    if (!this.#view) return false;
    const command = this.#commands()[commandName];
    if (!command) return false;
    return command({
      state: this.#view.state,
      dispatch: (transaction) =>
        this.#view?.dispatch(transaction.setMeta('wysiwygMarkdownSource', 'command')),
      view: this.#view,
    });
  }

  use(extension: EditorExtension): void {
    this.#registry.add(extension);
    this.#reconfigurePlugins();
  }

  removeExtension(name: string): boolean {
    const removed = this.#registry.remove(name);
    if (removed) this.#reconfigurePlugins();
    return removed;
  }

  getExtensions(): readonly EditorExtension[] {
    return this.#registry.list();
  }

  insertText(text: string): boolean {
    if (!this.#view || !this.#isEditable()) return false;
    const { from, to } = this.#view.state.selection;
    this.#view.dispatch(
      this.#view.state.tr
        .insertText(text, from, to)
        .setMeta('wysiwygMarkdownSource', 'api'),
    );
    return true;
  }

  insertMarkdown(markdown: string): boolean {
    if (!this.#view || !this.#isEditable()) return false;
    const parsed = this.#parseOrReport(markdown);
    const { from, to } = this.#view.state.selection;
    this.#view.dispatch(
      this.#view.state.tr
        .replaceWith(from, to, parsed.content)
        .scrollIntoView()
        .setMeta('wysiwygMarkdownSource', 'api'),
    );
    return true;
  }

  replaceSelection(markdown: string): boolean {
    return this.insertMarkdown(markdown);
  }

  insertImage(source: string, alt = 'Image', title: string | null = null): boolean {
    if (!this.#view || !this.#isEditable()) return false;
    const image = markdownSchema.nodes.image.create({ src: source, alt, title });
    this.#view.dispatch(
      this.#view.state.tr
        .replaceSelectionWith(image)
        .scrollIntoView()
        .setMeta('wysiwygMarkdownSource', 'api'),
    );
    return true;
  }

  cancelBlockSourceEdit = (): void => {
    this.blockSourceOpen = false;
    this.blockSourceValue = '';
    this.#blockSourceRange = undefined;
    this.#view?.setProps({ editable: () => this.#isEditable() });
    this.#refreshTaskCheckboxes();
    this.#view?.focus();
  };

  applyBlockSourceEdit = (): void => {
    if (!this.#view || !this.#blockSourceRange) return;
    const parsed = this.#parseOrReport(this.blockSourceValue);
    const { from, to } = this.#blockSourceRange;
    this.#view.dispatch(
      this.#view.state.tr
        .replaceWith(from, to, parsed.content)
        .scrollIntoView()
        .setMeta('wysiwygMarkdownSource', 'source-edit'),
    );
    this.blockSourceOpen = false;
    this.blockSourceValue = '';
    this.#blockSourceRange = undefined;
    this.#view.setProps({ editable: () => this.#isEditable() });
    this.#refreshTaskCheckboxes();
    this.#emitChange('source-edit');
    this.#view.focus();
  };

  #isEditable(): boolean {
    return (
      this.mode === 'wysiwyg' &&
      !this.readonly &&
      !this.disabled &&
      !this.blockSourceOpen
    );
  }

  #createPlugins(): Plugin[] {
    return [
      this.#historyPlugin,
      this.#blockEditingKeymapPlugin,
      this.#standardInputRulesPlugin,
      this.#codeHighlightPlugin,
      ...this.#registry.plugins(),
      this.#listEditingKeymapPlugin,
      this.#lineBreakKeymapPlugin,
      this.#historyKeymapPlugin,
      this.#baseKeymapPlugin,
    ];
  }

  #reconfigurePlugins(): void {
    if (!this.#view) return;
    this.#plugins = this.#createPlugins();
    this.#view.updateState(
      this.#view.state.reconfigure({ plugins: this.#plugins }),
    );
  }

  #commands(): Record<string, EditorCommand> {
    return this.#registry.commands(standardCommands);
  }

  #dispatchTransaction(transaction: Transaction): void {
    if (!this.#view) return;
    const state = this.#view.state.apply(transaction);
    this.#view.updateState(state);

    if (transaction.docChanged) {
      const markdown = serializeMarkdown(state.doc);
      this.#lastDocumentMarkdown = markdown;
      this.value = markdown;
      this.documentSourceValue = markdown;
      if (!transaction.getMeta('wysiwygMarkdownSilent')) {
        const source =
          transaction.getMeta('wysiwygMarkdownSource') ??
          (transaction.getMeta('paste') ? 'paste' : 'keyboard');
        this.#emitInput(source);
      }
    }

    if (transaction.selectionSet) {
      this.dispatchEvent(
        new CustomEvent('selection-change', {
          detail: {
            from: state.selection.from,
            to: state.selection.to,
          },
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  #replaceDocument(
    markdown: string,
    emit: boolean,
    source: WysiwygMarkdownInputDetail['source'] = 'api',
  ): void {
    if (!this.#view) return;
    const parsed = this.#parseOrReport(markdown);
    const transaction = this.#view.state.tr.replaceWith(
      0,
      this.#view.state.doc.content.size,
      parsed.content,
    );
    transaction.setMeta('wysiwygMarkdownSource', source);
    transaction.setMeta('wysiwygMarkdownSilent', !emit);
    if (source === 'api') transaction.setMeta('addToHistory', false);
    this.#view.dispatch(transaction);
  }

  #parseOrReport(markdown: string): ProseMirrorNode {
    try {
      return parseMarkdown(markdown);
    } catch (error) {
      this.#reportError(error, markdown);
      return parseMarkdown('');
    }
  }

  #emitInput(source: WysiwygMarkdownInputDetail['source']): void {
    this.dispatchEvent(
      new CustomEvent<WysiwygMarkdownInputDetail>('input', {
        detail: { markdown: this.value, source },
        bubbles: true,
        composed: true,
      }),
    );
  }

  #emitChange(source: WysiwygMarkdownInputDetail['source']): void {
    this.dispatchEvent(
      new CustomEvent<WysiwygMarkdownInputDetail>('change', {
        detail: { markdown: this.value, source },
        bubbles: true,
        composed: true,
      }),
    );
  }

  #syncFormValue(): void {
    if (this.#internals && typeof this.#internals.setFormValue === 'function') {
      this.#internals.setFormValue(this.disabled ? null : this.value);
    }
  }

  #reportError(error: unknown, markdown: string): void {
    this.dispatchEvent(
      new CustomEvent('editor-error', {
        detail: { error, markdown },
        bubbles: true,
        composed: true,
      }),
    );
  }

  #handleImagePaste(view: EditorView, event: ClipboardEvent): boolean {
    const file = [...(event.clipboardData?.files ?? [])].find((candidate) =>
      candidate.type.startsWith('image/'),
    );
    if (!file || !this.uploadImage) return false;

    event.preventDefault();
    const selection = {
      from: view.state.selection.from,
      to: view.state.selection.to,
    };
    void this.#uploadAndInsertImage(file, selection);
    return true;
  }

  async #uploadAndInsertImage(file: File, selection: BlockSourceRange): Promise<void> {
    if (!this.#view || !this.uploadImage) return;
    try {
      const source = await this.uploadImage(file);
      if (!source || !this.#view) return;
      const image = markdownSchema.nodes.image.create({
        src: source,
        alt: file.name || 'Image',
        title: null,
      });
      const maximum = this.#view.state.doc.content.size;
      const from = Math.min(selection.from, maximum);
      const to = Math.min(selection.to, maximum);
      this.#view.dispatch(
        this.#view.state.tr
          .replaceWith(from, to, image)
          .scrollIntoView()
          .setMeta('wysiwygMarkdownSource', 'paste'),
      );
    } catch (error) {
      this.#reportError(error, `[image paste: ${file.name}]`);
    }
  }

  #createImageNodeView(initialNode: ProseMirrorNode): NodeView {
    const image = document.createElement('img');
    let node = initialNode;
    let resolvedSource: string | null = null;
    let destroyed = false;

    const updateSource = async (source: string): Promise<void> => {
      image.dataset.source = source;
      image.alt = node.attrs.alt ?? '';
      image.title = node.attrs.title ?? '';
      try {
        resolvedSource = this.imageResolver
          ? await this.imageResolver(source)
          : source;
        if (destroyed) {
          this.#revokeResolvedImage(resolvedSource);
          return;
        }
        if (resolvedSource) {
          image.src = resolvedSource;
          image.removeAttribute('data-missing');
        } else {
          image.removeAttribute('src');
          image.dataset.missing = 'true';
          image.alt = node.attrs.alt || `Image not found: ${source}`;
        }
      } catch (error) {
        image.removeAttribute('src');
        image.dataset.missing = 'true';
        this.#reportError(error, source);
      }
    };

    void updateSource(node.attrs.src);
    return {
      dom: image,
      update: (updatedNode) => {
        if (updatedNode.type !== node.type) return false;
        this.#revokeResolvedImage(resolvedSource);
        resolvedSource = null;
        node = updatedNode;
        void updateSource(updatedNode.attrs.src);
        return true;
      },
      destroy: () => {
        destroyed = true;
        this.#revokeResolvedImage(resolvedSource);
      },
    };
  }

  #createCodeBlockNodeView(
    initialNode: ProseMirrorNode,
    view: EditorView,
    getPos: () => number | undefined,
  ): NodeView {
    const container = document.createElement('div');
    container.className = 'code-block-container';

    const header = document.createElement('div');
    header.className = 'code-block-header';
    header.setAttribute('part', 'code-block-header');
    header.contentEditable = 'false';

    const languageControl = document.createElement('span');
    languageControl.className = 'code-block-language-control';
    languageControl.setAttribute('part', 'code-block-language-control');

    const languageEditor = document.createElement('input');
    languageEditor.type = 'text';
    languageEditor.className = 'code-block-language code-block-language-editor';
    languageEditor.setAttribute('part', 'code-block-language-editor');
    languageEditor.setAttribute('aria-label', 'Code language');
    languageEditor.title = 'Edit code language';
    languageEditor.placeholder = 'text';
    languageEditor.autocomplete = 'off';
    languageEditor.spellcheck = false;
    languageEditor.readOnly = !this.#isEditable();

    const languageDisplay = document.createElement('span');
    languageDisplay.className = 'code-block-language code-block-language-display';
    languageDisplay.setAttribute('part', 'code-block-language');
    languageDisplay.setAttribute('aria-hidden', 'true');
    languageControl.append(languageEditor, languageDisplay);

    const copyButton = document.createElement('button');
    copyButton.type = 'button';
    copyButton.className = 'copy-code-button';
    copyButton.setAttribute('part', 'copy-code-button');
    copyButton.setAttribute('aria-label', 'Copy code');
    copyButton.title = 'Copy code';
    copyButton.textContent = '📄';

    const pre = document.createElement('pre');
    pre.className = 'code-block-body';
    pre.setAttribute('part', 'code-block-body');
    const code = document.createElement('code');
    code.className = 'hljs';
    pre.append(code);
    const body = document.createElement('div');
    body.className = 'code-block-content';
    const lineNumbers = document.createElement('pre');
    lineNumbers.className = 'code-line-numbers';
    lineNumbers.setAttribute('part', 'code-line-numbers');
    lineNumbers.setAttribute('aria-hidden', 'true');
    lineNumbers.contentEditable = 'false';
    const lineNumberCode = document.createElement('code');
    lineNumbers.append(lineNumberCode);
    body.append(lineNumbers, pre);
    header.append(languageControl, copyButton);
    container.append(header, body);

    let node = initialNode;
    let feedbackTimer: ReturnType<typeof setTimeout> | undefined;

    const updatePresentation = (): void => {
      const info = String(node.attrs.params ?? '').trim();
      const storedLanguage = info.split(/\s+/)[0] || '';
      const codeLanguage = storedLanguage || 'text';
      if (!languageEditor.matches(':focus')) languageEditor.value = storedLanguage;
      languageDisplay.textContent = codeLanguage;
      code.dataset.language = codeLanguage;
      header.hidden = !this.showCodeBlockHeader;
      const lines = node.textContent.split('\n');
      const showLineNumbers = this.showCodeLineNumbers && lines.length > 1;
      lineNumberCode.textContent = lines.map((_line, index) => index + 1).join('\n');
      lineNumbers.hidden = !showLineNumbers;
      body.dataset.lineCount = String(lines.length);
      body.toggleAttribute('data-line-numbers', showLineNumbers);
    };

    const commitLanguageEdit = (): void => {
      if (languageEditor.readOnly) return;
      const currentParams = String(node.attrs.params ?? '').trim();
      const currentLanguage = currentParams.split(/\s+/)[0] || '';
      const nextLanguage = (languageEditor.value.trim().split(/\s+/)[0] || '')
        .replaceAll('`', '');
      const suffix = currentParams.slice(currentLanguage.length);
      const nextParams = nextLanguage ? `${nextLanguage}${suffix}`.trim() : '';
      if (nextParams === currentParams) return;

      const position = getPos();
      if (typeof position !== 'number') return;
      view.dispatch(
        view.state.tr
          .setNodeMarkup(position, undefined, {
            ...node.attrs,
            params: nextParams || null,
          })
          .setMeta('wysiwygMarkdownSource', 'command'),
      );
    };

    const cancelLanguageEdit = (): void => {
      const currentParams = String(node.attrs.params ?? '').trim();
      languageEditor.value = currentParams.split(/\s+/)[0] || '';
      languageEditor.blur();
    };

    const handleLanguageEditorKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Enter') {
        event.preventDefault();
        event.stopPropagation();
        languageEditor.blur();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        cancelLanguageEdit();
      }
    };

    const handleLanguageEditorInput = (event: Event): void => {
      event.stopPropagation();
    };

    const showFeedback = (text: string): void => {
      if (feedbackTimer) clearTimeout(feedbackTimer);
      copyButton.textContent = text;
      feedbackTimer = setTimeout(() => {
        copyButton.textContent = '📄';
        feedbackTimer = undefined;
      }, 1000);
    };

    const handleCopy = async (): Promise<void> => {
      try {
        await this.#copyTextToClipboard(node.textContent);
        showFeedback('✓');
      } catch {
        showFeedback('!');
      }
    };
    languageEditor.addEventListener('input', handleLanguageEditorInput);
    languageEditor.addEventListener('keydown', handleLanguageEditorKeyDown);
    languageEditor.addEventListener('blur', commitLanguageEdit);
    copyButton.addEventListener('click', handleCopy);
    updatePresentation();

    return {
      dom: container,
      contentDOM: code,
      update: (updatedNode) => {
        if (updatedNode.type !== node.type) return false;
        node = updatedNode;
        updatePresentation();
        return true;
      },
      stopEvent: (event) =>
        header.contains(event.target as globalThis.Node) ||
        lineNumbers.contains(event.target as globalThis.Node),
      destroy: () => {
        if (feedbackTimer) clearTimeout(feedbackTimer);
        languageEditor.removeEventListener('input', handleLanguageEditorInput);
        languageEditor.removeEventListener('keydown', handleLanguageEditorKeyDown);
        languageEditor.removeEventListener('blur', commitLanguageEdit);
        copyButton.removeEventListener('click', handleCopy);
      },
    };
  }

  async #copyTextToClipboard(text: string): Promise<void> {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.readOnly = true;
    textarea.style.position = 'fixed';
    textarea.style.top = '-9999px';
    document.body.append(textarea);
    textarea.select();
    try {
      if (!document.execCommand('copy')) {
        throw new Error('The browser rejected the copy command.');
      }
    } finally {
      textarea.remove();
    }
  }

  #refreshCodeBlockChrome(): void {
    this.renderRoot.querySelectorAll<HTMLElement>('.code-block-container').forEach(
      (container) => {
        const header = container.querySelector<HTMLElement>('.code-block-header');
        const body = container.querySelector<HTMLElement>('.code-block-content');
        const lineNumbers = container.querySelector<HTMLElement>('.code-line-numbers');
        const languageEditor = container.querySelector<HTMLInputElement>(
          '.code-block-language-editor',
        );
        const showLineNumbers =
          this.showCodeLineNumbers && Number(body?.dataset.lineCount ?? 0) > 1;
        const editable = this.#isEditable();
        if (header) header.hidden = !this.showCodeBlockHeader;
        if (lineNumbers) lineNumbers.hidden = !showLineNumbers;
        if (languageEditor) {
          if (!editable && !languageEditor.readOnly) languageEditor.blur();
          languageEditor.readOnly = !editable;
        }
        body?.toggleAttribute('data-line-numbers', showLineNumbers);
      },
    );
  }

  #createCodeHighlightDecorations(documentNode: ProseMirrorNode): DecorationSet {
    if (!this.codeHighlighter) return DecorationSet.empty;
    const decorations: Decoration[] = [];

    documentNode.descendants((node, position) => {
      if (node.type !== markdownSchema.nodes.code_block) return true;
      const language = String(node.attrs.params ?? '').trim().split(/\s+/)[0] || 'text';
      let tokens: readonly CodeHighlightToken[];
      try {
        tokens = this.codeHighlighter?.(node.textContent, language) ?? [];
      } catch {
        return false;
      }

      for (const token of tokens) {
        const from = Math.max(0, Math.min(token.from, node.textContent.length));
        const to = Math.max(from, Math.min(token.to, node.textContent.length));
        if (from === to || !token.className.trim()) continue;
        decorations.push(
          Decoration.inline(position + 1 + from, position + 1 + to, {
            class: token.className,
          }),
        );
      }
      return false;
    });

    return DecorationSet.create(documentNode, decorations);
  }

  #revokeResolvedImage(source: string | null): void {
    if (source?.startsWith('blob:') && typeof URL.revokeObjectURL === 'function') {
      URL.revokeObjectURL(source);
    }
  }

  #createListItemNodeView(
    initialNode: ProseMirrorNode,
    view: EditorView,
    getPos: () => number | undefined,
  ): NodeView {
    const item = document.createElement('li');
    let node = initialNode;

    if (node.attrs.checked === null) {
      return { dom: item, contentDOM: item };
    }

    item.dataset.task = 'true';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.contentEditable = 'false';
    checkbox.setAttribute('aria-label', 'Toggle task');
    checkbox.checked = Boolean(node.attrs.checked);
    checkbox.disabled = !this.#isEditable();

    const content = document.createElement('div');
    content.className = 'task-content';
    item.append(checkbox, content);
    item.dataset.checked = checkbox.checked ? 'true' : 'false';

    const handleChange = (): void => {
      if (!this.#isEditable()) {
        checkbox.checked = Boolean(node.attrs.checked);
        return;
      }
      const position = getPos();
      if (typeof position !== 'number') return;
      view.dispatch(
        view.state.tr
          .setNodeMarkup(position, undefined, {
            ...node.attrs,
            checked: checkbox.checked,
          })
          .setMeta('wysiwygMarkdownSource', 'command'),
      );
    };
    checkbox.addEventListener('change', handleChange);

    return {
      dom: item,
      contentDOM: content,
      update: (updatedNode) => {
        if (
          updatedNode.type !== node.type ||
          updatedNode.attrs.checked === null
        ) {
          return false;
        }
        node = updatedNode;
        checkbox.checked = Boolean(updatedNode.attrs.checked);
        checkbox.disabled = !this.#isEditable();
        item.dataset.checked = checkbox.checked ? 'true' : 'false';
        return true;
      },
      stopEvent: (event) => event.target === checkbox,
      destroy: () => checkbox.removeEventListener('change', handleChange),
    };
  }

  #refreshTaskCheckboxes(): void {
    this.renderRoot
      .querySelectorAll<HTMLInputElement>('li[data-task] > input[type="checkbox"]')
      .forEach((checkbox) => {
        checkbox.disabled = !this.#isEditable();
      });
  }

  #handleEditorDoubleClick = (event: MouseEvent): void => {
    if (!this.#view || this.disabled || this.readonly) return;

    if (this.sourceEditScope !== 'block') {
      let sourceOffset: number | undefined;
      try {
        const result = this.#view.posAtCoords({
          left: event.clientX,
          top: event.clientY,
        });
        if (result) sourceOffset = this.#markdownOffsetAtPosition(result.pos);
      } catch {
        // Coordinate lookup can fail in non-layout environments. Source mode
        // still opens and preserves the textarea's existing selection.
      }

      event.preventDefault();
      this.#pendingSourceOffset = sourceOffset;
      this.setMode('source');
      return;
    }

    if (!this.#isEditable()) return;
    const result = this.#view.posAtCoords({
      left: event.clientX,
      top: event.clientY,
    });
    if (!result) return;

    const resolved = this.#view.state.doc.resolve(result.pos);
    if (resolved.depth < 1) return;
    const node = resolved.node(1);
    const from = resolved.before(1);
    const to = resolved.after(1);
    const temporaryDocument = markdownSchema.topNodeType.create(null, [node]);

    this.#blockSourceRange = { from, to };
    this.blockSourceValue = serializeMarkdown(temporaryDocument);
    this.blockSourceOpen = true;
    this.#view.setProps({ editable: () => this.#isEditable() });
    this.updateComplete.then(() => {
      const textarea = this.renderRoot.querySelector<HTMLTextAreaElement>('#block-source');
      textarea?.focus();
      textarea?.select();
    });
  };

  #markdownOffsetAtPosition(position: number): number | undefined {
    if (!this.#view) return undefined;

    const { doc, schema } = this.#view.state;
    const canonicalMarkdown = serializeMarkdown(doc);
    if (canonicalMarkdown !== this.value) return undefined;

    let insertionPosition = Math.max(0, Math.min(position, doc.content.size));
    let resolved = doc.resolve(insertionPosition);
    if (!resolved.parent.inlineContent) {
      const nearbySelection =
        Selection.findFrom(resolved, 1, true) ??
        Selection.findFrom(resolved, -1, true);
      if (!nearbySelection) return undefined;
      insertionPosition = nearbySelection.from;
      resolved = doc.resolve(insertionPosition);
    }

    let marker = 'WYSIWYGCURSORMARKER';
    while (canonicalMarkdown.includes(marker)) marker += 'X';

    try {
      const markerNode = schema.text(marker, resolved.marks());
      const markedDocument = this.#view.state.tr.insert(
        insertionPosition,
        markerNode,
      ).doc;
      const markedMarkdown = serializeMarkdown(markedDocument);
      const markerOffset = markedMarkdown.indexOf(marker);
      if (markerOffset < 0) return undefined;
      const withoutMarker =
        markedMarkdown.slice(0, markerOffset) +
        markedMarkdown.slice(markerOffset + marker.length);
      return withoutMarker === canonicalMarkdown ? markerOffset : undefined;
    } catch {
      return undefined;
    }
  }

  #proseMirrorPositionAtMarkdownOffset(markdown: string, offset: number): number {
    const safeOffset = Math.max(0, Math.min(offset, markdown.length));
    const parsedDocument = parseMarkdown(markdown);
    const fallbackPosition = markdown.length
      ? Math.round((safeOffset / markdown.length) * parsedDocument.content.size)
      : 0;

    let marker = 'WYSIWYGCURSORMARKER';
    while (markdown.includes(marker)) marker += 'X';

    try {
      const markedMarkdown =
        markdown.slice(0, safeOffset) + marker + markdown.slice(safeOffset);
      const markedDocument = parseMarkdown(markedMarkdown);
      let markerPosition: number | undefined;
      markedDocument.descendants((node, position) => {
        if (markerPosition !== undefined) return false;
        if (!node.isText) return true;
        const index = node.text?.indexOf(marker) ?? -1;
        if (index < 0) return true;
        markerPosition = position + index;
        return false;
      });
      if (markerPosition === undefined) return fallbackPosition;

      const canonicalMarkdown = serializeMarkdown(parsedDocument);
      const markedCanonicalMarkdown = serializeMarkdown(markedDocument);
      if (markedCanonicalMarkdown.replaceAll(marker, '') !== canonicalMarkdown) {
        return fallbackPosition;
      }
      return Math.min(markerPosition, parsedDocument.content.size);
    } catch {
      return fallbackPosition;
    }
  }

  #focusSourceAtOffset(offset?: number): void {
    const source = this.renderRoot.querySelector<HTMLTextAreaElement>(
      '#document-source',
    );
    if (!source) return;
    const sourceOffset = Math.max(
      0,
      Math.min(offset ?? source.selectionStart, source.value.length),
    );
    source.focus();
    source.setSelectionRange(sourceOffset, sourceOffset);
    this.#centerSourceCaret(source, sourceOffset);
  }

  #centerSourceCaret(source: HTMLTextAreaElement, offset: number): void {
    if (source.clientWidth <= 0 || source.clientHeight <= 0) return;
    const view = source.ownerDocument.defaultView;
    if (!view) return;
    const computed = view.getComputedStyle(source);
    const mirror = source.ownerDocument.createElement('div');
    const marker = source.ownerDocument.createElement('span');
    mirror.className = 'source-caret-mirror';
    marker.className = 'source-caret-marker';

    const copiedProperties = [
      'direction',
      'font-family',
      'font-size',
      'font-style',
      'font-variant',
      'font-weight',
      'letter-spacing',
      'line-height',
      'padding-top',
      'padding-right',
      'padding-bottom',
      'padding-left',
      'tab-size',
      'text-align',
      'text-indent',
      'text-transform',
      'white-space',
      'word-break',
      'overflow-wrap',
    ];
    for (const property of copiedProperties) {
      mirror.style.setProperty(property, computed.getPropertyValue(property));
    }
    mirror.style.position = 'fixed';
    mirror.style.left = '-10000px';
    mirror.style.top = '0';
    mirror.style.boxSizing = 'border-box';
    mirror.style.width = `${source.clientWidth}px`;
    mirror.style.height = 'auto';
    mirror.style.minHeight = '0';
    mirror.style.overflow = 'hidden';
    mirror.style.visibility = 'hidden';
    mirror.style.margin = '0';
    mirror.textContent = source.value.slice(0, offset);
    marker.textContent = '\u200b';
    mirror.append(marker);
    source.ownerDocument.body.append(mirror);

    try {
      const mirrorRect = mirror.getBoundingClientRect();
      const markerRect = marker.getBoundingClientRect();
      const fontSize = Number.parseFloat(computed.fontSize) || 16;
      const lineHeight = Number.parseFloat(computed.lineHeight) || fontSize * 1.2;
      const caretTop = markerRect.top - mirrorRect.top;
      const desiredScrollTop = caretTop - (source.clientHeight - lineHeight) / 2;
      const maxScrollTop = Math.max(0, source.scrollHeight - source.clientHeight);
      source.scrollTop = Math.max(0, Math.min(desiredScrollTop, maxScrollTop));
    } finally {
      mirror.remove();
    }
  }

  #focusWysiwygAtPosition(position: number): void {
    if (!this.#view) return;
    const { doc } = this.#view.state;
    const safePosition = Math.max(0, Math.min(position, doc.content.size));
    const selection = Selection.near(doc.resolve(safePosition), 1);
    this.#view.dispatch(this.#view.state.tr.setSelection(selection));
    try {
      this.#view.focus();
    } catch {
      this.#view.dom.focus();
    }
    this.#centerWysiwygPosition(selection.head);
  }

  #centerWysiwygPosition(position: number): void {
    if (!this.#view) return;
    const mount = this.renderRoot.querySelector<HTMLElement>('#editor-mount');
    if (!mount || mount.clientHeight <= 0) return;

    try {
      const caret = this.#view.coordsAtPos(position);
      const mountRect = mount.getBoundingClientRect();
      const caretCenter = (caret.top + caret.bottom) / 2;
      const viewportCenter = mountRect.top + mount.clientHeight / 2;
      const desiredScrollTop = mount.scrollTop + caretCenter - viewportCenter;
      const maxScrollTop = Math.max(0, mount.scrollHeight - mount.clientHeight);
      mount.scrollTop = Math.max(0, Math.min(desiredScrollTop, maxScrollTop));
    } catch {
      // Invalid or non-layout positions keep the browser's native scroll state.
    }
  }

  #handleLinkAuxClick(event: MouseEvent): boolean {
    if (event.button !== 1) return false;
    const link = event
      .composedPath()
      .find((target): target is HTMLAnchorElement => target instanceof HTMLAnchorElement);
    if (!link?.href) return false;

    event.preventDefault();
    window.open(link.href, '_blank', 'noopener,noreferrer');
    return true;
  }

  #handleImageActivate(event: MouseEvent): boolean {
    const image = event
      .composedPath()
      .find((target): target is HTMLImageElement => target instanceof HTMLImageElement);
    const source = image?.dataset.source;
    if (!image || !source) return false;

    this.dispatchEvent(
      new CustomEvent<WysiwygMarkdownImageActivateDetail>('image-activate', {
        detail: {
          source,
          displaySource: image.currentSrc || image.src,
        },
        bubbles: true,
        composed: true,
      }),
    );
    return false;
  }

  scrollToImage(
    source: string,
    options: ScrollIntoViewOptions = { behavior: 'smooth', block: 'center' },
  ): boolean {
    const image = Array.from(
      this.renderRoot.querySelectorAll<HTMLImageElement>('img[data-source]'),
    ).find((candidate) => candidate.dataset.source === source);
    if (!image) return false;
    image.scrollIntoView(options);
    return true;
  }

  #handleDocumentSourceInput = (event: InputEvent): void => {
    this.documentSourceValue = (event.currentTarget as HTMLTextAreaElement).value;
    this.value = this.documentSourceValue;
    this.#emitInput('source-edit');
  };

  #handleDocumentSourceKeyDown = (event: KeyboardEvent): void => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      this.setMode(this.#sourceReturnMode);
    }
  };

  #handleDocumentSourcePaste = (event: ClipboardEvent): void => {
    if (this.disabled || this.readonly) return;
    const textarea = event.currentTarget as HTMLTextAreaElement;
    const image = [...(event.clipboardData?.files ?? [])].find((file) =>
      file.type.startsWith('image/'),
    );

    if (image && this.uploadImage) {
      event.preventDefault();
      const selectionStart = textarea.selectionStart;
      const selectionEnd = textarea.selectionEnd;
      void this.uploadImage(image)
        .then((source) => {
          if (!source) return;
          const alt = (image.name || 'Image').replaceAll(']', '\\]');
          this.#replaceDocumentSourceSelection(
            textarea,
            `![${alt}](${source})`,
            selectionStart,
            selectionEnd,
          );
        })
        .catch((error) => this.#reportError(error, `[image paste: ${image.name}]`));
      return;
    }

    if (!this.transformPastedText) return;
    const text = event.clipboardData?.getData('text/plain');
    if (text === undefined) return;
    const transformed = this.transformPastedText(text);
    if (transformed === text) return;
    event.preventDefault();
    this.#replaceDocumentSourceSelection(textarea, transformed);
  };

  #replaceDocumentSourceSelection(
    textarea: HTMLTextAreaElement,
    text: string,
    start = textarea.selectionStart,
    end = textarea.selectionEnd,
  ): void {
    textarea.value =
      textarea.value.slice(0, start) + text + textarea.value.slice(end);
    const cursor = start + text.length;
    textarea.setSelectionRange(cursor, cursor);
    this.documentSourceValue = textarea.value;
    this.value = textarea.value;
    this.#emitInput('source-edit');
  }

  #handleBlockSourceInput = (event: InputEvent): void => {
    this.blockSourceValue = (event.currentTarget as HTMLTextAreaElement).value;
  };

  #handleBlockSourceKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.cancelBlockSourceEdit();
      return;
    }
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      this.applyBlockSourceEdit();
    }
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'wysiwyg-markdown': WysiwygMarkdownElement;
  }
}
