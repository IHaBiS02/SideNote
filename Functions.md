# Functions

This file documents the functions used in the SideNote extension (ES6 modules).

## Build workspace

- `npm run build`: Cleans prior output, builds the WYSIWYG editor workspace,
  packages Chrome and Firefox extensions, and creates the AMO reviewer source
  ZIP.
- `npm run build:editor`: Generates the combined extension/editor runtime
  dependency notices, compiles the TypeScript Web Component with Vite, and
  emits declaration files.
- `npm run build:extension`: Runs `build.js`, which copies extension sources,
  locked third-party browser assets, and the compiled editor bundle into each
  browser package.
- `npm run package:amo-source`: Creates an allow-listed, deterministic source
  ZIP with reviewer instructions.
- `npm run release:amo`: Compatibility alias for `npm run build`.

## packages/wysiwyg-markdown

The reusable editor is an internal npm workspace. Markdown strings are its
public data format; ProseMirror documents remain an implementation detail.

`packages/wysiwyg-markdown/scripts/generate-third-party-licenses.mjs` walks
the root extension and editor workspace runtime dependency graphs, deduplicates
packages by name and version, reads their declared license and license text,
and deterministically regenerates the root `LIBRARY_LICENSES.md` file.

### src/index.ts

- Registers `<wysiwyg-markdown>` only when the tag is not already defined.
- Exports `WysiwygMarkdownElement`, editor hook/event types,
  `parseMarkdown()`, `serializeMarkdown()`, and `markdownSchema`.
- Exports the command and extension TypeScript contracts used by hosts.

### src/core/markdown.ts

- `markdownSchema`: ProseMirror schema used by every editor instance. It
  extends CommonMark with task-list state, strikethrough, soft breaks, fenced
  code language metadata, and image metadata.
- `parseMarkdown(markdown)`: Parses a Markdown string into a ProseMirror
  document using markdown-it and `prosemirror-markdown` token handlers.
- `serializeMarkdown(document)`: Serializes the editor document back to stable
  Markdown for SideNote persistence.

### src/core/commands.ts

- `EditorCommand(context)`: Command contract receiving the current state,
  optional dispatch function, and optional view.
- `clearEmptyHeading(state, dispatch)`: Converts the selected empty heading to
  a paragraph so Backspace removes its Markdown heading marker.
- `standardCommands`: Built-in named commands: `undo`, `redo`, `paragraph`,
  `heading1`, `heading2`, `heading3`, `toggleBold`, `toggleItalic`,
  `toggleCode`, `toggleStrike`, and `blockquote`.

### src/element/wysiwyg-markdown.ts

`WysiwygMarkdownElement` is a form-associated Lit custom element. Its important
public properties are:

- `value`: Canonical Markdown string.
- `mode`: `wysiwyg`, `source`, or `readonly`.
- `placeholder`, `readonly`, `disabled`, `name`: Standard input state.
- `sourceEditScope`: `document` by default; `block` is an explicit opt-in.
- `showCodeBlockHeader`, `showCodeLineNumbers`: Code-block UI controls.
- `themeCss`: Trusted host CSS injected into the component Shadow DOM.
- `codeHighlighter(code, language)`: Returns token ranges/classes used as
  ProseMirror decorations.
- `uploadImage(file)`: Persists a pasted file and returns its Markdown source.
- `imageResolver(source)`: Resolves a stored Markdown image source to a display
  URL without modifying saved Markdown.
- `transformPastedText(text)`: Host hook for plain-text paste processing.

Public methods:

- `getMarkdown()`: Returns the current Markdown value.
- `setMarkdown(markdown)`: Replaces the complete document value.
- `setMode(mode)`: Validates and switches editor mode.
- `focus(options)`: Focuses the WYSIWYG view or active source textarea.
- `undo()` / `redo()`: Runs ProseMirror history commands.
- `execute(commandName)`: Executes a built-in or extension command.
- `use(extension)`: Registers an extension and rebuilds editor plugins.
- `removeExtension(name)`: Removes a registered extension.
- `getExtensions()`: Returns extensions in effective priority order.
- `insertText(text)`: Replaces the current selection with plain text.
- `insertMarkdown(markdown)`: Parses Markdown and replaces the selection.
- `replaceSelection(markdown)`: Alias of `insertMarkdown()`.
- `insertImage(source, alt, title)`: Inserts an image node.
- `cancelBlockSourceEdit()` / `applyBlockSourceEdit()`: Controls the optional
  block-source panel.

Emitted events are bubbling and composed:

- `input`: Emitted for document edits; `detail` contains `markdown` and the
  edit source.
- `change`: Emitted on committed/blurred changes with the same detail shape.
- `mode-change`: Contains the new mode.
- `selection-change`: Contains ProseMirror `from` and `to` positions.
- `editor-error`: Contains the parsing/serialization error and related
  Markdown.

The element exposes Shadow DOM parts named `surface`, `placeholder`, `editor`,
`source-editor`, and `block-source-panel`. SideNote primarily uses `themeCss`
because normal document CSS does not cross the Shadow DOM boundary.

### src/extensions

- `ExtensionRegistry.add(extension)`: Rejects empty or duplicate names.
- `remove(name)`, `has(name)`, `list()`: Manage extensions; `list()` sorts by
  descending priority.
- `commands(base)`: Merges extension commands with the standard command map.
- `plugins()`: Converts extension shortcuts and input rules into ProseMirror
  plugins.
- `createStandardInputRules()`: Creates built-in rules for headings, fenced
  code, blockquotes, bullet/ordered lists, task items, and horizontal rules.

An `EditorExtension` can provide `commands`, `shortcuts`, `inputRules`, and a
numeric `priority`. Structural schema extensions are not dynamically installed;
the Markdown schema remains fixed for document compatibility.

## src/state.js

Central state management for shared variables:

- **Exported Variables**: `notes`, `deletedNotes`, `globalSettings`, `isGlobalSettings`, `activeNoteId`, `originalNoteContent`, `isPreview`
- **Setter Functions**:
  - `setNotes(newNotes)`: Updates the notes array
  - `setDeletedNotes(newDeletedNotes)`: Updates the deleted notes array
  - `setGlobalSettings(newSettings)`: Updates global settings
  - `setIsGlobalSettings(value)`: Sets global settings editing state
  - `setActiveNoteId(id)`: Sets the currently active note ID
  - `setOriginalNoteContent(content)`: Sets original note content for change detection
  - `setIsPreview(value)`: Sets preview mode state

## src/database/

IndexedDB operations are now modularized into separate files for better organization:

### src/database/init.js

Database initialization and shared instance management:

- `initDB()`: Initializes the IndexedDB database and creates object stores
- `getDB()`: Gets the shared database instance for other modules

### src/database/notes.js

Note-related database operations:

- `saveNote(note)`: Saves a note object to the database
- `getAllNotes()`: Retrieves all note objects from the database
- `deleteNoteDB(id)`: Marks a note as deleted in the database
- `restoreNoteDB(id)`: Restores a deleted note in the database
- `deleteNotePermanentlyDB(id)`: Permanently deletes a note from the database

**Internal functions** (not exported):
- `_getNoteObject(id)`: Retrieves a note object from the database by its ID

### src/database/images.js

Image-related database operations:

- `saveImage(id, blob)`: Saves an image to the database
- `getImage(id)`: Retrieves an image blob from the database
- `deleteImage(id)`: Marks an image as deleted in the database
- `restoreImage(id)`: Restores a deleted image in the database
- `deleteImagePermanently(id)`: Permanently deletes an image from the database
- `getAllImageObjectsFromDB()`: Retrieves all image objects from the database

**Internal functions** (not exported):
- `_getImageObject(id)`: Retrieves an image object from the database by its ID

### src/database/index.js

Unified entry point for backward compatibility:

- Re-exports all functions from the sub-modules for seamless integration
- Maintains backward compatibility with existing imports

## src/dom.js

DOM element references (all constants exported):

Contains references to all UI elements used throughout the extension, including:
- View containers: `listView`, `editorView`, `settingsView`, etc.
- Interactive elements: buttons, inputs, dropdowns
- Content areas: `noteList`, `markdownEditor`, `htmlPreview`, etc.

## src/utils.js

Utility functions (all functions exported):

- `createBlobUrlTracker()`: Creates an isolated blob URL tracker with `create`, `revoke`, `revokeAll`, and `getCount` methods
- `getTimestamp()`: Gets a timestamp string in YYYY_MM_DD_HH_MM_SS format
- `sanitizeFilename(filename)`: Sanitizes a filename by replacing invalid characters
- `downloadFile(blob, fileName)`: Downloads a file using blob URL
- `extractImageIds(content)`: Extracts image IDs from markdown content

## src/text-processors.js

Legacy text processing utilities for markdown editing (all functions exported):

- `escapeTildes(text)`: Escapes tilde characters to prevent markdown strikethrough formatting
- `addAutoLineBreaks(text)`: Adds two spaces at the end of each line for markdown line breaks
- `processPastedText(text, settings)`: Processes pasted text according to user settings (tilde escape, auto line breaks)
- `countTrailingSpaces(text)`: Counts trailing spaces in a text string
- `normalizeTrailingSpaces(text, targetSpaces)`: Ensures text has exactly the specified number of trailing spaces
- `handleEnterKeyInput(textarea, settings, insertTextFunction)`: Processes Enter key input for markdown line breaks with whitespace cleanup
- `analyzeTextAtCursor(text, cursorPos)`: Analyzes text structure for cursor position and line information

**Note**: Used by `src/events/editor.js` for consistent markdown text processing across different input methods

## src/editor/sidenote-editor-adapter.js

SideNote integration for the reusable WYSIWYG Markdown Web Component:

- `initializeWysiwygMarkdownEditor()`: Installs the 4.1.14-compatible SideNote Preview theme, shared Preview/Edit padding, code line numbers, image hooks, pasted-text processing, and highlight.js decorations on `#markdown-editor`
- `setEditorMode(mode)`: Forwards `wysiwyg`, `source`, or `readonly` mode changes to the custom element when available

Internal image Markdown paths remain `images/{id}.png`; the adapter resolves them to temporary Blob URLs without changing saved note content.

## src/settings.js

Settings management (functions exported):

- `DEFAULT_SETTINGS`: Default global settings used to normalize missing settings
- `normalizeGlobalSettings(settings)`: Merges partial global settings with defaults
- `resolveEffectiveSettings(note)`: Resolves note-specific settings with global/default fallback
- `resolveLegacyTextProcessingSettings(settings)`: Returns legacy text-processing settings, forcing trailing-space processors off unless legacy line-break mode is enabled
- `saveGlobalSettings()`: Saves the global settings to chrome.storage.local
- `applyFontSize(size)`: Applies font size to the editor Web Component (through `--editor-font-size`) and preview element
- `applyMode(mode)`: Applies color mode (light/dark/system) to the document
- `updateAutoLineBreakButton()`: Updates the legacy auto line break toolbar button state
- `updateTildeReplacementButton()`: Updates the tilde replacement toolbar button visibility and state
- `updateLegacyLineBreakControls()`: Updates the legacy line-break mode checkbox and dependent controls
- `isCodeBlockHeaderEnabled(note)`: Resolves the effective code block header setting from note settings with global fallback
- `populateSettingsForm(isGlobal, note)`: Populates settings fields for either global or note-specific settings

**Note**: Uses `globalSettings` from state.js module

## src/notes.js

Note operations (functions exported):

- `sortNotes()`: Sorts the notes array (pinned first, then by last modified)
- `deleteNote(noteId)`: Soft deletes a note (moves to recycle bin)
- `togglePin(noteId)`: Toggles the pin status of a note
- `restoreNote(noteId)`: Restores a deleted note from recycle bin
- `deleteNotePermanently(noteId)`: Permanently deletes a note
- `emptyRecycleBin()`: Empties the recycle bin (permanent deletion of all items)

**Note**: These functions mutate in-memory state and persist through the database layer, but they no longer call view renderers directly. Event or view callers are responsible for refreshing affected UI.

## src/history.js

Navigation history management (all functions exported):

- `pushToHistory(state)`: Pushes a new state to the navigation history
- `moveBack()`: Moves to the previous state in the navigation history
- `moveForward()`: Moves to the next state in the navigation history
- `canMoveBack()`: Checks if it is possible to go back in history
- `canMoveForward()`: Checks if it is possible to go forward in history
- `getCurrentHistoryState()`: Gets the current state without moving the pointer
- `clearHistory()`: Clears the navigation history
- `getHistory()`: Returns the entire navigation history stack
- `getHistoryIndex()`: Returns the current index in the history
- `goToHistoryState(index)`: Navigates to a specific index in the history

**Constants**:
- `HISTORY_STACK_LIMIT`: Maximum history size (512 items)

## src/import_export.js

File processing (functions exported):

- `parseSnote(zip)`: Parses a `.snote` zip and returns note data plus image blobs without saving
- `saveParsedSnoteImages(parsedNote)`: Saves parsed image blobs to IndexedDB
- `createNoteFromParsedSnote(parsedNote, overrides)`: Creates a note object from parsed note data
- `saveParsedSnote(parsedNote, overrides)`: Saves parsed images and a new note to IndexedDB
- `processSnote(zip)`: Backward-compatible helper that parses and saves a new note
- `saveImportedNotes(parsedNotes)`: Saves multiple parsed notes in last-modified order with increasing timestamps
- `getExportContent(note, options)`: Returns note Markdown for export, optionally adding two-space line breaks
- `createNoteFolderName(note, usedFolderNames, options)`: Chooses an all-notes archive folder name, using sanitized unique note titles for `.zip` exports when requested
- `addNoteToZip(zipTarget, note, options)`: Adds note metadata, Markdown, and referenced images to a zip target
- `createSingleNoteArchive(note, options)`: Creates a `.snote`/`.zip` archive for one note
- `createAllNotesArchive(notes, options)`: Creates a `.snotes`/`.zip` archive for all notes

## src/notes_view/

UI rendering and view management is now modularized into separate files for better organization:

### src/notes_view/view-manager.js

View switching and navigation management:

- `showListView(addToHistory)`: Shows the main notes list view
- `showEditorView(addToHistory)`: Shows the note editor view
- `showSettingsView(addToHistory)`: Shows the settings view
- `showLicenseView(addToHistory)`: Shows the license information view
- `showRecycleBinView(addToHistory)`: Shows the recycle bin view
- `showImageManagementView(addToHistory)`: Shows the image management view

### src/notes_view/note-renderer.js

Note list and editor functionality:

- `renderNoteList()`: Renders the list of notes in the main view
- `openNote(noteId, inEditMode, addToHistory)`: Opens a note in the editor

### src/notes_view/markdown-renderer.js

Markdown and image rendering functionality:

- `configureMarkdownRenderer()`: Configures Marked with SideNote renderer options, including default soft line breaks unless legacy mode is enabled
- `renderMarkdownToHtml(markdown)`: Converts Markdown to sanitized HTML
- `decorateCodeBlocks(container, note)`: Adds code block headers, line classes, and line numbers
- `renderMarkdown()`: Updates the hidden legacy HTML preview retained for
  compatibility helpers; the visible editable Preview is rendered by the
  `<wysiwyg-markdown>` component
- `renderImages()`: Renders images in the markdown preview
- `togglePreview()`: Toggles between editable WYSIWYG Preview and full-document Markdown source editing

### src/notes_view/recycle-bin-renderer.js

Recycle bin rendering and management:

- `renderDeletedItemsList()`: Renders the list of deleted items in recycle bin

### src/notes_view/image-manager.js

Image modal and management functionality:

- `showImageModal(blobUrl)`: Shows an image in a modal dialog
- `renderImagesList()`: Renders the list of images in image management

### src/notes_view/index.js

Unified entry point for backward compatibility:

- Re-exports all functions from the sub-modules for seamless integration
- Maintains backward compatibility with existing imports

## src/events/

Event handling is now modularized into separate files for better organization:

### src/events/navigation.js

Navigation, history, and back button functionality:

- `navigateToState(state)`: Navigates to a specific view state
- `goBack()`: Navigates to the previous view in history
- `populateHistoryDropdown(dropdown)`: Populates history dropdown with items
- `showHistoryDropdown(targetButton)`: Shows the history dropdown menu
- `refreshHistoryDropdown()`: Refreshes the history dropdown if open
- `initializeNavigationEvents()`: Sets up all navigation-related event listeners

### src/events/editor.js

Note creation, markdown editor, and paste handling:

- `insertTextAtCursor(textarea, text)`: Inserts text at cursor position in textarea
- `initializeEditorEvents()`: Sets up all editor-related event listeners

Handles: new note creation (opening directly in editable WYSIWYG Preview), markdown input, image paste, WYSIWYG `Shift+Enter` soft breaks, source-mode preview shortcuts, checkbox interactions, title editing

### src/events/settings-events.js

Settings-related event listeners:

- `initializeSettingsEvents()`: Sets up all settings-related event listeners

Handles: note/global settings, licenses, recycle bin, image management, confirmation dropdowns

### src/events/import-export-events.js

Import/export functionality:

- `initializeImportExportEvents()`: Sets up all import/export event listeners

Handles: note/global export, file import, .snote/.snotes processing

Right-clicking an export button opens a format dropdown. The `.zip` option can be right-clicked again to show original Markdown and Markdown with two-space line break options above the `.zip` row.

### src/events/global-events.js

Global keyboard events and system theme detection:

- `initializeGlobalEvents()`: Sets up global event listeners

Handles: ESC key, system theme changes, dropdown closing

### src/events/index.js

Unified entry point for all event modules:

- `initializeAllEvents()`: Initializes all event listeners from all modules
- Re-exports utility functions: `navigateToState`, `goBack`, `populateHistoryDropdown`, `showHistoryDropdown`, `refreshHistoryDropdown`, `insertTextAtCursor`

## src/main.js

Application entry point and initialization:

- `bootstrap()`: Runs deterministic startup: DB init, data load/migration, cleanup, initial UI render, and event binding
- `initializeInitialView()`: Applies loaded settings and shows the initial list view
- `loadAndMigrateData()`: Loads data from storage and migrates to IndexedDB if necessary
- `cleanupDeletedImages()`: Deletes images in recycle bin for more than 30 days
- `cleanupDeletedNotes()`: Deletes notes in recycle bin for more than 30 days

**Note**: Main entry point now exports startup helpers for tests and only auto-runs `bootstrap()` when auto bootstrap is not disabled.

## Module Architecture

The extension now uses ES6 modules with explicit imports/exports:

1. **State Management**: Centralized in `state.js` with getter/setter functions
2. **Dependency Injection**: Modules import only what they need from other modules
3. **Entry Point**: `main.js` is loaded as `type="module"` in HTML
4. **Event Initialization**: Event listeners are organized in `src/events/` modules and initialized via `initializeAllEvents()` call
5. **Circular Dependencies**: Avoided through careful module structure and state centralization
