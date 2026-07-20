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
`insertText()`, `insertMarkdown()`, `replaceSelection()`, and `insertImage()`.
Extensions are installed with `use()` and removed with `removeExtension()`.

Host integration hooks:

- `themeCss`: trusted host CSS for the Shadow DOM;
- `codeHighlighter`: syntax token ranges and classes;
- `uploadImage`: pasted image persistence;
- `imageResolver`: stored Markdown image source resolution;
- `transformPastedText`: plain-text paste transformation;
- `showCodeBlockHeader` and `showCodeLineNumbers`: code-block UI controls.

The component emits bubbling, composed `input`, `change`, `mode-change`,
`selection-change`, and `editor-error` events. `input` and `change` expose the
latest Markdown at `event.detail.markdown`.

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
source mode by default. Press `Ctrl/Cmd + Enter` to return. Block-level source
editing remains available as an opt-in mode:

```html
<wysiwyg-markdown source-edit-scope="block"></wysiwyg-markdown>
```

A host application can provide trusted CSS through `themeCss`. Editable syntax
highlighting uses ProseMirror decorations, so it does not rewrite editable DOM.

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the current architecture and
host integration boundaries.
