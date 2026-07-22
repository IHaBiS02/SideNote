# Functions

This file documents the functions used in the SideNote extension (TypeScript ES modules).

## Build workspace

- `npm run build`: Cleans prior output, builds the WYSIWYG editor workspace,
  packages Chrome and Firefox extensions, and creates the AMO reviewer source
  ZIP.
- `npm run build:editor`: Generates the combined extension/editor runtime
  dependency notices, compiles the TypeScript Web Component with Vite, and
  emits declaration files.
- `npm run build:app`: Compiles `background.ts` and `src/**/*.ts` into readable
  JavaScript under `build/extension-runtime/` while preserving module paths.
- `npm run build:extension`: Runs `build:app`, then `build.js`, which copies the
  compiled extension runtime, locked third-party browser assets, and editor
  bundle into each browser package.
- `npm run package:amo-source`: Creates an allow-listed, deterministic source
  ZIP with reviewer instructions.
- `npm run release:amo`: Compatibility alias for `npm run build`.

## background.ts and shortcut setup

- The initial-install listener calls `browser.commands.getAll()` and checks
  both `_execute_action` (Chrome) and `_execute_sidebar_action` (Firefox).
- When the activation command is missing or has an empty `shortcut`, it opens
  `shortcut-setup.html` as a compact popup window. Updates do not trigger the
  check, which avoids repeatedly prompting users who later remove the shortcut.
- `src/shortcut-setup.ts` exposes `openBrowserShortcutSettings()`. It uses
  Firefox's `commands.openShortcutSettings()` when available and otherwise
  opens Chrome's `chrome://extensions/shortcuts` page in a new tab.

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
  Markdown for SideNote persistence. Links always use explicit
  `[text](destination)` syntax instead of angle-bracket autolinks.

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
- `scrollToImage(source, options)`: Scrolls the rendered image with the exact
  Markdown source into view without exposing the component Shadow DOM.
- `cancelBlockSourceEdit()` / `applyBlockSourceEdit()`: Controls the optional
  block-source panel.

The built-in keymaps run `splitListItem()` for `Enter`, `sinkListItem()` for
`Tab`, and `liftListItem()` for `Shift+Tab` in bullet and ordered lists. Enter
produces the next bullet or number, Tab nests the current item under a preceding
sibling, and Shift+Tab moves it outward. `Shift+Enter` inserts a `soft_break`
inside the current item; an empty list item falls through to the base keymap so
`Enter` exits the list.

In document source scope, a WYSIWYG double-click resolves the pointer to a
ProseMirror position and maps it to the canonical Markdown offset. The source
textarea is then focused with a collapsed selection at that offset. A
style-matched offscreen mirror measures wrapped source text so the caret can be
centered in the textarea, clamped by its scroll limits. Leaving source mode maps
the source selection back into a ProseMirror position, restores the collapsed
selection, and centers it in the WYSIWYG scroll viewport with the same edge
clamping.

Emitted events are bubbling and composed:

- `input`: Emitted for document edits; `detail` contains `markdown` and the
  edit source.
- `change`: Emitted on committed/blurred changes with the same detail shape.
- `mode-change`: Contains the new mode.
- `selection-change`: Contains ProseMirror `from` and `to` positions.
- `image-activate`: Contains the persisted Markdown `source` and resolved
  `displaySource` when a rendered image is clicked.
- `editor-error`: Contains the parsing/serialization error and related
  Markdown.

The element exposes Shadow DOM parts named `surface`, `placeholder`, `editor`,
`source-editor`, and `block-source-panel`. SideNote primarily uses `themeCss`
because normal document CSS does not cross the Shadow DOM boundary. A middle
click on a rendered link opens its destination in a new browser tab. The
`--editor-line-height` and `--editor-heading-line-height` variables default to
`1.5`, with semantic heading sizes and margins defined by the component.
`--editor-source-line-height` and `--editor-code-line-height` default to `1.2`
for full-document plain-text editing and fenced code blocks. The
`--editor-code-content-padding` custom property controls fenced-code inner
spacing and defaults to `5px`. Markdown table cells use collapsed 1px borders;
`--editor-table-border-color` defaults to the current text color and can be
overridden by the host theme. The
non-content code header keeps its language label out of code selections while
keeping its language input directly editable in WYSIWYG mode. Committing the
input updates the code block `params` attribute; source, readonly, and disabled
modes lock the control. An unselectable display label sits behind the stable
input while it is unfocused, hiding browser selection paint from ranges that
cross the non-content header.

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

## src/types.ts and src/globals.d.ts

- `types.ts`: Defines the shared `Note`, `NoteSettings`, `GlobalSettings`,
  `StoredImage`, and `NavigationHistoryState` contracts.
- `globals.d.ts`: Types the packaged `browser`, JSZip, Marked, DOMPurify, and
  highlight.js globals without adding runtime imports to browser modules.

## src/state.ts

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

### src/database/init.ts

Database initialization and shared instance management:

- `initDB()`: Initializes the IndexedDB database and creates object stores
- `getDB()`: Gets the shared database instance for other modules

### src/database/notes.ts

Note-related database operations:

- `saveNote(note)`: Saves a note object to the database
- `getAllNotes()`: Retrieves all note objects from the database
- `deleteNoteDB(id)`: Marks a note as deleted in the database
- `restoreNoteDB(id)`: Restores a deleted note in the database
- `deleteNotePermanentlyDB(id)`: Permanently deletes a note from the database

**Internal functions** (not exported):
- `_getNoteObject(id)`: Retrieves a note object from the database by its ID

### src/database/images.ts

Image-related database operations:

- `saveImage(id, blob)`: Saves an image to the database
- `getImage(id)`: Retrieves an image blob from the database
- `deleteImage(id)`: Marks an image as deleted in the database
- `restoreImage(id)`: Restores a deleted image in the database
- `deleteImagePermanently(id)`: Permanently deletes an image from the database
- `getAllImageObjectsFromDB()`: Retrieves all image objects from the database

**Internal functions** (not exported):
- `_getImageObject(id)`: Retrieves an image object from the database by its ID

### src/database/index.ts

Unified entry point for backward compatibility:

- Re-exports all functions from the sub-modules for seamless integration
- Maintains backward compatibility with existing imports

## src/dom.ts

DOM element references (all constants exported):

Contains references to all UI elements used throughout the extension, including:
- View containers: `listView`, `editorView`, `settingsView`, etc.
- Interactive elements: buttons, inputs, dropdowns
- Content areas: `noteList`, `markdownEditor`, `licenseContent`, etc.

## src/utils.ts

Utility functions (all functions exported):

- `createBlobUrlTracker()`: Creates an isolated blob URL tracker with `create`, `revoke`, `revokeAll`, and `getCount` methods
- `getTimestamp()`: Gets a timestamp string in YYYY_MM_DD_HH_MM_SS format
- `sanitizeFilename(filename)`: Sanitizes a filename by replacing invalid characters
- `downloadFile(blob, fileName)`: Downloads a file using blob URL
- `extractImageIds(content)`: Extracts image IDs from markdown content

## src/text-processors.ts

Plain-text paste processing utilities (all functions exported):

- `escapeTildes(text)`: Escapes tilde characters to prevent markdown strikethrough formatting
- `addAutoLineBreaks(text)`: Adds two spaces at the end of each line for markdown line breaks
- `processPastedText(text, settings)`: Processes pasted text according to user settings (tilde escape, auto line breaks)

The SideNote adapter calls `processPastedText()` through the component's
`transformPastedText` hook. Removed textarea fallbacks are not part of this
module.

## src/editor/sidenote-editor-adapter.ts

SideNote integration for the reusable WYSIWYG Markdown Web Component:

- `initializeWysiwygMarkdownEditor()`: Installs the 4.1.14-compatible SideNote Preview theme, shared Preview/Edit padding, code line numbers, image hooks, pasted-text processing, and highlight.js decorations on `#markdown-editor`
- `setEditorMode(mode)`: Forwards `wysiwyg`, `source`, or `readonly` mode changes to the custom element when available

Internal image Markdown paths remain `images/{id}.png`; the adapter resolves them to temporary Blob URLs without changing saved note content.

## src/settings.ts

Settings management (functions exported):

- `DEFAULT_SETTINGS`: Default global settings used to normalize missing settings
- `normalizeGlobalSettings(settings)`: Merges partial global settings with defaults
- `normalizeLineHeight(value, fallback)`: Clamps line spacing to `1.0`–`3.0` and rounds it to `0.1` precision, using the supplied fallback (`1.5` by default)
- `resolveEffectiveSettings(note)`: Resolves note-specific settings with global/default fallback
- `resolveLegacyTextProcessingSettings(settings)`: Returns legacy paste-processing settings, forcing the two-space line-break transform off unless legacy mode is enabled
- `saveGlobalSettings()`: Saves the global settings to chrome.storage.local
- `applyFontSize(size)`: Applies font size to the editor Web Component through `--editor-font-size`
- `applyLineHeight(lineHeight)`: Applies WYSIWYG prose and heading spacing through `--sidenote-line-height`, `--editor-line-height`, and `--editor-heading-line-height`
- `applySourceLineHeight(lineHeight)`: Applies full-document plain-text spacing through `--editor-source-line-height`
- `applyCodeLineHeight(lineHeight)`: Applies fenced code-block spacing through `--editor-code-line-height`
- `applyLineHeightSettings(settings)`: Applies all three effective line-spacing values together during startup and note opening
- `applyMode(mode)`: Applies color mode (light/dark/system) to the document
- `updateAutoLineBreakButton()`: Updates the legacy auto line break toolbar button state
- `updateTildeReplacementButton()`: Updates the tilde replacement toolbar button visibility and state
- `updateLegacyLineBreakControls()`: Updates the legacy line-break mode checkbox and dependent controls
- `isCodeBlockHeaderEnabled(note)`: Resolves the effective code block header setting from note settings with global fallback
- `populateSettingsForm(isGlobal, note)`: Populates settings fields for either global or note-specific settings, including effective font size and all three line-spacing values plus the global `wysiwygPreview` preference (enabled by default)

**Note**: Uses `globalSettings` from state.js module

## src/notes.ts

Note operations (functions exported):

- `sortNotes()`: Sorts the notes array (pinned first, then by last modified)
- `deleteNote(noteId)`: Soft deletes a note (moves to recycle bin)
- `togglePin(noteId)`: Toggles the pin status of a note
- `restoreNote(noteId)`: Restores a deleted note from recycle bin
- `deleteNotePermanently(noteId)`: Permanently deletes a note
- `emptyRecycleBin()`: Empties the recycle bin (permanent deletion of all items)

**Note**: These functions mutate in-memory state and persist through the database layer, but they no longer call view renderers directly. Event or view callers are responsible for refreshing affected UI.

## src/history.ts

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

## src/import_export.ts

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

### src/notes_view/view-manager.ts

View switching and navigation management:

- `showListView(addToHistory)`: Shows the main notes list view
- `showEditorView(addToHistory)`: Shows the note editor view
- `showSettingsView(addToHistory)`: Shows the settings view
- `showLicenseView(addToHistory)`: Shows the license information view
- `showRecycleBinView(addToHistory)`: Shows the recycle bin view
- `showImageManagementView(addToHistory)`: Shows the image management view

### src/notes_view/note-renderer.ts

Note list and editor functionality:

- `renderNoteList()`: Renders the list of notes in the main view
- `openNote(noteId, inEditMode, addToHistory)`: Opens a note in the editor

### src/notes_view/editor-mode.ts

Editor display-mode coordination:

- `applyEditorDisplayMode()`: Uses `wysiwyg` or `readonly` for Preview according to `wysiwygPreview`, and `source` for full-document Markdown editing
- `togglePreview()`: Toggles between the configured WYSIWYG Preview mode and full-document Markdown source editing

### src/notes_view/recycle-bin-renderer.ts

Recycle bin rendering and management:

- `renderDeletedItemsList()`: Renders the list of deleted items in recycle bin

### src/notes_view/image-manager.ts

Image modal and management functionality:

- `showImageModal(blobUrl)`: Shows an image in a modal dialog
- `renderImagesList()`: Renders the image-management list and uses the
  component's `scrollToImage()` API when navigating to an image occurrence

### src/notes_view/index.ts

Unified entry point for backward compatibility:

- Re-exports all functions from the sub-modules for seamless integration
- Maintains backward compatibility with existing imports

## src/events/

Event handling is now modularized into separate files for better organization:

### src/events/navigation.ts

Navigation, history, and back button functionality:

- `navigateToState(state)`: Navigates to a specific view state
- `goBack()`: Navigates to the previous view in history
- `populateHistoryDropdown(dropdown)`: Populates history dropdown with items
- `showHistoryDropdown(targetButton)`: Shows the history dropdown menu
- `refreshHistoryDropdown()`: Refreshes the history dropdown if open
- `initializeNavigationEvents()`: Sets up all navigation-related event listeners

### src/events/editor.ts

Note creation and editor interaction handling:

- `initializeEditorEvents()`: Sets up all editor-related event listeners

Handles: new note creation (opening in the configured editable or read-only
WYSIWYG Preview), Markdown autosave, mode history, source-mode preview
shortcuts, image activation, and title editing. Enter or Escape commits the
active custom-title input; Escape stops before the global navigation handler so
the current note remains open. Component-owned paste, checkbox, and WYSIWYG
keyboard behavior stays inside the editor package.

### src/events/settings-events.ts

Settings-related event listeners:

- `initializeSettingsEvents()`: Sets up all settings-related event listeners

Handles: note/global settings (including live line-spacing updates), licenses, recycle bin, image management, confirmation dropdowns

### src/events/import-export-events.ts

Import/export functionality:

- `initializeImportExportEvents()`: Sets up all import/export event listeners

Handles: note/global export, file import, .snote/.snotes processing

Right-clicking an export button opens a format dropdown. The `.zip` option can be right-clicked again to show original Markdown and Markdown with two-space line break options above the `.zip` row.

### src/events/global-events.ts

Global keyboard events and system theme detection:

- `initializeGlobalEvents()`: Sets up global event listeners

Handles: ESC key, system theme changes, dropdown closing

### src/events/index.ts

Unified entry point for all event modules:

- `initializeAllEvents()`: Initializes all event listeners from all modules
- Re-exports navigation helpers: `navigateToState`, `goBack`,
  `populateHistoryDropdown`, `showHistoryDropdown`, and
  `refreshHistoryDropdown`

## src/main.ts

Application entry point and initialization:

- `bootstrap()`: Runs deterministic startup: DB init, data load/migration, cleanup, initial UI render, and event binding
- `initializeInitialView()`: Applies loaded settings and shows the initial list view
- `loadAndMigrateData()`: Loads data from storage and migrates to IndexedDB if necessary
- `cleanupDeletedImages()`: Deletes images in recycle bin for more than 30 days
- `cleanupDeletedNotes()`: Deletes notes in recycle bin for more than 30 days

**Note**: Main entry point now exports startup helpers for tests and only auto-runs `bootstrap()` when auto bootstrap is not disabled.

## Module Architecture

The extension source uses TypeScript ES modules with explicit imports/exports;
`tsc` preserves the module layout and `.js` import specifiers in browser output:

1. **State Management**: Centralized in `state.ts` with typed live bindings and setter functions
2. **Dependency Injection**: Modules import only what they need from other modules
3. **Entry Point**: Source `main.ts` is emitted as `src/main.js`, which is loaded as `type="module"` in HTML
4. **Event Initialization**: Event listeners are organized in `src/events/` modules and initialized via `initializeAllEvents()` call
5. **Circular Dependencies**: Avoided through careful module structure and state centralization
