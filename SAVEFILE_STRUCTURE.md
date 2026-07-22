# Save File Structure

This document describes the file structure for SideNote's import/export functionality.

## File Types

### .snote (Single Note Export)

A `.snote` file is a ZIP archive containing a single note with its metadata and associated images. The structure is:

```
note.snote/
├── note.md          # The note content in Markdown format
├── metadata.json    # Note metadata and settings
└── images/          # Directory containing all images used in the note
    ├── [id1].png
    ├── [id2].png
    └── ...
```

#### metadata.json Structure

```json
{
  "title": "Note Title",
  "settings": {
    "title": "custom",
    "fontSize": 14,
    "lineHeight": 1.8,
    "sourceLineHeight": 1.3,
    "codeLineHeight": 1.4,
    "codeBlockHeader": true
  },
  "metadata": {
    "createdAt": 1704067200000,
    "lastModified": 1704067200000
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
- In Markdown, images are referenced as `images/[id].png`
- When exporting, matching blobs are saved as `images/[id].png`
- Imported images receive new IDs when needed, and Markdown references are rewritten to match

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
    settings: {
      title?: string,
      fontSize?: number,
      lineHeight?: number,
      sourceLineHeight?: number,
      codeLineHeight?: number,
      codeBlockHeader?: boolean
    },
    metadata: {
      createdAt: timestamp,
      lastModified: timestamp,
      deletedAt?: timestamp
    },
    isPinned: boolean,
    pinnedAt?: timestamp,
    pinOrder?: number
  }
  ```

  `pinOrder` stores the user-arranged position within the pinned section.
  Existing records without it remain compatible and are ordered by `pinnedAt`.

- **images** object store: Contains image objects with the following structure:
  ```javascript
  {
    id: "unique-id",
    blob: Blob,
    deletedAt: timestamp | null
  }
  ```
