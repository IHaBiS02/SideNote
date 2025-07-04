# Simple Notes Extension Structure

This document outlines the internal structure of the Simple Notes Chrome extension, detailing the architecture, file organization, and the role of each major component and function.

## 1. Project Overview

The extension provides a simple note-taking interface within the browser's side panel. Users can create, edit, and manage notes written in Markdown. It supports features like a live preview, syntax highlighting, dark/light modes, and data import/export.

## 2. File Structure

-   **`manifest.json`**: The core configuration file for the Chrome extension. It defines permissions, icons, and registers the side panel.
-   **`sidepanel.html`**: The main HTML file that defines the structure of the user interface, including all views (note list, editor, settings, etc.).
-   **`sidepanel.js`**: The main JavaScript file containing all the application logic, state management, and event handling.
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
    -   Buttons to navigate to the Recycle Bin and Licenses page.
-   **`#license-view`**: Displays the contents of `LIBRARY_LICENSES.md`.
-   **`#recycle-bin-view`**: Displays a list of deleted notes (`#deleted-note-list`) with options to restore or delete them permanently.

## 4. JavaScript Logic (`sidepanel.js`)

This file orchestrates the entire application.

### Core Concepts & State Management

-   **State Variables**:
    -   `notes`: An array of note objects. Each object contains an `id`, `title`, `content`, `settings`, and `metadata` (timestamps).
    -   `deletedNotes`: An array of note objects that have been moved to the recycle bin.
    -   `activeNoteId`: Stores the `id` of the note currently being edited.
    -   `globalSettings`: An object holding all global application settings.
    -   `isPreview`: A boolean flag to track if the editor is in "Preview" or "Edit" mode.
-   **Data Persistence**: All state (`notes`, `deletedNotes`, `globalSettings`) is saved to and loaded from the browser's local storage using the `chrome.storage.local` API.

### Function Breakdown

#### Initialization & Data Management

-   **`chrome.storage.local.get(...)`**: On startup, this function loads all data from storage. It initializes default settings if none are found and performs a one-time migration if it detects an old data format.
-   **`saveNotes()` / `saveDeletedNotes()` / `saveGlobalSettings()`**: These functions serialize their respective state variables and save them to `chrome.storage.local`. They are called whenever data is modified.
-   **`sortNotes()`**: Sorts the `notes` array based on the `lastModified` timestamp, ensuring the most recently edited notes appear first.
-   **`cleanupDeletedNotes()`**: Automatically and permanently deletes notes from the recycle bin that are older than 30 days.

#### View Management

-   **`showListView()` / `showEditorView()` / `showSettingsView()` / etc.**: A set of functions that control UI visibility by changing the `display` style of the different view containers. This creates the single-page application effect.

#### Note List (`#list-view`)

-   **`renderNoteList()`**: Clears and re-populates the `#note-list` UL with items from the `notes` array. It attaches click listeners to each item to open the note and a delete icon to move the note to the recycle bin.
-   **`newNoteButton` (Event Listener)**: Creates a new, empty note object, adds it to the `notes` array, saves it, and immediately opens it in the editor.
-   **`deleteNote(noteId)`**: Finds the note by its ID, removes it from the `notes` array, adds it to the `deletedNotes` array (with a `deletedAt` timestamp), and saves both arrays.

#### Editor (`#editor-view`)

-   **`openNote(noteId)`**: Sets the `activeNoteId`, populates the editor with the note's content and title, applies the correct font size, and switches to the editor view.
-   **`markdownEditor` (Event Listeners)**:
    -   `input`: Fired on every keystroke. It updates the `content` of the active note object, updates the title if it's set to the default (first line), saves the changes, and re-renders the Markdown preview.
    -   `paste`: Intercepts pasted text to apply automatic formatting (tilde replacement, adding double spaces for line breaks).
    -   `keydown`: Handles keyboard shortcuts, such as `Shift+Enter` to toggle the preview and `Enter` to auto-add double spaces for line breaks.
-   **`renderMarkdown()`**: The core rendering function. It uses `marked.js` to convert the editor's Markdown text to HTML. It then uses `DOMPurify` to sanitize the output before injection to prevent XSS attacks. Finally, it uses `highlight.js` and `highlightjs-line-numbers.js` to apply syntax highlighting and line numbers to code blocks.
-   **`togglePreview()`**: Switches between the raw text editor (`#markdown-editor`) and the rendered view (`#html-preview`).
-   **`editorTitle` (Event Listener)**: A `dblclick` listener that dynamically replaces the `<h1>` title with an `<input>` field, allowing the user to set a custom title for the note.

#### Settings & Recycle Bin

-   **Settings Listeners**: Event listeners on the various controls in the settings view (`mode-setting`, `font-size-setting`, etc.) update either the `globalSettings` object or the specific `settings` object for the active note, then save the changes.
-   **`applyMode(mode)`**: Toggles the `dark-mode` class on the `<body>` element based on the user's selection (Dark, Light, or System).
-   **`renderDeletedNoteList()`**: Populates the recycle bin view with deleted notes, adding listeners to restore or permanently delete them.
-   **`restoreNote(noteId)`**: Moves a note from `deletedNotes` back to the `notes` array.
-   **`deleteNotePermanently(noteId)`**: Removes a note from the `deletedNotes` array permanently.

#### Import & Export

-   **Export Buttons**: Listeners that stringify either a single note or the entire `notes` array into a JSON format and trigger a file download (`.snote` for single, `.snotes` for all).
-   **Import Buttons**: Listeners that programmatically click hidden `<input type="file">` elements. When a user selects a file, the `change` event listener reads the file, parses the JSON, and adds the imported notes to the main `notes` array.

## 5. External Libraries (`vendor/`)

-   **`marked.min.js`**: A high-performance Markdown parser to convert Markdown text into HTML.
-   **`dompurify.min.js`**: A robust HTML sanitizer used to prevent Cross-Site Scripting (XSS) vulnerabilities by cleaning the HTML generated from user-provided Markdown.
-   **`highlight.min.js`**: A syntax highlighter that can parse and style code blocks in many different languages.
-   **`highlightjs-line-numbers.min.js`**: A plugin for `highlight.js` that adds line numbers to the highlighted code blocks.
