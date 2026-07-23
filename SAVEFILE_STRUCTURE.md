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

A `.snotes` file is a ZIP archive containing multiple notes. A root manifest
stores the displayed order and pinned state, while each note remains in its own
directory named by its ID:

```
notes.zip/
├── manifest.json
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

#### manifest.json Structure

```json
{
  "formatVersion": 1,
  "notes": [
    {
      "folder": "note-id-1",
      "order": 0,
      "isPinned": true,
      "pinOrder": 0
    },
    {
      "folder": "note-id-2",
      "order": 1,
      "isPinned": false
    }
  ]
}
```

- `folder` maps the manifest entry to its note directory.
- `order` records the note's displayed position when exported.
- `isPinned` restores whether the note belongs to the pinned section.
- `pinOrder` records the source pinned position for archive inspection. During
  import, pinned positions are normalized against the destination list rather
  than copied verbatim.

## Image Handling

- Images are stored in IndexedDB with unique IDs
- In Markdown, images are referenced as `images/[id].png`
- When exporting, matching blobs are saved as `images/[id].png`
- Imported images receive new IDs when needed, and Markdown references are rewritten to match

## Import Behavior

- When importing a `.snote` file, a new note is created with the imported content
- When importing `.snotes`, a version 1 manifest restores the archive's note
  order and pinned state. Older archives without a manifest remain supported
  and import as unpinned notes using their modification-time order.
- Existing notes keep their current order. Imported pinned notes are appended
  to the pinned section with sequential values after the greatest existing
  `pinOrder`/legacy `pinnedAt`, preventing order-number collisions.
- Imported regular notes receive a unique descending `lastModified` range above
  the existing regular notes so their archive order is preserved without ties.
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
