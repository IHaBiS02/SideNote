# SideNote Extension Structure

This document outlines the internal structure of the SideNote browser extension, detailing the architecture, file organization, and the role of each major component and function.

## 1. Project Overview

SideNote is a browser extension that provides a note-taking interface within the browser's side panel. Markdown remains the persisted format, while Preview is a WYSIWYG document backed by a Lit/ProseMirror Web Component and can be editable or read-only. Double-clicking Preview or pressing Edit opens the complete note as plain Markdown source. The application also supports syntax highlighting, dark/light modes, image embedding, and data import/export.

## 2. File Structure

-   **`manifest.json`**: The core configuration file for the Chrome extension. It defines permissions, icons, and registers the side panel.
-   **`sidepanel.html`**: The main HTML file that defines the structure of the user interface, including all views (note list, editor, settings, etc.).
-   **`shortcut-setup.html` / `shortcut-setup.css`**: Small first-install window that explains an unassigned activation shortcut and links to the browser's shortcut settings.
-   **`sidenote-controls.css`**: Shared settings-style button skin used by both the main settings view and the shortcut setup window, including matching light/dark hover colors and control geometry.
-   **`src/`**: This directory contains the TypeScript extension runtime, organized as readable ES modules. `tsc` preserves this module layout when emitting JavaScript for browser packages.
    -   `main.ts`: The main entry point. It runs a deterministic `bootstrap()` sequence that initializes the database, loads settings and notes, handles the one-time migration of notes from `chrome.storage` to `IndexedDB`, cleans expired recycle-bin items, renders the initial view, and calls `initializeAllEvents()` to set up all event listeners.
    -   `types.ts`: Shared note, settings, stored-image, and navigation types.
    -   `globals.d.ts`: Declarations for packaged browser/vendor globals.
    -   `database/`: Directory containing modularized IndexedDB operations:
        -   `init.ts`: Database initialization and shared instance management
        -   `notes.ts`: Note-related database operations and CRUD functions
        -   `images.ts`: Image-related database operations and blob management
        -   `index.ts`: Unified entry point for backward compatibility
    -   `editor/`:
        -   `sidenote-editor-adapter.ts`: Connects the reusable `<wysiwyg-markdown>` component to SideNote image storage, paste processing, editor modes, highlight.js syntax token ranges, and the 4.1.14-compatible Preview theme. Preview and source editing share the SideNote-owned `--editor-padding` value.
    -   `dom.ts`: Contains typed DOM element references for all UI elements used throughout the extension.
    -   `notes.ts`: Contains the core logic for managing notes (sorting, deleting, pinning, restoring, etc.).
    -   `notes_view/`: Directory containing modularized UI rendering and view management:
        -   `view-manager.ts`: View switching and navigation management
        -   `note-renderer.ts`: Note list and editor functionality
        -   `editor-mode.ts`: Editable/read-only Preview and full-document source-mode switching
        -   `recycle-bin-renderer.ts`: Recycle bin rendering and management
        -   `image-modal.ts`: Centered image preview with `Ctrl+wheel`/touchpad-pinch zoom, pointer dragging, and fresh-open reset
        -   `image-manager.ts`: Image list, usage, navigation, and deletion management
        -   `index.ts`: Unified entry point for backward compatibility
    -   `events/`: Directory containing modularized event handling:
        -   `navigation.ts`: Navigation, history, and back button functionality
        -   `editor.ts`: Note creation, autosave, mode shortcuts, image activation, and title editing
        -   `settings-events.ts`: Settings-related event listeners
        -   `import-export-events.ts`: Import/export functionality
        -   `global-events.ts`: Global keyboard events and system theme detection
        -   `index.ts`: Unified entry point that exports `initializeAllEvents()` function
    -   `history.ts`: Manages the view navigation history stack, allowing for "back" functionality.
    -   `settings.ts`: Manages global and note-specific settings, including default setting normalization and effective setting resolution.
    -   `import_export.ts`: Contains the logic for parsing `.snote` files, saving parsed imports, and packaging `.snote`/`.snotes` zip archives.
    -   `utils.ts`: Utility functions for timestamps, filename sanitization, file downloads, scoped blob URL tracking, and image ID extraction.
    -   `text-processors.ts`: Legacy text processing utilities for markdown editing, including tilde escaping, auto line breaks, Enter key handling, and whitespace cleanup.
-   **`sidepanel.css`**: The primary stylesheet for the extension's UI. It is
    loaded after `vendor/reset.css` and `sidenote-controls.css`, then explicitly
    defines the heading, semantic margin, form-control font, and line-height
    baseline shared by Chrome and Firefox.
-   **`dark_mode.css`**: A supplementary stylesheet containing CSS variables and rules specifically for the dark mode theme.
-   **`background.ts`**: Cross-browser background source compiled to the packaged `background.js`; it opens Chrome's side panel or Firefox's sidebar from the extension action/command. On initial installation it reads the registered commands and opens the shortcut setup window only when the browser reports the activation command as unassigned.
-   **`tsconfig.extension.json`**: Strict TypeScript configuration that emits readable ES modules and `background.js` into `build/extension-runtime/`.
-   **`src/shortcut-setup.ts`**: Opens Firefox's native extension shortcut settings API or Chrome's `chrome://extensions/shortcuts` page from the setup window.
-   **`packages/wysiwyg-markdown/`**: The reusable Lit/ProseMirror editor npm workspace:
    -   `src/index.ts`: Public exports and idempotent registration of `<wysiwyg-markdown>`.
    -   `src/core/markdown.ts`: ProseMirror schema plus Markdown parser and serializer. It covers headings, emphasis, strikethrough, lists/tasks, soft breaks, fenced code, links, and images. Link serialization uses explicit `[text](destination)` syntax, including when the text and destination are identical.
    -   `src/core/commands.ts`: Standard history, block, and inline-format commands.
    -   `src/element/wysiwyg-markdown.ts`: Form-associated Lit custom element, ProseMirror lifecycle, source modes, node views, events, image hooks, public API, middle-click link navigation, and directly editable code-language controls with selection-safe unfocused labels outside document content.
    -   `src/element/styles.ts`: Minimal component-owned layout and state CSS. Product styling is supplied by the host through `themeCss`.
    -   `src/extensions/registry.ts`: Extension validation, priority ordering, command merging, shortcuts, and input-rule plugins.
    -   `src/extensions/standard.ts`: Built-in Markdown input rules for headings, code blocks, quotes, lists, task items, and horizontal rules.
    -   `src/extensions/types.ts`: Command, shortcut, and input-rule extension contracts.
    -   `demo/`: Standalone browser demo that does not depend on SideNote storage.
    -   `tests/`: Parser/serializer, Web Component, and extension tests.
    -   `MARKDOWN_SYNTAX_TEST.md`: Complete manual test note covering every supported Markdown node and inline mark plus the WYSIWYG interaction checklist.
    -   `WYSIWYG_INPUT_BEHAVIORS.md` and `WYSIWYG_INPUT_BEHAVIORS.ko.md`: English and Korean references for built-in Markdown input rules, keyboard/mouse actions, Preview modes, and paste normalization; both are updated together.
    -   `scripts/generate-third-party-licenses.mjs`: Generates the root `LIBRARY_LICENSES.md` from the complete extension and editor runtime dependency graphs.
-   **`build.js`**: Packages the compiled editor and extension sources for Chrome and Firefox. It reads the editor bundle from `packages/wysiwyg-markdown/dist/`; generated bundles are not checked into Git.
-   **`scripts/create-amo-source-package.mjs`**: Creates the allow-listed, deterministic source ZIP used for Firefox AMO review.
-   **`build/<browser>/vendor/`**: Generated output directory containing runtime third-party browser assets plus the first-party `wysiwyg-markdown.js` bundle. There is no tracked source-level `vendor/` directory.

## 3. HTML Structure (`sidepanel.html`)

The UI is a single-page application with several distinct "views" that are shown or hidden as needed.

-   **`#list-view`**: The main screen.
    -   Displays the list of all notes (`#note-list`).
    -   Contains the "New Note" button (`#new-note-button`).
    -   A toolbar with global actions: Import (`#global-import-button`), Export (`#global-export-button`), and Settings (`#global-settings-button`).
-   **`#editor-view`**: The screen for writing and viewing a single note.
    -   A header with a "Back" button (`#back-button`) and the note's title (`#editor-title`).
    -   `#markdown-editor`: A `<wysiwyg-markdown>` custom element. New notes and normal note opening start in WYSIWYG Preview mode, editable by default or read-only when configured; double-click or the Edit button opens the full document as plain Markdown source. Its public `value` remains a Markdown string.
    -   A toolbar with buttons for toggling the view and note-specific import/export/settings.
-   **`#settings-view`**: The screen for configuring settings.
    -   Can be accessed globally (from list view) or for a specific note (from editor view).
    -   Controls for UI Mode (Light/Dark), Title behavior, Font Size, and independent WYSIWYG, Plain Text, and Code Block Line Spacing (`1.0`–`3.0`). Font size and all three spacing values support global values plus note-specific overrides.
    -   Checkbox for "Prevent deletion of used images".
    -   Legacy controls for adding two trailing spaces to pasted lines and tilde escaping.
    -   Buttons to navigate to Image Management, Recycle Bin, and Licenses pages.
-   **`#license-view`**: Displays the generated `LIBRARY_LICENSES.md`, which contains extension and WYSIWYG editor runtime dependency notices.
-   **`#recycle-bin-view`**: Displays a list of deleted items (`#deleted-items-list`), both notes and images, with options to restore or delete them permanently. Includes an "Empty Recycle Bin" button.
-   **`#image-management-view`**: Displays a list of all images (`#image-list`) with usage information and deletion controls.

## 4. TypeScript Extension Logic

### Core Concepts & State Management

-   **State Variables**:
    -   `notes`: An array of note objects. Each object contains an `id`, `title`, `content`, `settings`, and `metadata` (timestamps).
    -   `deletedNotes`: An array of note objects that have been moved to the recycle bin.
    -   `activeNoteId`: Stores the `id` of the note currently being edited.
    -   `globalSettings`: An object holding all global application settings, including WYSIWYG `lineHeight` (default `1.5`), `sourceLineHeight` and `codeLineHeight` (default `1.2`), and `wysiwygPreview` (default `true`) for editable versus read-only Preview.
    -   `isPreview`: A boolean flag to track if the editor is in "Preview" or "Edit" mode.
    -   Navigation history is managed through the `history.ts` module.
-   **Data Persistence**:
    -   Notes and images are stored in `IndexedDB`.
    -   `chrome.storage.local` stores `globalSettings` and is also used for the one-time migration of old note data.
    -   Startup runs through `bootstrap()` so storage load, migration, cleanup, rendering, and event binding happen in a predictable order.

### Function Breakdown

#### Initialization & Data Management (`main.ts`, `src/database/`)

-   **`bootstrap()`**: Runs the startup sequence in order: IndexedDB initialization, settings/note load and migration, recycle-bin cleanup, initial UI render, and event binding.
-   **`initDB()`**: Initializes the IndexedDB database and creates the `images` and `notes` object stores (located in `src/database/init.ts`).
-   **`loadAndMigrateData()`**: On startup, this function loads all data from `IndexedDB`. It also handles the one-time migration of notes from `chrome.storage.local` to `IndexedDB`.
-   **`saveNote()` / `getAllNotes()` / `deleteNoteDB()` / etc.**: A set of async functions in `src/database/notes.ts` to perform CRUD operations on note data in IndexedDB.
-   **`saveImage()` / `getImage()` / `deleteImage()` / etc.**: A set of async functions in `src/database/images.ts` to perform CRUD operations on image data in IndexedDB.
-   **`sortNotes()`**: Sorts the `notes` array based on pin status and the `lastModified` timestamp.
-   **`cleanupDeletedNotes()` / `cleanupDeletedImages()`**: Automatically and permanently deletes items from the recycle bin that are older than 30 days.
    -   Note operations mutate state and persist through the database layer. UI refreshes are handled by the event or view caller rather than by `src/notes.ts`.

#### View Management (`src/notes_view/`, `history.ts`, `src/events/`)

-   **`showListView()` / `showEditorView()` / `showSettingsView()` / etc.**: A set of functions in `src/notes_view/view-manager.ts` that control UI visibility. They now accept an `addToHistory` parameter and will call `pushToHistory` to record the navigation change.
-   **`pushToHistory()` / `popFromHistory()` / etc.**: Functions in `history.ts` for managing the `navigationHistory` stack.
-   **`goBack()`**: A function in `src/events/navigation.ts` that is triggered by back buttons or the Escape key. It uses the `navigationHistory` to return the user to the previously visited view.
-   **`backButton` (Context Menu)**: Right-clicking the back button opens a custom dropdown menu displaying the navigation history, allowing the user to jump to a specific previous view.
-   **`navigateToState(state)`**: Navigates to a specific view state based on the provided state object.
-   **History Dropdown Management**: Functions in `src/events/navigation.ts` to show, populate, and refresh the navigation history dropdown.

#### Note List (`src/notes_view/`, `src/events/`)

-   **`renderNoteList()`**: Populates the `#note-list` with items from the `notes` array (located in `src/notes_view/note-renderer.ts`).
-   **`newNoteButton` (Event Listener)**: Creates a new, empty note object and opens it (handled in `src/events/editor.ts`).
-   **`deleteNote(noteId)`**: Moves a note to the recycle bin by adding a `deletedAt` timestamp.
-   **`togglePin(noteId)`**: Toggles the pin status of a note.
-   **`emptyRecycleBin()`**: Empties the recycle bin after two-step confirmation (handled in `src/events/settings-events.ts`).

#### Editor (`src/notes_view/`, `src/events/`)

-   **`openNote(noteId, inEditMode, addToHistory)`**: Sets the `activeNoteId` and populates the editor with the note's content. It now also records the action in the navigation history (located in `src/notes_view/note-renderer.ts`).
-   **`markdownEditor` (Event Listeners)** (handled in `src/events/editor.ts`):
    -   `input`: Updates the note content and metadata on every keystroke.
    -   WYSIWYG paste hooks save images to IndexedDB and apply enabled legacy text formatting through `src/editor/sidenote-editor-adapter.ts`.
    -   `keydown`: WYSIWYG `Enter` continues bullet and ordered lists with the next item, `Tab`/`Shift+Tab` changes the current list-item nesting level, and `Shift+Enter` inserts a single inline soft break inside the current list item or block; the full-document source editor retains `Shift+Enter` preview switching.
    -   `image-activate`: Opens the SideNote image modal using the display URL supplied by the component.
    -   Custom title editing: `Enter` or `Escape` commits the title input; `Escape` is consumed before global back navigation so the note stays open.
-   **`applyEditorDisplayMode()` / `togglePreview()`**: Uses the same custom element for editable WYSIWYG and read-only Preview, selected by the global `wysiwygPreview` setting, and switches Edit to full-document Markdown source mode (located in `src/notes_view/editor-mode.ts`).
-   **Image integration**: The component resolves stored images through the adapter, emits `image-activate` for modal opening, and exposes `scrollToImage()` so image management can navigate without reaching into the component Shadow DOM. The modal initially fits and centers each image, uses `Ctrl+wheel` or touchpad pinch for pointer-anchored zoom, supports hold-drag panning, and resets when reopened.

#### Settings & Recycle Bin (`settings.ts`, `src/notes_view/`, `src/events/`)

-   **Settings Listeners**: Update `globalSettings` or note-specific settings (handled in `src/events/settings-events.ts`).
-   **Line-height applicators**: `applyLineHeight()`, `applySourceLineHeight()`, and `applyCodeLineHeight()` update the WYSIWYG, plain-text source, and fenced-code CSS variables independently. `applyLineHeightSettings()` applies the effective trio when a note opens or SideNote starts.
-   **`applyMode(mode)`**: Toggles the `dark-mode` class on the `<body>`.
-   **`renderDeletedItemsList()`**: Fetches all deleted notes and images from `IndexedDB`. It combines them into a single array, sorts them by deletion date, and renders them in the `#deleted-items-list`. Each item has controls to be restored or permanently deleted (located in `src/notes_view/recycle-bin-renderer.ts`).
-   **`renderImagesList()`**: Renders the list of images in the image management view, showing usage information and delete controls (located in `src/notes_view/image-manager.ts`). Usage detection is based on exact Markdown image references extracted from note content.
-   **`restoreNote(noteId)` / `restoreImage(id)`**: Moves an item from the recycle bin back to the active state.
-   **`deleteNotePermanently(noteId)` / `deleteImagePermanently(id)`**: Removes an item permanently from storage.

#### Import & Export (`import_export.ts`, `src/events/`)

-   **Export Buttons**: Left-click packages one or all notes into a `.snote` or `.snotes` zip file. Right-click opens an export format dropdown with `.zip` above `.snote`/`.snotes`. Right-clicking the `.zip` option inserts original Markdown and Markdown with two-space line breaks options above the `.zip` row. All-notes `.zip` exports use sanitized note titles as folder names, while `.snotes` keeps note IDs for compatibility. Shared helpers in `src/import_export.ts` write note content (`note.md`), metadata (`metadata.json`), and any associated images from IndexedDB.
-   **Import Buttons**: Unzip a `.snote` or `.snotes` file and parse metadata/content/images without saving first. Event handlers then choose whether to create new notes or update the active note.

## 5. Packaged Runtime Assets (`build/<browser>/vendor/`)

`build.js` copies the exact locked browser assets below into each extension
package. Most are third-party libraries from `node_modules`; the editor bundle
is first-party generated code and is listed separately.

-   **`marked.min.js`**: Renders the bundled generated license Markdown in the license view.
-   **`dompurify.min.js`**: Sanitizes the HTML generated for the license view.
-   **`highlight.min.js`**: A syntax highlighter that can parse and style code blocks in many different languages.
-   **`jszip.min.js`**: A library for creating, reading, and editing `.zip` files, used for the import/export functionality.
-   **`browser-polyfill.min.js`**: WebExtension browser API Polyfill for cross-browser compatibility.
-   **`reset.css`**: Removes browser UA styling differences before SideNote's explicit baseline is applied.

### First-party generated asset

-   **`wysiwyg-markdown.js`**: Self-contained Lit/ProseMirror Web Component bundle generated from `packages/wysiwyg-markdown/src/`. Code tokens use the local highlight.js runtime and Atom One color variables without replacing editable DOM. Multi-line code uses a separate non-editable gutter whose line boxes and spacing mirror the editable code body and the 4.1.14 layout; single-line code hides it so copied and saved code remains clean.

The root `npm run build` command first regenerates the combined extension/editor
dependency notices and builds the editor workspace. It then compiles
`background.ts` and `src/**/*.ts` into readable JavaScript under
`build/extension-runtime/`, copies that runtime, the editor bundle, and
`LIBRARY_LICENSES.md` into the Chrome and Firefox outputs, and creates the
allow-listed AMO reviewer source ZIP. The repository therefore has one lockfile,
one build command, and no manual synchronization step.
