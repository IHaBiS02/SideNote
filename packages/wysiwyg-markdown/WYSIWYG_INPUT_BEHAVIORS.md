# WYSIWYG Input Behaviors

[한국어](./WYSIWYG_INPUT_BEHAVIORS.ko.md)

This document describes the built-in Markdown input rules, keyboard behavior,
and paste behavior available in SideNote's Preview (WYSIWYG) mode. The
conversions below apply when typing at the start of a paragraph or list item in
WYSIWYG mode.

When `Editable WYSIWYG Preview` is disabled in SideNote settings, the same
renderer operates in `readonly` mode. The document layout and syntax
highlighting remain unchanged, but the direct editing behaviors below are
disabled. Double-click the document or press Edit to open full-document
Markdown source editing.

## Markdown Input Rules

| Input | Result | Stored Markdown example |
| --- | --- | --- |
| `# ` through `###### ` | Level 1 through level 6 heading | `## Heading` |
| `Backspace` in an empty heading | Convert the heading back to a paragraph | Removes the heading's `#` marker |
| ```` ``` ```` | Code block | Code enclosed by triple backticks |
| `> ` | Blockquote | `> Quote` |
| `- `, `+ `, `* ` | Bullet list | `* Item` |
| A number and period such as `1. ` | Ordered list | `1. Item` |
| `[ ] ` inside a list item | Unchecked task item | `* [ ] Task` |
| `[x] ` or `[X] ` inside a list item | Checked task item | `* [x] Task` |
| `---` | Horizontal rule | `---` |

The input marker is immediately converted into the corresponding block type
instead of remaining as text in the document. For example, typing `## ` in a
new paragraph moves the caret into a level 2 heading. Pressing `Backspace` in
the converted empty heading changes it back to a paragraph.

## Keyboard and Mouse Behavior

| Action | Result |
| --- | --- |
| `Shift+Enter` | Insert a line break inside the current block without creating a new paragraph |
| `Enter` in a non-empty bullet-list item | Create the next bullet-list item |
| `Enter` in a non-empty ordered-list item | Create the next item with the following number |
| `Enter` in an empty list item | Exit the current list |
| `Tab` in a bullet or ordered-list item | Nest the current item one level under its previous item |
| `Shift+Tab` in a nested list item | Move the current item one level outward |
| `Ctrl+Z` / `Cmd+Z` | Undo |
| `Ctrl+Shift+Z` / `Cmd+Shift+Z` | Redo |
| `Ctrl+Y` / `Cmd+Y` | Redo |
| Double-click the document | Switch to full-document plain-text source mode, synchronize the Markdown caret, and center it when document edges allow |
| `Ctrl+Enter` / `Cmd+Enter` in source mode | Return to the configured WYSIWYG Preview mode, synchronize the WYSIWYG caret, and center it when possible |
| `Enter` or `Escape` in SideNote's custom-title field | Commit the title edit and remain on the current note; `Escape` does not trigger global back navigation |
| Click a task checkbox | Update both the checkbox state and `[ ]`/`[x]` in Markdown |
| Middle-click a link | Open the link in a new browser tab |
| Click a rendered image | Emit `image-activate`; SideNote opens the image modal |
| Code language field in a code-block header | Edit the fenced-code language directly |

Inside bullet and ordered lists, `Enter` creates the next list item while
`Shift+Enter` inserts a line break inside the current item. Ordered-list
numbers advance automatically. Pressing `Enter` in an empty list item exits
the list, matching common Markdown editor behavior. When a previous list item
is available, `Tab` nests the current bullet or numbered item beneath it;
`Shift+Tab` moves a nested item back outward. A first item with no preceding
sibling cannot be nested and remains unchanged. `Shift+Enter` also inserts a
line break inside a code block; other blocks retain their normal ProseMirror
behavior.

Bullet and ordered-list markers use `--editor-list-marker-color` so they remain
visually distinct from item text without changing the text color. SideNote
provides subdued gray marker colors for both light and dark themes.

Markdown tables use collapsed 1px cell borders controlled by
`--editor-table-border-color`. SideNote sets the border to black in the light
theme and white in the dark theme so each row and column remains distinct.
Cell content is centered when a Markdown column has no alignment marker.
Explicit left (`:---`), center (`:---:`), and right (`---:`) alignment markers
continue to override that visual default. Left-aligned cells keep 5px between
their content and the left border, while right-aligned cells keep 5px from the
right border. Hosts can override this spacing with
`--editor-table-aligned-cell-padding`.

The code body, line-number gutter, and internal spacing use the same
`--editor-code-background` color. The header keeps its separate
`--editor-code-header-background` color so only the header is visually
distinguished from the body. Code content retains 5px of internal spacing via
`--editor-code-content-padding`; multi-line blocks use that spacing around the
body and between the line-number gutter and code text.

### Editing a Code Block Language

The language label above a code block, such as `javascript` or `text`, is
separate from the code body and is therefore excluded when selecting and
copying the body. In WYSIWYG mode, the language label is an always-editable
input: click the desired position to place the caret and edit the language.
The input is locked only in source, readonly, or disabled states.

The language input has no underline. Selecting all or dragging across the code
body does not paint a selection highlight over the language field; language
text can be selected only while the field itself is focused.

When unfocused, the real input remains transparent and an unselectable display
label is shown. Clicking the field focuses the same DOM input and hides the
display label, preserving click-to-edit behavior while suppressing external
selection highlighting.

- Press `Enter` or click elsewhere to save the change.
- Press `Escape` to cancel the change.
- Clearing the language removes the language information after the opening
  fence.
- A code block without a language displays `text` in its header but does not
  store a language in Markdown.

## Paste Behavior

### URLs

When WYSIWYG mode recognizes a pasted URL as a link, it always stores explicit
Markdown link syntax even when the display text and URL are identical.

```markdown
[https://example.com](https://example.com)
```

For example, pasting this URL:

```text
https://youtu.be/YcO-MxPf_Vg?si=--UyINcJ33oxOCE-
```

stores the following Markdown value:

```markdown
[https://youtu.be/YcO-MxPf_Vg?si=--UyINcJ33oxOCE-](https://youtu.be/YcO-MxPf_Vg?si=--UyINcJ33oxOCE-)
```

Loading an existing autolink such as `<https://example.com>` in WYSIWYG mode
also normalizes it to the same explicit link syntax. If the link text differs
from the URL, it remains in the form `[link text](URL)`.

### Images and Plain Text

- Clipboard images are saved to SideNote's image store and inserted as
  `![filename](images/...)`.
- SideNote's image-management view uses `scrollToImage(source)` to open a note
  and bring the matching rendered image into view.
- Plain text is transformed using SideNote's tilde processing and legacy line
  break compatibility settings before insertion.
- Source mode edits the original Markdown without applying WYSIWYG input rules.
  Image paste and SideNote's plain-text transformation settings remain
  available in source mode.

## Extensions

A host application can add commands, shortcuts, and input rules through the
editor's `use()` API. See [README.md](./README.md) for extension API examples.
