# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SideNote is a Chrome/Firefox browser extension that provides a simple note-taking interface in the browser's side panel. It supports Markdown editing with live preview, syntax highlighting, dark/light modes, and import/export functionality.

## Development Commands

### Build
```bash
npm run build
```
Creates Chrome and Firefox builds in `build/chrome-*.zip` and `build/firefox-*.zip`.

### Clean Build Directory
```bash
npm run clean
```

### Install Dependencies
```bash
npm install
```

**Note**: This is a Windows 11 development environment. Avoid using Linux/Mac-specific commands.

## Architecture

### Data Storage
- **IndexedDB**: Primary storage for notes and images
  - `notes` object store: Note content, metadata, settings
  - `images` object store: Embedded images as blobs
- **chrome.storage.local**: Global settings only (migrated from for notes)

### Core Modules
- **src/main.js**: Entry point, handles initialization and data migration
- **src/database.js**: IndexedDB operations for notes and images
- **src/notes_view.js**: UI rendering and view management
- **src/events.js**: Event listeners and user interactions
- **src/history.js**: Navigation history management
- **src/import_export.js**: .snote/.snotes file handling

### Key Features Implementation
- **Markdown Rendering**: Uses `marked.js` with `DOMPurify` sanitization
- **Syntax Highlighting**: `highlight.js` with line numbers plugin
- **Image Handling**: Images pasted/imported are stored as blobs in IndexedDB
- **Recycle Bin**: Soft delete with 30-day auto-cleanup

## Development Workflow

### Version Updates
When making changes:
1. Update version in `manifest.json`
2. Update version in `package.json` to match
3. Run `npm install` to update `package-lock.json`
4. commit to git

### Documentation Updates
After significant changes, update:
- **STRUCTURE.md**: If architecture/file organization changes
- **Functions.md**: If function signatures or purposes change

### Git Commit Process
Use file-based commit method as specified in GEMINI.md:
```bash
git diff
git log -n 5
# Write commit message to commit_message.txt
git commit -F commit_message.txt
del commit_message.txt
```

### Testing
After changes:
1. Run `npm run build`
2. Load unpacked extension from `build/chrome/` in Chrome
3. Test in browser side panel

## Important Notes

- No test suite exists - manual testing required
- No linting configuration - maintain consistent code style
- Extension uses Manifest V3 (Chrome) with Firefox compatibility
- Images in notes use custom protocol: `sidenote-image://[id]`
- All file paths must be absolute when using file operations