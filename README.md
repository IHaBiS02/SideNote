# SideNote

A simple notes browser extension that provides a note-taking interface in the browser's side panel. SideNote supports Markdown editing with live preview, syntax highlighting, dark/light modes, and import/export functionality.

## Features

- **Markdown Support**: Write notes in Markdown with live preview
- **Syntax Highlighting**: Code blocks with syntax highlighting using highlight.js
- **Dark/Light Mode**: Toggle between themes for comfortable viewing
- **Import/Export**: Save and load notes in `.snote` and `.snotes` formats
- **Image Support**: Paste and embed images directly into notes
- **Recycle Bin**: Soft delete with 30-day auto-cleanup
- **Browser Integration**: Works in Chrome and Firefox side panels
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

*Extension store links will be added when available*

## Usage

1. Click the SideNote icon in your browser toolbar or use `Shift+Alt+W`
2. The side panel will open with the notes interface
3. Start writing in Markdown - preview updates in real-time
4. Use the toolbar for formatting, importing/exporting, and settings

## Development

### Build Commands

```bash
# Build for both Chrome and Firefox
npm run build

# Clean build directory
npm run clean

# Install dependencies
npm install
```

### Project Structure

```
├── src/                    # Source code
│   ├── main.js            # Entry point and initialization
│   ├── database.js        # IndexedDB operations
│   ├── notes_view.js      # UI rendering and view management
│   ├── events.js          # Event listeners and interactions
│   ├── history.js         # Navigation history
│   ├── import_export.js   # File handling
│   ├── dom.js             # DOM utilities
│   ├── notes.js           # Note management
│   ├── settings.js        # Settings management
│   └── utils.js           # General utilities
├── images/                # Extension icons
├── manifest.json          # Extension manifest
├── sidepanel.html         # Main UI
├── sidepanel.css          # Main styles
├── dark_mode.css          # Dark mode styles
└── build.js              # Build script
```

### Architecture

- **Storage**: Uses IndexedDB for notes and images, chrome.storage.local for global settings
- **Markdown**: Rendered with `marked.js` and sanitized with `DOMPurify`
- **Images**: Stored as blobs in IndexedDB with custom `sidenote-image://` protocol
- **Compatibility**: Manifest V3 for Chrome with Firefox support

## Version Management

When making changes:
1. Update version in `manifest.json`
2. Update version in `package.json`
3. Run `npm install` to update lock file
4. Test with `npm run build`

## Testing

No automated test suite exists. Manual testing required:
1. Build the extension
2. Load in browser
3. Test functionality in browser side panel

## License

See [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Note**: This is a Windows 11 development environment. Development commands are optimized for Windows.