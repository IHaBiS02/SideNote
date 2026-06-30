# SideNote Codebase Overview and Refactoring Notes

This document summarizes the current code structure and records practical refactoring candidates based on the repository state at review time.

## Summary

SideNote is a Chrome/Firefox browser extension that runs a single-page note app inside the browser side panel. The UI is declared in `sidepanel.html`, third-party libraries are loaded as global scripts, and application logic is organized as ES modules under `src/`.

The current architecture is workable and already split into sensible folders: database access, state, event handlers, view rendering, settings, note operations, text processors, and import/export. The first refactoring pass has reduced some of the highest-risk coupling points: startup is deterministic, `.snote` parsing is separated from saving, note business logic no longer renders views directly, image usage detection is exact, export packaging is shared, Markdown rendering is split into smaller helpers, and blob URL tracking is scoped per view.

## Runtime Flow

1. `background.js` loads `vendor/browser-polyfill.min.js` and configures the extension action to open the side panel.
2. `sidepanel.html` loads CSS, vendor scripts, and `src/main.js` as a module.
3. `src/main.js` initializes IndexedDB, loads global settings from `browser.storage.local`, migrates old notes from `browser.storage.local` into IndexedDB, loads notes, sorts them, renders the list, applies theme/font settings, cleans old deleted notes/images, and initializes all event listeners.
4. User actions are handled by modules in `src/events/`.
5. Event handlers call note/database/settings/view functions, which update the in-memory state, persist changes, and re-render affected views.

`main.js` now runs startup through `bootstrap()`, so initial rendering and event initialization happen after the database, settings, migration, and cleanup steps complete.

## Data Model

### Note

Notes are stored in the IndexedDB `notes` object store.

Expected shape:

```js
{
  id: string,
  title: string,
  content: string,
  settings: {
    title?: 'default' | 'custom',
    fontSize?: number,
    codeBlockHeader?: boolean
  },
  metadata: {
    createdAt: number,
    lastModified: number,
    deletedAt?: number
  },
  isPinned: boolean,
  pinnedAt?: number
}
```

An active note has no `metadata.deletedAt`. A deleted note remains in the same object store with `metadata.deletedAt` set and is shown in the recycle bin.

### Image

Images are stored in the IndexedDB `images` object store.

Expected shape:

```js
{
  id: string,
  blob: Blob,
  deletedAt: number | null
}
```

Notes reference embedded images with Markdown paths like:

```md
![Image](images/[id].png)
```

### Global Settings

Global settings live in `browser.storage.local` under `globalSettings`. Note-specific settings override a subset of global settings, while other settings are always global.

Important settings:

- `title`: whether note titles come from the first line or a custom title.
- `fontSize`: editor/preview font size.
- `legacyLineBreakMode`: disables default soft line break rendering and restores the old trailing-space Markdown workflow.
- `autoLineBreak`: legacy option to add Markdown line break spaces on paste and Enter.
- `tildeReplacement`: independent option to escape `~` on paste.
- `codeBlockHeader`: show language/copy header above code blocks.
- `preventUsedImageDeletion`: prevent deleting images referenced by notes.
- `mode`: `system`, `light`, or `dark`.

## Module Map

### Root Files

- `manifest.json`: Chrome Manifest V3 extension metadata, permissions, side panel registration, icons, and command shortcut.
- `sidepanel.html`: single-page UI shell. Contains all app views: note list, editor, settings, licenses, recycle bin, and image management.
- `background.js`: extension service worker/sidebar bootstrap. Opens the side panel for Chrome and toggles sidebar behavior for Firefox.
- `build.js`: builds Chrome and Firefox output folders, copies source/assets/vendor files, creates browser-specific manifests, and generates zip files.
- `sidepanel.css` and `dark_mode.css`: base and dark-mode styling.
- `tests/`: Vitest test suite using jsdom and fake-indexeddb.

### Core Modules

- `src/main.js`: application bootstrap, settings load, old storage migration, note load, cleanup, initial render, and event initialization.
- `src/state.js`: shared live ES module state: `notes`, `deletedNotes`, `globalSettings`, `activeNoteId`, `originalNoteContent`, `isPreview`, and related setters.
- `src/constants.js`: shared constants such as `THIRTY_DAYS_MS`.
- `src/dom.js`: central DOM element lookup/export module.
- `src/utils.js`: timestamp generation, filename sanitization, file download, image ID extraction, and both default/scoped blob URL tracking.
- `src/ui-helpers.js`: shared dropdown creation/closing helper.
- `src/text-processors.js`: pure text editing helpers for legacy paste processing, Markdown line breaks, Enter handling, cursor analysis, and checkbox toggling.

### Database Modules

- `src/database/init.js`: IndexedDB open/close and `dbTransaction()` helper.
- `src/database/notes.js`: note CRUD, soft delete, restore, and permanent delete.
- `src/database/images.js`: image save/read, soft delete, restore, permanent delete, and full image listing.
- `src/database/index.js`: re-export entry point.

This layer is relatively simple and already a good candidate to keep stable during larger refactors.

### Note and Settings Modules

- `src/notes.js`: sorting, soft delete, pin/unpin, restore, permanent delete, and empty recycle bin.
- `src/settings.js`: global settings defaults, effective setting resolution, persistence, theme/font application, toolbar button state, code block header resolution, and settings form population.
- `src/import_export.js`: `.snote` parsing, parsed import saving, imported-note timestamp normalization, and `.snote`/`.snotes` archive packaging helpers.

`src/notes.js` now stays closer to business logic: it mutates note state and persists through the database layer, while event/view callers refresh affected UI.

### Events Modules

- `src/events/index.js`: initializes all event modules.
- `src/events/editor.js`: new note creation, editor autosave, image/text paste, preview toggle, keyboard shortcuts, checkbox clicks, image modal opening, and title editing.
- `src/events/navigation.js`: back navigation, history dropdown, save-before-navigation behavior, and state-based view restoration.
- `src/events/settings-events.js`: global/note settings changes, license loading, recycle bin/image management navigation, and empty recycle bin confirmation.
- `src/events/import-export-events.js`: all-notes export, single-note export, global import, and import-into-current-note behavior.
- `src/events/global-events.js`: Escape key handling, system theme updates, and dropdown closing in image management.

The event modules are the highest-churn area because they coordinate DOM, state, persistence, and rendering directly.

### View Modules

- `src/notes_view/view-manager.js`: shows/hides app views and pushes navigation history.
- `src/notes_view/note-renderer.js`: renders note list items and opens notes in the editor.
- `src/notes_view/markdown-renderer.js`: configures Marked, converts Markdown to sanitized HTML, decorates code blocks, loads embedded images from IndexedDB with preview-scoped blob URLs, and toggles preview/edit mode.
- `src/notes_view/image-modal.js`: fullscreen image preview with zoom states.
- `src/notes_view/image-manager.js`: image management list, image usage dropdowns, copy Markdown action, image deletion, and note opening from image usage.
- `src/notes_view/recycle-bin-renderer.js`: combined deleted notes/images list with restore and permanent delete actions.
- `src/notes_view/index.js`: re-export entry point.

Several view modules do more than rendering. They also perform DB calls, mutate state, attach event handlers, and navigate between screens.

## Current Test Shape

The strongest coverage is around:

- pure text processing in `tests/unit/text-processors.test.js`;
- history stack behavior in `tests/unit/history.test.js`;
- state setters and utility helpers;
- IndexedDB note/image operations;
- selected business logic in `tests/logic/notes.test.js`;
- Markdown code block header behavior;
- `.snote` parsing and imported-note ordering.

The test suite now includes coverage for deterministic bootstrap order, import-into-current-note behavior, exact image usage detection, settings fallback, scoped blob URL tracking, import parsing/saving, export archive helpers, and the existing database/text/history/Markdown logic. Remaining gaps are broader browser-side interaction tests and end-to-end extension checks.

## Completed Refactoring Pass

- `src/main.js`: startup now runs through exported `bootstrap()` helpers and no longer performs initial rendering before async data load completes.
- `src/import_export.js`: `.snote` parsing, parsed image saving, note creation, note saving, and zip packaging are separate helpers.
- `src/events/import-export-events.js`: current-note import now parses and saves images, then updates the active note without creating an extra note.
- `src/notes.js`: note operations no longer import view renderers; UI refreshes moved to callers.
- `src/notes_view/image-manager.js`: image usage detection now uses `extractImageIds()` instead of broad string matching.
- `src/settings.js`: added `DEFAULT_SETTINGS`, `normalizeGlobalSettings()`, and `resolveEffectiveSettings()`.
- `src/notes_view/markdown-renderer.js`: split Markdown rendering into configuration, sanitized HTML rendering, and code block decoration helpers.
- `src/utils.js`: added `createBlobUrlTracker()` for scoped blob URL ownership.

## Refactoring Recommendations

### 1. Make Bootstrap Deterministic

Target: `src/main.js`

Create a single `async bootstrap()` function that awaits each initialization step in order:

1. `initDB()`
2. load settings and apply defaults
3. migrate old storage data
4. load notes/images cleanup data
5. update in-memory state
6. render initial UI
7. initialize event listeners

Status: completed. Startup now runs through `bootstrap()`.

### 2. Centralize Default and Effective Settings

Targets: `src/main.js`, `src/settings.js`, `src/events/editor.js`, `src/notes_view/note-renderer.js`, `src/notes_view/markdown-renderer.js`

Create a `DEFAULT_SETTINGS` constant and a small resolver such as:

```js
resolveEffectiveSettings(note)
```

Status: completed for the current settings surface. Fallback now flows through `normalizeGlobalSettings()` and `resolveEffectiveSettings()`.

### 3. Split Parsing From Saving in Import/Export

Targets: `src/import_export.js`, `src/events/import-export-events.js`

Previously, `processSnote(zip)` parsed a note and saved it to IndexedDB in one step. That made two workflows awkward:

- importing a new note;
- importing content into the currently active note.

The import-into-current-note flow should parse the archive and update the active note without creating a separate saved note. A cleaner split would be:

- `parseSnote(zip)`: returns note data and images without DB side effects;
- `saveParsedSnote(parsed)`: saves a new note and images;
- event handlers choose whether to create a new note or update the active note.

Status: completed. `processSnote()` remains as a backward-compatible parse-and-save wrapper.

### 4. Break the Business Logic and View Rendering Cycle

Targets: `src/notes.js`, `src/notes_view/note-renderer.js`, `src/notes_view/recycle-bin-renderer.js`

Previously, `src/notes.js` imported render functions from `src/notes_view/index.js`, while view modules imported functions from `src/notes.js`.

Move UI rendering calls out of `notes.js`. A better shape:

- `notes.js` or `notes-service.js`: state plus database mutations only;
- event handlers: call the service, then decide which views to re-render;
- view modules: render only from current state and attach UI interactions.

Status: completed for `src/notes.js`. Event/view callers now refresh UI explicitly.

### 5. Extract Export Packaging Helpers

Targets: `src/events/import-export-events.js`, `src/import_export.js`

The global export and single-note export paths duplicate ZIP metadata/image packaging. Extract helpers such as:

- `addNoteToZip(zipOrFolder, note)`
- `collectNoteImages(note)`
- `createSingleNoteArchive(note)`
- `createAllNotesArchive(notes)`

Status: completed. Export paths now use shared archive helpers.

### 6. Use Exact Image Reference Detection

Targets: `src/notes_view/image-manager.js`, `src/utils.js`

Image management previously used broad string matching with `content.includes(imageId)`. It now uses `extractImageIds(note.content)` and exact ID matching.

Status: completed. Exact matching avoids false positives when an image ID appears in unrelated text or as part of another ID.

### 7. Reduce Event Handler Size

Targets: `src/events/editor.js`, `src/events/settings-events.js`, `src/events/import-export-events.js`

Several event initializer modules contain large inline handlers. Extract named workflow functions while keeping event binding in the initializer:

- `createNewNote()`
- `saveEditorInput()`
- `handleEditorPaste()`
- `updateNoteTitleMode()`
- `exportCurrentNote()`
- `importIntoCurrentNote()`

Why: this improves testability without changing the UI architecture.

### 8. Clarify Blob URL Ownership

Targets: `src/utils.js`, `src/notes_view/markdown-renderer.js`, `src/notes_view/image-manager.js`, `src/notes_view/recycle-bin-renderer.js`

All image views share a single global tracked blob URL set. Rendering one image view can revoke URLs used by another view. In practice views are mostly exclusive, but the ownership model is implicit.

Implemented design is scoped blob URL tracking per view:

- preview renderer owns preview blob URLs;
- image management owns its list blob URLs;
- recycle bin owns its list blob URLs;
- modal owns its image URL only if it created it.

Status: completed for preview, image management, and recycle bin renderers.

### 9. Keep Markdown Rendering Pure Where Possible

Target: `src/notes_view/markdown-renderer.js`

`renderMarkdown()` currently configures Marked, sanitizes HTML, mutates the DOM, wraps code blocks, runs highlight.js, adds line numbers, and starts async image loading.

Possible split:

- `configureMarkdownRenderer()`
- `renderMarkdownToHtml(markdown)`
- `decorateCodeBlocks(container, note)`
- `loadInternalImages(container)`

Status: partially completed. Markdown HTML generation and code block decoration are now separate helpers; broader renderer tests can still be expanded.

### 10. Modernize Build Script Internals

Target: `build.js`

The build script works, but it shells out to `mkdirp` and repeats version parsing. It can use Node's built-in `fs.mkdirSync(path, { recursive: true })` and keep version calculation in one place.

Why: this is low priority, but it reduces shell dependence and simplifies Windows behavior.

## Suggested Refactoring Order

1. Continue splitting large event handlers into named workflow functions.
2. Add broader browser-side interaction tests for navigation, side panel behavior, and image modal flows.
3. Clean up the build script internals if build maintenance becomes painful.

The highest-risk refactoring items from the initial review are now complete. The remaining work is lower urgency and should be done opportunistically with related feature changes.

## Things I Would Not Refactor First

- Do not replace the current ES module architecture with a framework. The app is small enough that a framework would add more weight than value.
- Do not rewrite the IndexedDB layer first. It is simple, tested, and not the main source of complexity.
- Do not reorganize files only for aesthetics. The current folders are understandable; the main issue is mixed responsibilities inside modules.

## Documentation Notes

- Existing `STRUCTURE.md` and `Functions.md` still provide useful broad documentation. This document is intended to supplement them with current refactoring guidance and a more candid responsibility map.
