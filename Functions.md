# Functions

This file documents the functions used in the SideNote extension (ES6 modules).

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

## src/database.js

IndexedDB operations (all functions exported):

- `initDB()`: Initializes the IndexedDB database
- `saveNote(note)`: Saves a note object to the database
- `getAllNotes()`: Retrieves all note objects from the database
- `deleteNoteDB(id)`: Marks a note as deleted in the database
- `restoreNoteDB(id)`: Restores a deleted note in the database
- `deleteNotePermanentlyDB(id)`: Permanently deletes a note from the database
- `saveImage(id, blob)`: Saves an image to the database
- `getImage(id)`: Retrieves an image blob from the database
- `deleteImage(id)`: Marks an image as deleted in the database
- `restoreImage(id)`: Restores a deleted image in the database
- `deleteImagePermanently(id)`: Permanently deletes an image from the database
- `getAllImageObjectsFromDB()`: Retrieves all image objects from the database

**Internal functions** (not exported):
- `_getNoteObject(id)`: Retrieves a note object from the database by its ID
- `_getImageObject(id)`: Retrieves an image object from the database by its ID

## src/dom.js

DOM element references (all constants exported):

Contains references to all UI elements used throughout the extension, including:
- View containers: `listView`, `editorView`, `settingsView`, etc.
- Interactive elements: buttons, inputs, dropdowns
- Content areas: `noteList`, `markdownEditor`, `htmlPreview`, etc.

## src/utils.js

Utility functions (all functions exported):

- `getTimestamp()`: Gets a timestamp string in YYYY_MM_DD_HH_MM_SS format
- `sanitizeFilename(filename)`: Sanitizes a filename by replacing invalid characters
- `downloadFile(blob, fileName)`: Downloads a file using blob URL
- `extractImageIds(content)`: Extracts image IDs from markdown content

## src/settings.js

Settings management (functions exported):

- `saveGlobalSettings()`: Saves the global settings to chrome.storage.local
- `applyFontSize(size)`: Applies font size to editor and preview elements
- `applyMode(mode)`: Applies color mode (light/dark/system) to the document
- `updateAutoLineBreakButton()`: Updates the auto line break button state
- `updateTildeReplacementButton()`: Updates the tilde replacement button state

**Note**: Uses `globalSettings` from state.js module

## src/notes.js

Note operations (functions exported):

- `sortNotes()`: Sorts the notes array (pinned first, then by last modified)
- `deleteNote(noteId)`: Soft deletes a note (moves to recycle bin)
- `togglePin(noteId)`: Toggles the pin status of a note
- `restoreNote(noteId)`: Restores a deleted note from recycle bin
- `deleteNotePermanently(noteId)`: Permanently deletes a note
- `emptyRecycleBin()`: Empties the recycle bin (permanent deletion of all items)

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

- `processSnote(zip)`: Processes a .snote or .snotes file and imports the note with images

## src/notes_view.js

UI rendering and view management (functions exported):

- `renderNoteList()`: Renders the list of notes in the main view
- `openNote(noteId, inEditMode, addToHistory)`: Opens a note in the editor
- `showListView(addToHistory)`: Shows the main notes list view
- `showEditorView(addToHistory)`: Shows the note editor view
- `showSettingsView(addToHistory)`: Shows the settings view
- `showLicenseView(addToHistory)`: Shows the license information view
- `showRecycleBinView(addToHistory)`: Shows the recycle bin view
- `showImageManagementView(addToHistory)`: Shows the image management view
- `renderDeletedItemsList()`: Renders the list of deleted items in recycle bin
- `renderMarkdown()`: Renders markdown content as HTML in preview
- `renderImages()`: Renders images in the markdown preview
- `togglePreview()`: Toggles between editor and preview modes
- `showImageModal(blobUrl)`: Shows an image in a modal dialog
- `renderImagesList()`: Renders the list of images in image management

## src/events.js

Event listeners and user interactions (utility functions exported):

- `insertTextAtCursor(textarea, text)`: Inserts text at cursor position in textarea
- `navigateToState(state)`: Navigates to a specific view state
- `goBack()`: Navigates to the previous view in history
- `populateHistoryDropdown(dropdown)`: Populates history dropdown with items
- `showHistoryDropdown(targetButton)`: Shows the history dropdown menu
- `refreshHistoryDropdown()`: Refreshes the history dropdown if open

**Note**: This module primarily contains event listeners that are executed on import (side effects)

## src/main.js

Application entry point and initialization:

- `loadAndMigrateData()`: Loads data from storage and migrates to IndexedDB if necessary
- `cleanupDeletedImages()`: Deletes images in recycle bin for more than 30 days
- `cleanupDeletedNotes()`: Deletes notes in recycle bin for more than 30 days

**Note**: Main entry point that imports all other modules and initializes the application

## Module Architecture

The extension now uses ES6 modules with explicit imports/exports:

1. **State Management**: Centralized in `state.js` with getter/setter functions
2. **Dependency Injection**: Modules import only what they need from other modules
3. **Entry Point**: `main.js` is loaded as `type="module"` in HTML
4. **Side Effects**: Event listeners in `events.js` are executed on module import
5. **Circular Dependencies**: Avoided through careful module structure and state centralization
