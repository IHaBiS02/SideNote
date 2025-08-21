# SideNote

A simple notes browser extension that provides a note-taking interface in the browser's side panel. SideNote supports Markdown editing with live preview, syntax highlighting, dark/light modes, and import/export functionality.

## Features

- **Markdown Support**: Write notes in Markdown with live preview
- **Syntax Highlighting**: Code blocks with syntax highlighting using highlight.js
- **Dark/Light Mode**: Toggle between themes for comfortable viewing
- **Import/Export**: Save and load notes in `.snote` and `.snotes` formats
- **Image Support**: Paste and embed images directly into notes
- **Recycle Bin**: Soft delete with 30-day auto-cleanup
- **Browser Integration**: Works in Chrome **AND** Firefox ~~(Firefox is in development)~~
- **Keyboard Shortcut**: Quick access with `Shift+Alt+W`

## Installation

### For Development

1. Clone this repository:

   ```bash
   git clone https://github.com/IHaBiS02/SideNote
   cd SideNote
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the extension:

   ```bash
   npm run build
   ```

4. Load the extension:
   - **Chrome**: Go to `chrome://extensions/`, enable Developer mode, click "Load unpacked", select `build/chrome/`
   - **Firefox**: Go to `about:debugging`, click "This Firefox", click "Load Temporary Add-on", select the built extension

### From Store

[Chrome](https://chromewebstore.google.com/detail/sidenote/jdgobmepjpcgfcjmocndbbhhigogafak?authuser=0&hl=ko)
[Firefox](https://addons.mozilla.org/en-US/firefox/addon/sidenote1/)

## Usage

1. Click the SideNote icon in your browser toolbar or use `Shift+Alt+W`
2. The side panel will open with the notes interface
3. Make a new note and write notes
4. Press ESC or Shift+Enter to save edit and return to preview

You can paste image on the clipboard directly into notes by Ctrl+V  
On the bottom, there are two buttons with ✅/❌ on it, the left one add two spaces on the pasted text, and the right one replace `~` to `\~` automatically.

In settings, you can choose theme, Mode of Title (Default use first line as title, Custom let user type own title by double-click title in note), text size, and two settings on it.

Images button show all images used in the notes, showing that which one is used in which note.
Recycle bin shows all soft-deleted notes and images, and let user delete all at once.
Licenses show license of libraries used in this project.

## Development

### Build Commands

```bash
# Install dependencies
npm install

# Build for both Chrome and Firefox
npm run build
```

## License

See [LICENSE](LICENSE) file for details.
