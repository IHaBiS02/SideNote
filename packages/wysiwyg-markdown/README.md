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
extensions. No manual copy or second repository is required.

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

Double-clicking the WYSIWYG document switches the entire document to Markdown
source mode by default. Press `Ctrl/Cmd + Enter` to return. Block-level source
editing remains available as an opt-in mode:

```html
<wysiwyg-markdown source-edit-scope="block"></wysiwyg-markdown>
```

A host application can provide trusted CSS through `themeCss`, configure code
headers and line numbers, and register commands/input rules through the public
extension API. Editable syntax highlighting is supplied by a `codeHighlighter`
callback and uses ProseMirror decorations, so it does not rewrite editable DOM.

See [`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md) for the architecture
and extension points.
