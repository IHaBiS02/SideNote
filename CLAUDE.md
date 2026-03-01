# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SideNote is a Chrome/Firefox browser extension that provides a simple note-taking interface in the browser's side panel. It supports Markdown editing with live preview, syntax highlighting, dark/light modes, and import/export functionality.

## Development Commands

All developing command should run on windows environment, as the development environment is on windows 11.

### Build
```bash
npm run build
```
Creates Chrome and Firefox builds in `build/chrome-*.zip` and `build/firefox-*.zip`.

### Clean Build Directory
```bash
npm run clean
```

### Test
```bash
npm test          # vitest watch mode
npm run test:run  # single run
```
128 unit/integration tests using vitest + jsdom + fake-indexeddb.

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
- **src/main.js**: Entry point and application initialization (ES6 module)
- **src/state.js**: Centralized state management for shared variables
- **src/constants.js**: Shared constants (`THIRTY_DAYS_MS`, etc.)
- **src/dom.js**: DOM element references and selections
- **src/utils.js**: Utility functions (timestamps, file handling, blob URL tracking)
- **src/ui-helpers.js**: Shared UI utilities (`createDropdown`)
- **src/settings.js**: Global settings management, theme, and `populateSettingsForm`
- **src/notes.js**: Note data operations (CRUD, sorting, pin/unpin)
- **src/history.js**: Navigation history management
- **src/text-processors.js**: Text processing (tilde escaping, line breaks, checkbox toggle)
- **src/import_export.js**: .snote/.snotes file processing

### Database Module (`src/database/`)
- **init.js**: IndexedDB initialization, `dbTransaction()` helper, `closeDB()`
- **notes.js**: Note CRUD operations using `dbTransaction`
- **images.js**: Image CRUD operations using `dbTransaction`
- **index.js**: Re-exports all database functions

### Events Module (`src/events/`)
- **editor.js**: Editor input, paste, keyboard shortcuts, checkbox clicks
- **navigation.js**: Back navigation, `saveCurrentEditorIfChanged()`, history dropdown
- **settings-events.js**: Settings UI event handlers
- **import-export-events.js**: Import/export button handlers
- **global-events.js**: Escape key, theme change, dropdown closing
- **index.js**: Initializes all event listeners

### Notes View Module (`src/notes_view/`)
- **view-manager.js**: View visibility management (list, editor, settings, etc.)
- **note-renderer.js**: Note list rendering and note opening
- **markdown-renderer.js**: Markdown parsing, HTML rendering, image loading
- **image-modal.js**: Fullscreen image preview modal with zoom
- **image-manager.js**: Image list UI and management
- **recycle-bin-renderer.js**: Deleted items list rendering
- **index.js**: Re-exports all view functions

### Key Features Implementation
- **Markdown Rendering**: Uses `marked.js` with `DOMPurify` sanitization
- **Syntax Highlighting**: `highlight.js` with line numbers plugin
- **Image Handling**: Images pasted/imported are stored as blobs in IndexedDB; blob URLs are tracked and revoked on re-render to prevent memory leaks
- **Recycle Bin**: Soft delete with 30-day auto-cleanup (`THIRTY_DAYS_MS`)

### Test Structure (`tests/`)
```
tests/
├── setup.js              # Global setup (fake-indexeddb, browser API mock)
├── mocks/
│   └── browser-api.js    # chrome.storage.local mock
├── fixtures/
│   └── notes.js          # Sample note/image data factories
├── unit/                 # Pure function tests
│   ├── text-processors.test.js
│   ├── history.test.js
│   ├── state.test.js
│   └── utils.test.js
├── database/             # IndexedDB layer tests
│   ├── init.test.js
│   ├── notes.test.js
│   └── images.test.js
└── logic/                # Business logic tests (with mocked DB/views)
    ├── notes.test.js
    └── import-export.test.js
```

### State Management Conventions
- ES module exports are live bindings — in-place mutations (splice, push) are visible to all importers
- Prefer in-place mutation for array state when possible
- Use setter functions (`setNotes`, `setDeletedNotes`) only when replacing the entire array

## Development Workflow

### Version Updates
When making changes:
1. Update version in `manifest.json`
2. Update version in `package.json` to match
3. Run `npm install` to update `package-lock.json`
4. commit changes to git

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
rm commit_message.txt
```
When you commit to git, do not write
```
🤖 Generated with Claude Code

Co-Authored-By: Claude noreply@anthropic.com
```
on the commit message.

### Testing
After changes:
1. Run `npm run test:run` to verify all tests pass
2. Run `npm run build`
3. Load unpacked extension from `build/chrome/` in Chrome
4. Test in browser side panel

## Important Notes

- Test suite: vitest with jsdom + fake-indexeddb (128 tests)
- No linting configuration - maintain consistent code style
- Extension uses Manifest V3 (Chrome) with Firefox compatibility
- Images in notes use markdown format: `![Image](images/[id].png)`
- All file paths must be absolute when using file operations