# Functions

This file documents the functions used in the SideNote extension.

## src/database.js

- `initDB()`: Initializes the IndexedDB database.
- `_getNoteObject(id)`: Retrieves a note object from the database by its ID.
- `saveNote(note)`: Saves a note object to the database.
- `getAllNotes()`: Retrieves all note objects from the database.
- `deleteNoteDB(id)`: Marks a note as deleted in the database.
- `restoreNoteDB(id)`: Restores a deleted note in the database.
- `deleteNotePermanentlyDB(id)`: Permanently deletes a note from the database.
- `_getImageObject(id)`: Retrieves an image object from the database by its ID.
- `saveImage(id, blob)`: Saves an image to the database.
- `getImage(id)`: Retrieves an image blob from the database.
- `deleteImage(id)`: Marks an image as deleted in the database.
- `restoreImage(id)`: Restores a deleted image in the database.
- `deleteImagePermanently(id)`: Permanently deletes an image from the database.
- `getAllImageObjectsFromDB()`: Retrieves all image objects from the database.

## src/dom.js

- This file contains DOM element references (constants) for all UI elements used throughout the extension.

## src/events.js

- `navigateToState(state)`: Navigates to a specific view state.
- `goBack()`: Navigates to the previous view in the history.
- `populateHistoryDropdown(dropdown)`: Populates the history dropdown with navigation history items.
- `showHistoryDropdown(targetButton)`: Shows the history dropdown menu.
- `refreshHistoryDropdown()`: Refreshes the history dropdown if it's currently open.

## src/history.js

- `pushToHistory(state)`: Pushes a new state to the navigation history.
- `moveBack()`: Moves to the previous state in the navigation history.
- `moveForward()`: Moves to the next state in the navigation history.
- `canMoveBack()`: Checks if it is possible to go back.
- `canMoveForward()`: Checks if it is possible to go forward.
- `getCurrentHistoryState()`: Gets the current state from the navigation history without moving it.
- `clearHistory()`: Clears the navigation history.
- `getHistory()`: Returns the entire navigation history stack.
- `getHistoryIndex()`: Returns the current index in the history.
- `goToHistoryState(index)`: Navigates to a specific index in the history.

## src/import_export.js

- `processSnote(zip)`: Processes a .snote or .snotes file.

## src/main.js

- `loadAndMigrateData()`: Loads data from storage and migrates it to IndexedDB if necessary.
- `cleanupDeletedImages()`: Deletes images that have been in the recycle bin for more than 30 days.
- `cleanupDeletedNotes()`: Deletes notes that have been in the recycle bin for more than 30 days.

## src/notes.js

- `sortNotes()`: Sorts the notes array.
- `deleteNote(noteId)`: Deletes a note.
- `togglePin(noteId)`: Toggles the pin status of a note.
- `restoreNote(noteId)`: Restores a deleted note.
- `deleteNotePermanently(noteId)`: Permanently deletes a note.
- `emptyRecycleBin()`: Empties the recycle bin by permanently deleting all items.

## src/notes_view.js

- `renderNoteList()`: Renders the list of notes.
- `openNote(noteId, inEditMode, addToHistory)`: Opens a note in the editor.
- `showListView(addToHistory)`: Shows the list view.
- `showEditorView(addToHistory)`: Shows the editor view.
- `showSettingsView(addToHistory)`: Shows the settings view.
- `showLicenseView(addToHistory)`: Shows the license view.
- `showRecycleBinView(addToHistory)`: Shows the recycle bin view.
- `showImageManagementView(addToHistory)`: Shows the image management view.
- `renderDeletedItemsList()`: Renders the list of deleted items.
- `renderMarkdown()`: Renders the markdown content as HTML.
- `renderImages()`: Renders images in the preview.
- `togglePreview()`: Toggles between the editor and preview modes.
- `showImageModal(blobUrl)`: Shows an image in a modal.
- `renderImagesList()`: Renders the list of images.

## src/settings.js

- `saveGlobalSettings()`: Saves the global settings to storage.
- `applyFontSize(size)`: Applies the font size to the editor and preview elements.
- `applyMode(mode)`: Applies the color mode to the document body.
- `updateAutoLineBreakButton()`: Updates the auto line break button text and title.
- `updateTildeReplacementButton()`: Updates the tilde replacement button text and title.

## src/utils.js

- `getTimestamp()`: Gets a timestamp string.
- `sanitizeFilename(filename)`: Sanitizes a filename.
- `downloadFile(blob, fileName)`: Downloads a file.
- `extractImageIds(content)`: Extracts image IDs from a string of content.
