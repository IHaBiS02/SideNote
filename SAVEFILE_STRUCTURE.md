# Save File Structure

This document describes the file structure for SideNote's import/export functionality.

## File Types

### .snote (Single Note Export)

A `.snote` file is a ZIP archive containing a single note with its metadata and associated images. The structure is:

```
note.zip/
├── note.md          # The note content in Markdown format
├── metadata.json    # Note metadata and settings
└── images/          # Directory containing all images used in the note
    ├── image_[id1].[ext]
    ├── image_[id2].[ext]
    └── ...
```

#### metadata.json Structure

```json
{
  "title": "Note Title",
  "created": "2024-01-01T00:00:00.000Z",
  "lastModified": "2024-01-01T00:00:00.000Z",
  "settings": {
    "autoLineBreak": true,
    "tildeReplacement": false,
    "customTitle": "Custom Title",
    "isPinned": false
  }
}
```

### .snotes (Multiple Notes Export)

A `.snotes` file is a ZIP archive containing multiple notes. Each note is stored in its own directory named by its ID:

```
notes.zip/
├── [note-id-1]/
│   ├── note.md
│   ├── metadata.json
│   └── images/
│       └── ...
├── [note-id-2]/
│   ├── note.md
│   ├── metadata.json
│   └── images/
│       └── ...
└── ...
```

## Image Handling

- Images are stored in IndexedDB with unique IDs
- In Markdown, images are referenced using the custom protocol: `sidenote-image://[id]`
- When exporting, images are saved as files with names like `image_[id].[extension]`
- The original file extension is preserved when available

## Import Behavior

- When importing a `.snote` file, a new note is created with the imported content
- Existing notes are not overwritten
- Images are imported to IndexedDB with new IDs to avoid conflicts
- Image references in the Markdown content are automatically updated with the new IDs

## Note Storage in IndexedDB

Notes and images are stored in separate object stores:

- **notes** object store: Contains note objects with the following structure:
  ```javascript
  {
    id: "unique-id",
    title: "Note Title",
    content: "Markdown content",
    created: timestamp,
    lastModified: timestamp,
    deletedAt: timestamp, // Only present for deleted notes
    settings: {
      autoLineBreak: boolean,
      tildeReplacement: boolean,
      customTitle: string,
      isPinned: boolean
    }
  }
  ```

- **images** object store: Contains image objects with the following structure:
  ```javascript
  {
    id: "unique-id",
    blob: Blob,
    created: timestamp,
    deletedAt: timestamp // Only present for deleted images
  }
  ```