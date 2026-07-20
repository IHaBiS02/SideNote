# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project Overview

SideNote is a Chrome/Firefox browser extension that provides a simple note-taking interface in the browser's side panel. It supports Markdown editing with live preview, syntax highlighting, dark/light modes, and import/export functionality.

## Development Commands

All developing command should run on windows environment, as the development environment is on windows 11.

### Build
```bash
npm run build
```
Builds the editor workspace first, then creates Chrome and Firefox packages in
`build/chrome-*.zip` and `build/firefox-*.zip`, plus the Firefox reviewer source
archive at `build/sidenote-*-source.zip`.

### Firefox Release Source
```bash
npm run release:amo
```
Compatibility alias for `npm run build`.

### Clean Build Directory
```bash
npm run clean
```

### Test
```bash
npm test          # vitest watch mode
npm run test:run  # single run
```
Runs the editor tests followed by the extension unit/integration tests using
Vitest, jsdom, and fake-indexeddb.

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
- **src/editor/sidenote-editor-adapter.js**: Connects SideNote storage,
  settings, paste processing, theme CSS, and highlight.js token ranges to the
  reusable editor Web Component
- **packages/wysiwyg-markdown/**: Lit/ProseMirror Web Component source, demo,
  tests, and build configuration managed as an npm workspace
- **build.js**: Packages the compiled editor and extension files for Chrome and
  Firefox

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
- **markdown-renderer.js**: Preview/source mode switching plus hidden legacy
  HTML rendering, sanitization, code decoration, and image loading helpers
- **image-modal.js**: Fullscreen image preview modal with zoom
- **image-manager.js**: Image list UI and management
- **recycle-bin-renderer.js**: Deleted items list rendering
- **index.js**: Re-exports all view functions

### Key Features Implementation
- **WYSIWYG Markdown**: The editor workspace parses Markdown into a
  ProseMirror document and serializes each change back to Markdown
- **Preview/Source Modes**: Preview is editable WYSIWYG; double-click or Edit
  opens the complete document in plain Markdown source mode
- **Legacy HTML Renderer**: Marked and DOMPurify remain for the hidden
  compatibility preview and preview-only helper paths
- **Syntax Highlighting**: The SideNote adapter converts highlight.js output
  into editable ProseMirror decorations; multi-line code uses a non-editable
  line-number gutter
- **Host Styling**: SideNote injects its 4.1.14-compatible theme through
  `themeCss` because document CSS does not cross the editor Shadow DOM
- **Image Handling**: Images pasted/imported are stored as blobs in IndexedDB; blob URLs are tracked and revoked on re-render to prevent memory leaks
- **Recycle Bin**: Soft delete with 30-day auto-cleanup (`THIRTY_DAYS_MS`)

### Test Structure (`tests/`)
```text
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
│   ├── settings.test.js
│   ├── settings-ui.test.js
│   └── utils.test.js
├── database/             # IndexedDB layer tests
│   ├── init.test.js
│   ├── notes.test.js
│   └── images.test.js
└── logic/                # Business logic tests (with mocked DB/views)
    ├── editor-events.test.js
    ├── sidenote-editor-adapter.test.js
    ├── markdown-renderer.test.js
    ├── image-manager.test.js
    ├── import-export.test.js
    ├── import-export-events.test.js
    ├── main.test.js
    └── notes.test.js
```

Editor workspace tests are maintained separately:

```text
packages/wysiwyg-markdown/tests/
├── markdown.test.ts       # parser and serializer behavior
├── element.test.ts        # modes, APIs, events, images, and code UI
├── extensions.test.ts     # commands, shortcuts, and input rules
└── setup.ts
```

### State Management Conventions
- ES module exports are live bindings — in-place mutations (splice, push) are visible to all importers
- Prefer in-place mutation for array state when possible
- Use setter functions (`setNotes`, `setDeletedNotes`) only when replacing the entire array

### Settings Scope Conventions
- `isGlobalSettings` determines whether the settings view is editing global settings or the active note's settings.
- Opening settings from the notes list sets `isGlobalSettings` to `true` and edits `globalSettings`, which is stored in `chrome.storage.local`.
- Opening settings from an individual note sets `isGlobalSettings` to `false` and edits that note's `settings`, which is stored with the note in IndexedDB.
- Note-specific settings should fall back to `globalSettings` when the note does not define a value.
- `codeBlockHeader` controls whether preview code blocks show the language/copy header; it supports both global and note-specific values.
- Markdown preview renders normal newlines as line breaks by default. `legacyLineBreakMode` is global-only and disables Marked `breaks`, re-enabling the old trailing-space line-break workflow.

## Development Workflow

### Version Updates
When making changes:
1. Update version in `manifest.json`
2. Update version in `package.json` to match
3. Run `npm install` to update `package-lock.json`
4. commit changes to git

### Release Workflow
GitHub Actions publishes releases automatically when a `v*` tag is pushed.
After the version bump commit is on `main`:
```bash
git push origin main
git tag v<version>
git push origin v<version>
```
Example:
```bash
git tag v4.1.14
git push origin v4.1.14
```
The tag version must match `package.json`. The release workflow runs tests,
builds Chrome/Firefox ZIP files and the AMO reviewer source ZIP, creates the
GitHub Release, and uploads `build/*.zip` as release assets.

### Documentation Updates
After significant changes, update:
- **STRUCTURE.md**: If architecture/file organization changes
- **Functions.md**: If function signatures or purposes change
- **packages/wysiwyg-markdown/ARCHITECTURE.md**: If editor internals, the host
  boundary, or build flow changes
- **packages/wysiwyg-markdown/README.md** and **README.ko.md**: If the public
  editor API or usage changes

### Git Commit Process
Use the file-based commit method:
```bash
git diff
git log -n 5
# Write commit message to commit_message.txt
git commit -F commit_message.txt
rm commit_message.txt
```
When you commit to git, do not write
```
🤖 Generated with Codex

Co-Authored-By: Codex noreply@anthropic.com
```
on the commit message.

### Testing
After changes:
1. Run `npm run test:run` to verify all tests pass
2. Run `npm run build`
3. Load unpacked extension from `build/chrome/` in Chrome
4. Test in browser side panel

## Important Notes

- Test suite: editor and extension Vitest suites with jsdom + fake-indexeddb
- No linting configuration - maintain consistent code style
- Extension uses Manifest V3 (Chrome) with Firefox compatibility
- Images in notes use markdown format: `![Image](images/[id].png)`
- All file paths must be absolute when using file operations
