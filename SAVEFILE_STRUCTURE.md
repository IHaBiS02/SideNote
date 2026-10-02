# Save File Structure

This document describes the file structure for SideNote's import/export functionality.

Standalone `.html` and `.pdf` exports are presentation formats, not SideNote
backup/import formats. HTML export creates one self-contained file, embeds
SideNote-stored and reachable external images as Base64 data URLs, and includes
a local code-block copy handler. Its note body shares SideNote Preview's
semantic typography, list, link, table, checkbox, and syntax-highlight styles.
HTML task checkboxes can be toggled locally, but their state is not saved back
to SideNote or into the HTML file; reopening restores the exported state. It
fails when an external image cannot be downloaded instead of retaining an
online image URL. PDF export directly creates
a local PDF from the same sanitized document without opening the print dialog;
its rendered note content is rasterized rather than selectable text. Use
`.snote` or `.snotes` when the note must be imported back into SideNote.

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

A `.snotes` file is a ZIP archive containing notes and, since 5.0.0, folders. A root manifest
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

#### Legacy version 1 manifest.json Structure

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
- Version 2 imports remap images to new IDs to avoid conflicts
- Image references in the Markdown content are automatically updated with the new IDs

## Note Storage in IndexedDB

The runtime database uses four object stores in IndexedDB version 5. Export archives continue to use
full note records; the summary store is a derived startup index and is not part
of `.snote` or `.snotes` files.

- **notes** object store: Contains note objects with the following structure:
  ```javascript
  {
    id: "unique-id",
    parentId: null, // or a folder ID
    deletionGroup: undefined, // optional soft-delete group ID
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

- **noteSummaries** object store: Contains only list and recycle-bin metadata:
  ```javascript
  {
    id: "unique-id",
    parentId: null, // or a folder ID
    deletionGroup: undefined, // optional soft-delete group ID
    title: "Note Title",
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

  Markdown `content` and per-note `settings` are intentionally excluded so
  startup can list many notes without reading every body. Saving, deleting,
  restoring, or permanently deleting a note updates `notes` and
  `noteSummaries` together. IndexedDB version 3 backfills this store for
  existing installations.

- **images** object store: Contains image objects with the following structure:
  ```javascript
  {
    id: "unique-id",
    blob: Blob,
    deletedAt: timestamp | null
  }
  ```

  IndexedDB version 4 adds a non-unique `deletedAt` index. Startup expiration
  cleanup and empty-recycle-bin operations use an index key cursor to retrieve
  only image IDs, so large Blob values are not read or cloned. Active images
  with `deletedAt: null` are absent from the index. The index is local derived
  database metadata and does not change `.snote`, `.snotes`, HTML, PDF, or ZIP
  export formats.

## Version 2 hierarchy manifest (5.0.0)

Whole-library `.snotes` and ZIP exports now use:

```json
{
  "formatVersion": 2,
  "folders": [{
    "kind": "folder", "id": "folder-id", "title": "Projects", "parentId": null,
    "ownModifiedAt": 1704067200000,
    "metadata": { "createdAt": 1704067200000, "lastModified": 1704067200000 },
    "isPinned": true, "pinOrder": 0
  }],
  "notes": [{
    "id": "note-id", "folder": "note-id", "parentId": "folder-id",
    "isPinned": false
  }]
}
```

Note directories still contain `note.md`, `metadata.json` and images. Folders are
manifest records, including empty folders; they are not nested ZIP directories.
`parentId` encodes the hierarchy. Pins are scoped to each parent. Version 2 import
preserves note dates and internal order, remaps note/folder/image IDs, and appends
imported root pins after existing pins. It validates duplicate IDs, parent links,
cycles and required note files before one atomic save. Legacy v1/manifest-free
imports retain their date-rebasing behavior and go to root. Older SideNote versions
do not understand the v2 manifest.

The `folders` store holds the manifest-style folder records plus optional deletion
metadata. Notes and summaries gain `parentId` and optional `deletionGroup`.
Summaries additionally store `imageIds`, derived from the Markdown, for shared-image
protection on permanent tree deletion. Upgrading v4 to v5 backfills root membership
and regenerates summaries without changing content, pin order or deletion state.
Folder `metadata.lastModified` is the maximum of `ownModifiedAt` and active child
modification times. These rules are detailed in [FOLDER_IMPLEMENTATION.md](FOLDER_IMPLEMENTATION.md).
