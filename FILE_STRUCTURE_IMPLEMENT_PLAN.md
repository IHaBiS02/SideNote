### Detailed Implementation Plan

#### 1. **Project Setup**

*   **New Dependency:** I will add the `JSZip` library to the project, which is necessary for creating and reading `.zip` archives for the new `.snote` and `.snotes` formats.
    *   **Action:** Download `jszip.min.js` and place it in the `vendor/` directory.
    *   **File to Modify:** `sidepanel.html`
        *   **Change:** Add `<script src="vendor/jszip.min.js"></script>` before the `sidepanel.js` script tag to make the library available.

#### 2. **Core Logic (`sidepanel.js`)**

This file requires the most significant changes. I will break down the implementation into several parts:

*   **A. Image Storage (New Feature)**
    *   **Action:** I will implement a small manager for `IndexedDB` directly within `sidepanel.js`. This is where all pasted images will be stored as binary data (Blobs), mapped by a unique ID.
    *   **New Functions:**
        *   `initDB()`: To set up the database and the "images" object store.
        *   `saveImage(id, blob)`: To save an image.
        *   `getImage(id)`: To retrieve an image.
        *   `deleteImage(id)`: To remove an image.

*   **B. Image Pasting (New Feature)**
    *   **File to Modify:** `sidepanel.js`
    *   **Action:** I will enhance the existing `paste` event listener for the `markdownEditor`.
    *   **Change:** The listener will now check the clipboard for image data. If an image is found, it will:
        1.  Generate a unique ID.
        2.  Save the image to `IndexedDB` using the new `saveImage` function.
        3.  Insert the corresponding markdown reference (`![Image](images/UNIQUE_ID.png)`) into the editor at the cursor's position.
        4.  If no image is present, it will proceed with pasting text as it does now.

*   **C. Markdown Rendering for Images (Feature Replacement)**
    *   **File to Modify:** `sidepanel.js`
    *   **Action:** I will modify the `renderMarkdown` function to display the stored images.
    *   **Change:** Since `marked.js` cannot directly access `IndexedDB`, the plan is to:
        1.  First, render the markdown to HTML as usual.
        2.  After rendering, scan the `html-preview` element for `<img>` tags whose `src` attribute points to our local image store (e.g., `src="images/UNIQUE_ID.png"`).
        3.  For each found image, I will retrieve the blob from `IndexedDB` using `getImage()`, create a temporary `Blob URL`, and set the `src` of the `<img>` tag to this URL, making the image visible.

*   **D. Export Logic (Feature Replacement)**
    *   **File to Modify:** `sidepanel.js`
    *   **Action:** The current export functions (`globalExportButton`, `exportNoteButton`) will be completely replaced.
    *   **Change:**
        *   **Single Note (`.snote`):** The new logic will create a zip archive containing `note.md` (content), `metadata.json` (title, settings, etc.), and an `images/` folder with all images used in that specific note (retrieved from `IndexedDB`).
        *   **Multiple Notes (`.snotes`):** This will create a single zip file where each note is a folder named after its ID, and each folder has the same structure as a `.snote` file.

*   **E. Import Logic (Feature Replacement)**
    *   **File to Modify:** `sidepanel.js`
    *   **Action:** The import functions (`globalImportInput`, `importNoteInput`) will also be replaced.
    *   **Change:** The new logic will use `JSZip` to read the uploaded `.snote` or `.snotes` file. It will parse the `metadata.json`, read the `note.md` content, and, crucially, extract any images from the `images/` folder and save them into the browser's `IndexedDB` using the `saveImage` function.

#### 3. **Image Management UI (New Feature)**
*   **File to Modify:** `sidepanel.html`
    *   **Action:** Add a new button labeled "Images" to the settings view (`id="settings-view"`). This button will be styled similarly to the existing settings buttons.
    *   **Action:** Create a new view container (`id="image-management-view"`) that will be shown when the "Images" button is clicked. This view will be hidden by default.

*   **File to Modify:** `sidepanel.js`
    *   **Action:** Implement the logic to show the `image-management-view` and hide other views when the "Images" button is clicked.
    *   **Action:** Create a function to populate the `image-management-view` with a list of all images stored in `IndexedDB`.
    *   **UI Layout:** The layout will be similar to the "Recycle Bin" and "Notes List" views. Each image entry will display:
        *   A small thumbnail of the image on the left.
        *   The image's name (e.g., `image_12345.png`) next to the thumbnail.
        *   An icon indicating whether the image is currently used in any note.
        *   A trashcan icon for deletion.
    *   **New Functions & Event Handlers:**
        *   `renderImagesList()`: Fetches all images from `IndexedDB` and dynamically creates the list items in the `image-management-view`.
        *   **Thumbnail Click:** An event listener on the thumbnail will open a modal or popup to display a larger version of the image.
        *   **Usage Icon Click:** An event listener on the usage icon will display a list of notes that currently use the selected image.
        *   **Deletion Button Click:** An event listener on the trashcan icon will call the `deleteImage(id)` function and remove the image from both `IndexedDB` and the view. This will reuse existing deletion logic/UI patterns.

#### 4. **File Updates**

*   **`manifest.json`**: I will increment the version number to reflect these significant changes.
*   **`STRUCTURE.md`**: After implementation, I will update this document to describe the new `.snote`/`.snotes` file structure and the use of `IndexedDB` for image storage.

Files like `background.js`, `sidepanel.css`, and `dark_mode.css` do not require any changes for this implementation.
