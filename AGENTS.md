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
Builds the editor workspace and TypeScript extension runtime, then creates Chrome and Firefox packages in
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

### Type Check
```bash
npm run typecheck
```
Checks both the SideNote extension runtime and the editor workspace.

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
- **src/main.ts**: Entry point and application initialization (TypeScript ES module)
- **src/types.ts**: Shared note, settings, image, and navigation types
- **src/globals.d.ts**: Types for packaged browser globals and reviewer-safe vendor scripts
- **src/state.ts**: Centralized state management for shared variables
- **src/constants.ts**: Shared constants (`THIRTY_DAYS_MS`, etc.)
- **src/dom.ts**: Typed DOM element references and selections
- **src/utils.ts**: Utility functions (timestamps, file handling, blob URL tracking)
- **src/ui-helpers.ts**: Shared UI utilities (`createDropdown`)
- **src/settings.ts**: Global settings management, theme, and `populateSettingsForm`
- **src/notes.ts**: Note data operations (CRUD, sorting, pin/unpin, persistent pinned ordering)
- **src/history.ts**: Navigation history management
- **src/text-processors.ts**: Plain-text paste processing (tilde escaping and
  optional legacy two-space line breaks)
- **src/import_export.ts**: .snote/.snotes file processing
- **src/shortcut-setup.ts**: Opens the browser's extension shortcut settings
  from the first-install setup popup
- **sidenote-controls.css**: Shared settings-style button appearance for the
  side panel and shortcut setup popup
- **src/editor/sidenote-editor-adapter.ts**: Connects SideNote storage,
  settings, paste processing, theme CSS, and highlight.js token ranges to the
  reusable editor Web Component
- **packages/wysiwyg-markdown/**: Lit/ProseMirror Web Component source, demo,
  tests, and build configuration managed as an npm workspace
- **build.js**: Packages the compiled editor and extension files for Chrome and
  Firefox
- **tsconfig.extension.json**: Compiles readable extension ES modules to
  `build/extension-runtime/` before packaging

### Database Module (`src/database/`)
- **init.ts**: IndexedDB initialization, typed `dbTransaction()` helper, `closeDB()`
- **notes.ts**: Note CRUD operations using `dbTransaction`
- **images.ts**: Image CRUD operations using `dbTransaction`
- **index.ts**: Re-exports all database functions

### Events Module (`src/events/`)
- **editor.ts**: Editor autosave, mode shortcuts, image activation, and title editing
- **navigation.ts**: Back navigation, `saveCurrentEditorIfChanged()`, history dropdown
- **settings-events.ts**: Settings UI event handlers
- **import-export-events.ts**: Import/export button handlers
- **global-events.ts**: Escape key, theme change, dropdown closing
- **index.ts**: Initializes all event listeners

### Notes View Module (`src/notes_view/`)
- **view-manager.ts**: View visibility management (list, editor, settings, etc.)
- **note-renderer.ts**: Note list rendering and note opening
- **pinned-note-drag.ts**: Long-press pointer reordering for pinned note rows
- **editor-mode.ts**: Switches the shared editor between editable/read-only
  Preview and full-document Markdown source modes
- **image-modal.ts**: Centered fullscreen image preview with
  `Ctrl+wheel`/touchpad-pinch zoom, pointer dragging, and fresh-open reset
- **image-manager.ts**: Image list UI and management
- **recycle-bin-renderer.ts**: Deleted items list rendering
- **index.ts**: Re-exports all view functions

### Key Features Implementation
- **WYSIWYG Markdown**: The editor workspace parses Markdown into a
  ProseMirror document and serializes each change back to Markdown
- **Preview/Source Modes**: Preview uses the same WYSIWYG renderer in editable
  or read-only mode according to settings; double-click or Edit opens the
  complete document in plain Markdown source mode
- **License Rendering**: Marked and DOMPurify are limited to rendering the
  bundled third-party license document; note Preview has one renderer
- **Syntax Highlighting**: The SideNote adapter converts highlight.js output
  into editable ProseMirror decorations; multi-line code uses a non-editable
  line-number gutter
- **Host Styling**: SideNote injects its 4.1.14-compatible theme through
  `themeCss` because document CSS does not cross the editor Shadow DOM
- **Image Handling**: Images pasted/imported are stored as blobs in IndexedDB; blob URLs are tracked and revoked on re-render to prevent memory leaks
- **Pinned Note Ordering**: Pinned rows use delayed Pointer Events for drag
  ordering and persist normalized `pinOrder` values to IndexedDB
- **Recycle Bin**: Soft delete with 30-day auto-cleanup (`THIRTY_DAYS_MS`)
- **Shortcut Setup**: `background.ts` checks the activation command only on a
  fresh install and opens `shortcut-setup.html` when the browser reports no
  assigned shortcut

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
    ├── background.test.js
    ├── editor-events.test.js
    ├── sidenote-editor-adapter.test.js
    ├── editor-mode.test.js
    ├── image-modal.test.js
    ├── image-manager.test.js
    ├── import-export.test.js
    ├── import-export-events.test.js
    ├── main.test.js
    ├── notes.test.js
    ├── pinned-note-drag.test.js
    └── shortcut-setup.test.js
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
- Markdown Preview renders normal newlines as soft breaks. `legacyLineBreakMode`
  is global-only and re-enables older paste/export transformations that use
  two trailing spaces for Markdown line breaks.

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
Documentation is part of every feature change. Inspect the repository's
Markdown files and update every document affected by behavior, architecture,
public API, build, packaging, testing, or release workflow changes. Do not
limit documentation review to the files listed below, and do not modify
unrelated documents merely for churn.

When WYSIWYG behavior changes (including input rules, shortcuts, mouse actions,
paste normalization, Preview modes, or code-block interactions), update both
of these files in the same change and keep their content semantically aligned:

- **packages/wysiwyg-markdown/WYSIWYG_INPUT_BEHAVIORS.md**: English behavior reference
- **packages/wysiwyg-markdown/WYSIWYG_INPUT_BEHAVIORS.ko.md**: Korean behavior reference

Also update the following whenever applicable:

- **STRUCTURE.md**: If architecture/file organization changes
- **Functions.md**: If function signatures or purposes change
- **packages/wysiwyg-markdown/ARCHITECTURE.md**: If editor internals, the host
  boundary, or build flow changes
- **packages/wysiwyg-markdown/README.md** and **README.ko.md**: If the public
  editor API or usage changes
- **README.md**, **RELEASE.md**, and other topical Markdown documents: If their
  feature, development, build, packaging, submission, or release instructions
  are affected

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
- The packaged side panel loads `vendor/reset.css`, then the shared
  `sidenote-controls.css`, followed by `sidepanel.css`; the latter explicitly
  restores the intended heading sizes/weights, semantic margins, form fonts,
  and line heights. Do not rely on browser UA typography defaults.
- All file paths must be absolute when using file operations
