# SideNote

A simple notes browser extension that provides a note-taking interface in the browser's side panel. SideNote supports Markdown editing with live preview, syntax highlighting, dark/light modes, and import/export functionality.

## Features

- **Configurable WYSIWYG Preview**: Use the same rendered document in editable
  or read-only mode while keeping Markdown as the stored format
- **Full Markdown Source Editing**: Double-click Preview or press Edit to edit
  the complete note as plain Markdown text
- **Soft Line Breaks**: Preview renders normal newlines without requiring trailing spaces
- **Extensible Editing**: Lit/ProseMirror editor with commands, shortcuts, and
  input-rule extensions
- **Code Blocks**: Language/copy headers, editable highlight.js syntax
  highlighting, and aligned multi-line line numbers
- **Dark/Light Mode**: Toggle between themes for comfortable viewing
- **Pinned Note Ordering**: Hold a pinned note, then drag its lifted card into
  the animated gap between pinned rows; the order is restored on next launch
- **Import/Export**: Save and load notes in `.snote` and `.snotes` formats
- **Image Support**: Paste and embed images directly into notes; the centered
  preview modal supports `Ctrl+wheel`, Firefox touchpad-pinch zoom, direct
  two-finger touchscreen pinch, and mouse or single-finger drag panning
- **Recycle Bin**: Soft delete with 30-day auto-cleanup
- **Browser Integration**: Works in Chrome **AND** Firefox ~~(Firefox is in development)~~
- **Keyboard Shortcut**: Quick access with `Shift+Alt+W`; a new-install setup
  popup appears when the browser leaves the command unassigned

## Installation

### From Store

[Chrome](https://chromewebstore.google.com/detail/sidenote/jdgobmepjpcgfcjmocndbbhhigogafak)  
[Firefox](https://addons.mozilla.org/en-US/firefox/addon/sidenote1/)

### For Development

1. Clone this repository:

   ```bash
   git clone https://github.com/IHaBiS02/SideNote
   cd SideNote
   ```

2. Install dependencies:

   ```bash
   npm ci
   ```

3. Build the extension:

   ```bash
   npm run build
   ```

4. Load the extension:
   - **Chrome**: Go to `chrome://extensions/`, enable Developer mode, click "Load unpacked", select `build/chrome/`
   - **Firefox**: Go to `about:debugging`, click "This Firefox", click "Load Temporary Add-on", select the built extension

## Usage

1. Click the SideNote icon in your browser toolbar or use `Shift+Alt+W`
2. The side panel will open with the notes interface
3. Make a new note and write notes
4. In full Markdown source mode, press Shift+Enter or Ctrl/Cmd+Enter to return
   to Preview. While editing a custom title, Enter or Escape finishes only the
   title edit and keeps the current note open.

Pinned notes remain above regular notes. Hold a pinned note for about 300 ms,
then drag the smaller floating card vertically. An animated rounded gap opens
at the current drop position, and the drag continues outside the original row.
Stable row-center boundaries and a 10px hysteresis zone keep the gap from
reopening repeatedly when the pointer rests near a boundary.
A short click still opens the note, and dragging from the pin or delete buttons
does not start reordering. Cancelling the pointer or leaving the extension
window restores the original order.
The hold delay is a global-only setting adjustable from 100 to 2000ms; it
defaults to 300ms and applies the next time the note list is shown.

The image modal supports physical touchpad pinch in Firefox. Chromium extension
Side Panels can consume that gesture before a DOM wheel event reaches SideNote,
so touchpad pinch is not supported there; use `Ctrl+wheel` instead. Direct
two-finger touchscreen pinch remains handled through Pointer Events.

On a new installation, SideNote checks the browser's registered command. If
the shortcut is unassigned, a small setup window links directly to the browser's
extension shortcut settings. The check runs only on initial installation, so a
shortcut intentionally removed later does not cause repeated prompts.

You can paste image on the clipboard directly into notes by Ctrl+V.  
Legacy text-processing options are available in settings for older Markdown workflows that used trailing spaces for line breaks.

In settings, you can choose theme, Mode of Title (Default use first line as title, Custom let user type own title by double-click title in note), text size, whether Preview is directly editable, code block header behavior, image deletion behavior, and legacy Markdown line-break behavior. WYSIWYG text, full-document plain text, and fenced code blocks have independent line-spacing controls from `1.0` to `3.0`, available globally or per note. Their defaults are `1.5`, `1.2`, and `1.2`, respectively. Editable WYSIWYG Preview is enabled by default; disabling it keeps the same rendering and switches Preview to read-only mode.

Images button show all images used in the notes, showing that which one is used in which note.
Recycle bin shows all soft-deleted notes and images, and let user delete all at once.
Licenses show license of libraries used in this project.

Export buttons keep the default `.snote` / `.snotes` behavior on left click. Right-click an export button to choose `.zip` or `.snote` / `.snotes`; right-click the `.zip` option to show original Markdown and two-space line-break Markdown export options above the `.zip` row.
All-notes `.zip` exports use sanitized note titles as folder names, with suffixes added when titles collide.

## Development

### Build Commands

```bash
# Install the extension and editor workspace dependencies
npm ci

# Type-check and test the editor and extension
npm run typecheck
npm run test:run

# Build the editor, Chrome/Firefox packages, and Firefox reviewer source ZIP
npm run build
```

The SideNote runtime is maintained as TypeScript in `background.ts` and `src/`.
The reusable editor source is part of this repository at
`packages/wysiwyg-markdown/`. The root build compiles both into JavaScript before
packaging the extension, then creates the AMO reviewer source archive, so a
SideNote checkout is sufficient for development and releases.
`npm run release:amo` remains an alias of `npm run build` for compatibility.

Architecture references:

- [`STRUCTURE.md`](./STRUCTURE.md): repository and SideNote runtime structure
- [`Functions.md`](./Functions.md): application functions and editor public API
- [`packages/wysiwyg-markdown/ARCHITECTURE.md`](./packages/wysiwyg-markdown/ARCHITECTURE.md): editor internals and host boundary
- [`packages/wysiwyg-markdown/WYSIWYG_INPUT_BEHAVIORS.md`](./packages/wysiwyg-markdown/WYSIWYG_INPUT_BEHAVIORS.md) ([한국어](./packages/wysiwyg-markdown/WYSIWYG_INPUT_BEHAVIORS.ko.md)): built-in WYSIWYG input and interaction reference
- [`packages/wysiwyg-markdown/MARKDOWN_SYNTAX_TEST.md`](./packages/wysiwyg-markdown/MARKDOWN_SYNTAX_TEST.md): complete supported-syntax rendering and interaction test note

Build output is written to `build/`. See
[`FIREFOX_AMO_SOURCE_SUBMISSION_GUIDE.md`](./FIREFOX_AMO_SOURCE_SUBMISSION_GUIDE.md)
for the Firefox source-review package workflow.

## License

See [LICENSE](LICENSE) file for details.
