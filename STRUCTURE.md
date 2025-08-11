# SideNote Extension Structure

This document outlines the internal structure of the SideNote browser extension, detailing the architecture, file organization, and the role of each major component and function.

## 1. Project Overview

SideNote is a browser extension that provides a simple note-taking interface within the browser's side panel. Users can create, edit, and manage notes written in Markdown. It supports features like a live preview, syntax highlighting, dark/light modes, image embedding, and data import/export.

## 2. File Structure

-   **`manifest.json`**: The core configuration file for the Chrome extension. It defines permissions, icons, and registers the side panel.
-   **`sidepanel.html`**: The main HTML file that defines the structure of the user interface, including all views (note list, editor, settings, etc.).
-   **`src/`**: This directory contains all the JavaScript logic for the extension, broken down into modules.
    -   `main.js`: The main entry point. It initializes the application, loads data, handles the one-time migration of notes from `chrome.storage` to `IndexedDB`, and calls `initializeAllEvents()` to set up all event listeners.
    -   `database.js`: Contains all functions for interacting with the `IndexedDB` database, for both notes and images.
    -   `dom.js`: Contains DOM element references as constants for all UI elements used throughout the extension.
    -   `notes.js`: Contains the core logic for managing notes (sorting, deleting, pinning, restoring, etc.).
    -   `notes_view.js`: Handles rendering the notes list and other UI components. It contains the logic for creating and managing the image usage dropdown.
    -   `events/`: Directory containing modularized event handling:
        -   `navigation.js`: Navigation, history, and back button functionality
        -   `editor.js`: Note creation, markdown editor, and paste handling
        -   `settings-events.js`: Settings-related event listeners
        -   `import-export-events.js`: Import/export functionality
        -   `global-events.js`: Global keyboard events and system theme detection
        -   `index.js`: Unified entry point that exports `initializeAllEvents()` function
    -   `history.js`: Manages the view navigation history stack, allowing for "back" functionality.
    -   `settings.js`: Manages global and note-specific settings.
    -   `import_export.js`: Contains the logic for importing and exporting notes.
    -   `utils.js`: Utility functions for timestamps, filename sanitization, file downloads, and image ID extraction.
-   **`sidepanel.css`**: The primary stylesheet for the extension's UI.
-   **`dark_mode.css`**: A supplementary stylesheet containing CSS variables and rules specifically for the dark mode theme.
-   **`background.js`**: A service worker script that handles the initial opening of the side panel when the extension icon is clicked.
-   **`vendor/`**: A directory containing all third-party libraries used in the project.

## 3. HTML Structure (`sidepanel.html`)

The UI is a single-page application with several distinct "views" that are shown or hidden as needed.

-   **`#list-view`**: The main screen.
    -   Displays the list of all notes (`#note-list`).
    -   Contains the "New Note" button (`#new-note-button`).
    -   A toolbar with global actions: Import (`#global-import-button`), Export (`#global-export-button`), and Settings (`#global-settings-button`).
-   **`#editor-view`**: The screen for writing and viewing a single note.
    -   A header with a "Back" button (`#back-button`) and the note's title (`#editor-title`).
    -   `#markdown-editor`: A `<textarea>` for raw Markdown input.
    -   `#html-preview`: A `<div>` to display the rendered HTML preview.
    -   A toolbar with buttons for toggling the view, line breaks, tilde replacement, and note-specific import/export/settings.
-   **`#settings-view`**: The screen for configuring settings.
    -   Can be accessed globally (from list view) or for a specific note (from editor view).
    -   Controls for UI Mode (Light/Dark), Title behavior, Font Size, and other options.
    -   Checkbox for "Auto Add Two Spaces on Enter" and "Prevent deletion of used images".
    -   Buttons to navigate to Image Management, Recycle Bin, and Licenses pages.
-   **`#license-view`**: Displays the contents of `LIBRARY_LICENSES.md`.
-   **`#recycle-bin-view`**: Displays a list of deleted items (`#deleted-items-list`), both notes and images, with options to restore or delete them permanently. Includes an "Empty Recycle Bin" button.
-   **`#image-management-view`**: Displays a list of all images (`#image-list`) with usage information and deletion controls.

## 4. JavaScript Logic

### Core Concepts & State Management

-   **State Variables**:
    -   `notes`: An array of note objects. Each object contains an `id`, `title`, `content`, `settings`, and `metadata` (timestamps).
    -   `deletedNotes`: An array of note objects that have been moved to the recycle bin.
    -   `activeNoteId`: Stores the `id` of the note currently being edited.
    -   `globalSettings`: An object holding all global application settings.
    -   `isPreview`: A boolean flag to track if the editor is in "Preview" or "Edit" mode.
    -   Navigation history is managed through the `history.js` module.
-   **Data Persistence**:
    -   All data (`notes`, `images`, and `globalSettings`) is now stored in `IndexedDB`. `chrome.storage.local` is only used for `globalSettings` and for the one-time migration of old notes.

### Function Breakdown

#### Initialization & Data Management (`main.js`, `database.js`)

-   **`initDB()`**: Initializes the IndexedDB database and creates the `images` and `notes` object stores.
-   **`loadAndMigrateData()`**: On startup, this function loads all data from `IndexedDB`. It also handles the one-time migration of notes from `chrome.storage.local` to `IndexedDB`.
-   **`saveNote()` / `getAllNotes()` / `deleteNoteDB()` / etc.**: A set of async functions in `database.js` to perform CRUD operations on note data in IndexedDB.
-   **`saveImage()` / `getImage()` / `deleteImage()` / etc.**: A set of async functions to perform CRUD operations on image data in IndexedDB.
-   **`sortNotes()`**: Sorts the `notes` array based on the `lastModified` timestamp.
-   **`cleanupDeletedNotes()` / `cleanupDeletedImages()`**: Automatically and permanently deletes items from the recycle bin that are older than 30 days.

#### View Management (`notes_view.js`, `history.js`, `src/events/`)

-   **`showListView()` / `showEditorView()` / `showSettingsView()` / etc.**: A set of functions that control UI visibility. They now accept an `addToHistory` parameter and will call `pushToHistory` to record the navigation change.
-   **`pushToHistory()` / `popFromHistory()` / etc.**: Functions in `history.js` for managing the `navigationHistory` stack.
-   **`goBack()`**: A function in `src/events/navigation.js` that is triggered by back buttons or the Escape key. It uses the `navigationHistory` to return the user to the previously visited view.
-   **`backButton` (Context Menu)**: Right-clicking the back button opens a custom dropdown menu displaying the navigation history, allowing the user to jump to a specific previous view.
-   **`navigateToState(state)`**: Navigates to a specific view state based on the provided state object.
-   **History Dropdown Management**: Functions in `src/events/navigation.js` to show, populate, and refresh the navigation history dropdown.

#### Note List (`notes_view.js`, `src/events/`)

-   **`renderNoteList()`**: Populates the `#note-list` with items from the `notes` array.
-   **`newNoteButton` (Event Listener)**: Creates a new, empty note object and opens it (handled in `src/events/editor.js`).
-   **`deleteNote(noteId)`**: Moves a note to the recycle bin by adding a `deletedAt` timestamp.
-   **`togglePin(noteId)`**: Toggles the pin status of a note.
-   **`emptyRecycleBin()`**: Empties the recycle bin after two-step confirmation (handled in `src/events/settings-events.js`).

#### Editor (`notes_view.js`, `src/events/`)

-   **`openNote(noteId, inEditMode, addToHistory)`**: Sets the `activeNoteId` and populates the editor with the note's content. It now also records the action in the navigation history.
-   **`markdownEditor` (Event Listeners)** (handled in `src/events/editor.js`):
    -   `input`: Updates the note content and metadata on every keystroke.
    -   `paste`: Intercepts pasted content. If it's an image, it saves it to IndexedDB and inserts the corresponding Markdown tag. If it's text, it applies formatting.
    -   `keydown`: Handles keyboard shortcuts (Enter, Shift+Enter).
-   **`renderMarkdown()`**: Converts Markdown to HTML, sanitizes it, and applies syntax highlighting. It also calls `renderImages()`.
-   **`renderImages()`**: Finds all `<img>` tags in the preview and loads their `src` from IndexedDB blob URLs.
-   **`togglePreview()`**: Switches between the raw text editor and the rendered view, and records the change in the navigation history.

#### Settings & Recycle Bin (`settings.js`, `notes_view.js`, `src/events/`)

-   **Settings Listeners**: Update `globalSettings` or note-specific settings (handled in `src/events/settings-events.js`).
-   **`applyMode(mode)`**: Toggles the `dark-mode` class on the `<body>`.
-   **`renderDeletedItemsList()`**: Fetches all deleted notes and images from `IndexedDB`. It combines them into a single array, sorts them by deletion date, and renders them in the `#deleted-items-list`. Each item has controls to be restored or permanently deleted.
-   **`renderImagesList()`**: Renders the list of images in the image management view, showing usage information and delete controls.
-   **`restoreNote(noteId)` / `restoreImage(id)`**: Moves an item from the recycle bin back to the active state.
-   **`deleteNotePermanently(noteId)` / `deleteImagePermanently(id)`**: Removes an item permanently from storage.

#### Import & Export (`import_export.js`, `src/events/`)

-   **Export Buttons**: Package one or all notes into a `.snote` or `.snotes` zip file. The zip includes the note content (`note.md`), metadata (`metadata.json`), and any associated images from IndexedDB (handled in `src/events/import-export-events.js`).
-   **Import Buttons**: Unzip a `.snote` or `.snotes` file, read the metadata and content, save any included images to IndexedDB, and create new notes in the application (handled in `src/events/import-export-events.js`).

## 5. External Libraries (`vendor/`)

-   **`marked.min.js`**: A high-performance Markdown parser to convert Markdown text into HTML.
-   **`dompurify.min.js`**: A robust HTML sanitizer used to prevent Cross-Site Scripting (XSS) vulnerabilities by cleaning the HTML generated from user-provided Markdown.
-   **`highlight.min.js`**: A syntax highlighter that can parse and style code blocks in many different languages.
-   **`highlightjs-line-numbers.min.js`**: A plugin for `highlight.js` that adds line numbers to the highlighted code blocks.
-   **`jszip.min.js`**: A library for creating, reading, and editing `.zip` files, used for the import/export functionality.
-   **`browser-polyfill.min.js`**: WebExtension browser API Polyfill for cross-browser compatibility.
-   **`atom-one-light.css`**: Light theme for syntax highlighting (additional dark theme available).