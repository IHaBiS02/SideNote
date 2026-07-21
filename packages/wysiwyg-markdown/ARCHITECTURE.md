# WYSIWYG Markdown editor architecture

This document describes the editor as it exists in the SideNote repository.
The editor is reusable first-party code, but it is developed and released as an
internal npm workspace rather than as a separate repository.

## Responsibilities

The editor owns:

- Markdown parsing and serialization;
- the Lit custom element and its Shadow DOM;
- ProseMirror state, history, selection, commands, and input rules;
- WYSIWYG, full-document source, and optional block-source modes;
- editable code-block chrome and decoration-based syntax highlighting;
- extension registration and form-associated element behavior.

SideNote owns:

- note persistence and IndexedDB image storage;
- application settings and navigation state;
- the 4.1.14-compatible visual theme;
- highlight.js tokenization;
- legacy pasted-text processing;
- image-modal presentation and image-management navigation;
- deciding when Preview/WYSIWYG and Markdown source modes are active.

## Workspace layout

```text
packages/wysiwyg-markdown/
├─ src/
│  ├─ index.ts                       # package entry and custom-element registration
│  ├─ core/
│  │  ├─ markdown.ts                # schema, parser, and serializer
│  │  └─ commands.ts                # standard command implementations
│  ├─ element/
│  │  ├─ wysiwyg-markdown.ts        # Lit/ProseMirror Web Component
│  │  └─ styles.ts                  # minimal component-owned CSS
│  └─ extensions/
│     ├─ registry.ts                # extension ordering and plugin assembly
│     ├─ standard.ts                # built-in Markdown input rules
│     └─ types.ts                   # extension contracts
├─ demo/                            # standalone browser demo
├─ tests/                           # parser, element, and extension tests
├─ scripts/
│  └─ generate-third-party-licenses.mjs
├─ package.json
├─ vite.config.ts
└─ tsconfig*.json
```

## Data flow

Markdown is the canonical value at every application boundary.

```text
SideNote note.content (Markdown)
  -> editor.value / setMarkdown()
  -> Markdown parser
  -> ProseMirror document
  -> WYSIWYG editing transaction
  -> Markdown serializer
  -> input/change event detail.markdown
  -> SideNote autosave
```

The editor never stores SideNote note objects or IndexedDB records. Switching
to source mode exposes the complete Markdown string; switching back parses that
string into the same ProseMirror schema.

## Element contract

Importing `src/index.ts` registers `<wysiwyg-markdown>` if it is not already
registered. The element is form-associated and keeps `value` as Markdown.

Primary properties:

- `value`, `mode`, `placeholder`, `readonly`, `disabled`, and `name`;
- `sourceEditScope` (`document` by default, `block` as opt-in);
- `showCodeBlockHeader` and `showCodeLineNumbers`;
- `themeCss` and `codeHighlighter`;
- `uploadImage`, `imageResolver`, and `transformPastedText` hooks.

Public methods include Markdown getters/setters, mode and focus control,
undo/redo, named-command execution, extension management, and text/Markdown/
image insertion. `scrollToImage(source)` provides source-based navigation
without exposing the Shadow DOM. The complete contract is documented in
`Functions.md` and the package README.

The element emits composed, bubbling `input`, `change`, `mode-change`,
`selection-change`, `image-activate`, and `editor-error` events so host
applications can listen outside the Shadow DOM. `image-activate` carries both
the persisted Markdown source and resolved display source.

## Markdown and editing behavior

`core/markdown.ts` extends the ProseMirror CommonMark schema with task-list
state, strikethrough, soft breaks, fenced-code language metadata, and image
metadata. Parsing uses markdown-it through `prosemirror-markdown`; serialization
returns stable Markdown for persistence.

Built-in input rules recognize:

- `#` through `######` followed by a space for headings;
- triple backticks for a code block;
- `>` for blockquotes;
- `-`, `+`, or `*` for bullet lists;
- numbered-list prefixes;
- `[ ]` and `[x]` inside list items;
- `---` for a horizontal rule.

`Shift+Enter` inserts a soft break in normal inline content and preserves
newline behavior inside code. Pressing `Backspace` in an empty heading converts
it to a paragraph, removing the corresponding Markdown heading marker without
opening source mode. SideNote uses full-document source mode when the user
double-clicks Preview or presses Edit. A double-click coordinate is resolved to
a ProseMirror document position, then mapped into canonical Markdown by
temporarily inserting a unique text marker during serialization. The source
textarea opens with its caret at that Markdown offset. Its global
`wysiwygPreview` preference chooses `wysiwyg` or `readonly` for Preview without
changing renderers, so both variants retain the same document structure, theme,
syntax highlighting, and code-block chrome.

## Extensions

An `EditorExtension` can contribute:

- named commands;
- ProseMirror key bindings;
- regular-expression input rules;
- a numeric priority used for deterministic ordering.

`editor.use(extension)` registers an extension and rebuilds the plugin list.
`removeExtension(name)` removes it. Duplicate or empty names are rejected.
Extension commands are called with the current state, optional dispatch
function, and view.

Component-owned CSS defines the structural grid and padding for fenced code;
host CSS supplies colors, typography, and product-specific borders. Fenced
code blocks apply `--editor-code-background` to the content wrapper,
line-number `pre`, body `pre`, and nested `code` element. This prevents the
generic `--editor-muted-background` used by inline code and other muted
surfaces from showing through code-block padding or grid gaps. The header uses
the separate `--editor-code-header-background` variable. The
`--editor-code-content-padding` variable defaults to `5px` and is applied with
selectors specific enough to win over the generic Shadow DOM `pre code` rule;
multi-line blocks reuse it for vertical padding, gutter spacing, and the body
right edge.

The Shadow DOM stylesheet also owns a deterministic semantic typography
baseline: body and heading line heights default to `1.5`, and heading sizes,
weights, margins, paragraph margins, and list margins are explicit. A host can
override the line heights through `--editor-line-height` and
`--editor-heading-line-height` without depending on browser UA defaults.
Full-document source mode and fenced code blocks default to `1.2`, exposed
separately through `--editor-source-line-height` and
`--editor-code-line-height` so their compact layout does not affect prose.

## SideNote adapter

`src/editor/sidenote-editor-adapter.ts` is the only SideNote-specific bridge.
It assigns the host theme through `themeCss`, converts highlight.js spans into
ProseMirror decoration ranges, configures code headers and line numbers,
resolves `images/{id}.png` references to scoped Blob URLs, stores pasted image
files in IndexedDB, and applies enabled legacy text transformations.

The adapter intentionally does not modify the editor's default CSS source.
SideNote controls fonts, colors, product-specific borders, and light/dark
themes through the injected trusted CSS string and shared CSS variables. The
editor keeps reusable code-block grid and padding rules in its base stylesheet.

## Code blocks

The editor's code-block node view keeps editable code separate from non-editable
UI. The optional header shows language and copy controls. Multi-line blocks get
a generated line-number gutter; single-line blocks omit the gutter. Syntax
highlighting uses decorations instead of replacing editable DOM, so copy,
selection, undo, and serialization continue to operate on plain code text.

## Build and packaging

From the SideNote repository root, `npm run build` performs the complete build:

1. clean prior output and editor `dist`;
2. generate one `LIBRARY_LICENSES.md` from the extension and editor runtime
   dependency graphs;
3. bundle the TypeScript editor with Vite and emit declarations;
4. package Chrome and Firefox extensions;
5. create the allow-listed Firefox AMO reviewer source ZIP.

The generated first-party bundle is written to
`packages/wysiwyg-markdown/dist/wysiwyg-markdown.js` and then copied directly
to each browser output as `vendor/wysiwyg-markdown.js`. It is ignored by Git.

## Verification

- `npm run typecheck`: editor TypeScript validation;
- `npm run test:editor`: parser, element, and extension tests;
- `npm run test:extension`: SideNote integration and application tests;
- `npm run test:run`: both test suites;
- `npm run demo --workspace @sidenote/wysiwyg-markdown`: standalone demo.
