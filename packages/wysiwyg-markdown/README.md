# WYSIWYG Markdown

English | [한국어](./README.ko.md)

The internal WYSIWYG Markdown editor used by SideNote. It is an extensible Web
Component built with Lit and ProseMirror and is maintained in the SideNote npm
workspace.

## Development from the SideNote root

```powershell
npm.cmd install
npm.cmd run typecheck
npm.cmd run test:editor
npm.cmd run build:editor
```

Start the standalone demo app with:

```powershell
npm.cmd run demo --workspace @sidenote/wysiwyg-markdown
```

The production editor build is written to
`packages/wysiwyg-markdown/dist/wysiwyg-markdown.js`. `npm run build` at the
SideNote root builds this file first and packages it directly into both browser
extensions, then creates the Firefox reviewer source ZIP. No manual copy or
second repository is required.

The same build regenerates the root `LIBRARY_LICENSES.md` from both the
extension and editor runtime dependency graphs. This includes Lit, ProseMirror,
Markdown-it, and their transitive runtime dependencies.

## Basic usage

```html
<script type="module" src="./wysiwyg-markdown.js"></script>
<wysiwyg-markdown id="editor"></wysiwyg-markdown>
```

```js
const editor = document.querySelector('#editor');
editor.value = '# Hello';
editor.addEventListener('input', (event) => {
  console.log(event.detail.markdown);
});
```

## Public API

The Markdown string is available through `value`, `getMarkdown()`, and
`setMarkdown()`. Modes are changed with `setMode('wysiwyg' | 'source' |
'readonly')`.

Editing methods include `focus()`, `undo()`, `redo()`, `execute()`,
`insertText()`, `insertMarkdown()`, `replaceSelection()`, `insertImage()`, and
`scrollToImage()`. The last method locates an image by its persisted Markdown
source and scrolls it into view without exposing Shadow DOM internals.
Extensions are installed with `use()` and removed with `removeExtension()`.

Host integration hooks:

- `themeCss`: trusted host CSS for the Shadow DOM;
- `codeHighlighter`: syntax token ranges and classes;
- `uploadImage`: pasted image persistence;
- `imageResolver`: stored Markdown image source resolution;
- `transformPastedText`: plain-text paste transformation;
- `showCodeBlockHeader` and `showCodeLineNumbers`: code-block UI controls.

The component emits bubbling, composed `input`, `change`, `mode-change`,
`selection-change`, `image-activate`, and `editor-error` events. `input` and
`change` expose the latest Markdown at `event.detail.markdown`.
`image-activate` exposes the persisted `source` and resolved `displaySource`
when a rendered image is clicked.

Rendered links open in a new browser tab on middle-click, `Ctrl+click`, or
`Cmd+click`. An unmodified primary click remains available to the editable
document.

SideNote uses `displaySource` to open a fitted, centered image modal. Modal image
clicks do not toggle zoom. `Ctrl+wheel` and browser-synthesized touchpad pinch
wheel events zoom around the pointer, direct two-pointer touchscreen pinch
zooms and follows the moving centroid, and mouse or single-finger press-drag
pans. Closing through the backdrop or `Escape` clears gesture state, so
reopening resets the view.

Extensions can contribute named commands, shortcuts, and input rules:

```js
editor.use({
  name: 'insert-date',
  shortcuts: {
    'Mod-Shift-d': ({ state, dispatch }) => {
      if (!dispatch) return true;
      dispatch(state.tr.insertText(new Date().toISOString().slice(0, 10)));
      return true;
    },
  },
});
```

Double-clicking the WYSIWYG document switches the entire document to Markdown
source mode by default and places the source caret at the corresponding
Markdown position. The source view scrolls to center that caret whenever the
document edges allow it. Press `Ctrl/Cmd + Enter` to return; the source caret is
mapped back into WYSIWYG and centered there as well. Block-level source editing
remains available as an opt-in mode:

Double-clicks originating from task checkboxes stay with the checkbox, so
rapid checkbox clicks do not open source mode.

```html
<wysiwyg-markdown source-edit-scope="block"></wysiwyg-markdown>
```

When the caret is in an empty heading, `Backspace` converts it to a paragraph
and removes its `#` heading marker from the Markdown value.

A host application can provide trusted CSS through `themeCss`. Editable syntax
highlighting uses ProseMirror decorations, so it does not rewrite editable DOM.
Fenced code content uses `--editor-code-content-padding` (`5px` by default) for
its inner spacing. Numbered blocks apply the same vertical value to the gutter
and code body so their lines remain aligned. The component defines `1.5` as the
default body and heading line height, while full-document source mode and
fenced code blocks use
`1.2`. Hosts can override these independently with `--editor-line-height`,
`--editor-heading-line-height`, `--editor-source-line-height`, and
`--editor-code-line-height`. Semantic heading sizes, weights, and margins are
explicit so hosts do not inherit browser-specific UA typography. Bullet and
ordered-list markers use `--editor-list-marker-color`; its default derives a
subdued color from the current text color, and hosts can provide an explicit
light- or dark-theme value. Markdown table cells use collapsed 1px borders
whose color is exposed as `--editor-table-border-color`; its default follows
the current text color. Columns without a Markdown alignment marker center their
cell content by default, while explicit left, center, and right markers remain
authoritative. Left- and right-aligned cells keep 5px of padding from their
respective aligned edge through `--editor-table-aligned-cell-padding`.

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the current architecture and
host integration boundaries. Built-in Markdown input rules, shortcuts, mouse
actions, and paste behavior are documented in
[`WYSIWYG_INPUT_BEHAVIORS.md`](./WYSIWYG_INPUT_BEHAVIORS.md).
Use [`MARKDOWN_SYNTAX_TEST.md`](./MARKDOWN_SYNTAX_TEST.md) as a complete manual
rendering and interaction test note covering every supported node and mark.
