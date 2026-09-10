# SideNote web demo

[한국어](README.ko.md)

This site runs the **complete original SideNote side-panel app**, not a separately
implemented reader. Its HTML, styles, settings, events, note management, editor,
image viewer/manager, recycle bin and import/export code are copied unchanged.
Only the HTML's platform and bootstrap script URLs are substituted.

The left panel starts with the note list. Selecting a note shows the same content
in a second, wider instance of the app. Edits and settings synchronize; editor
mode and scroll remain independent. Returning to the list clears the wide pane.
At widths up to 760px or in portrait orientation, only the sidebar is visible.

Settings, Escape navigation, title editing, pinning, long-press reorder, creation,
deletion, restore, image management, WYSIWYG/source editing and all original
export menus use the original handlers. Downloads export the current visitor's
content, including edits, rather than always returning the published archive.

## Web platform boundary

The two same-origin frames share a fresh **in-memory IndexedDB factory** and an
in-memory `browser.storage.local` adapter. All notes, images, ordering and settings
reset when the top-level page reloads. No extension data, browser IndexedDB database
or server is modified. Export anything you want to keep before reloading.

An ordinary website cannot install a browser side panel, register the browser-wide
activation shortcut or run the extension's install/service-worker lifecycle.
Those browser-owned features are not simulated. Clipboard, downloads and external
images remain subject to normal website permissions, CORS and browser support.

## Publish notes

Export `.snote` files from SideNote into `notes/`, then add entries to `notes/index.json`:

```json
{ "id": "my-note", "file": "notes/my-note.snote", "pinned": false }
```

Use unique lowercase IDs with digits/hyphens. Filenames accept ASCII letters,
digits, underscores and hyphens. Titles and note settings come from the archive;
an old manifest `title` field is optional and ignored. Manifest order seeds initial
pin order and modification timestamps; afterward SideNote's original sorting applies.
Archives and attached images are public. Publishing does not expose private extension
data. All published archives are imported once before displaying the initial list.

## Develop and deploy

Use Node.js 24 on Windows. From this gh-pages checkout:

```powershell
npm ci
npm run dev
npm run test:run
npm run build
```

Open http://127.0.0.1:4173. Tests execute the actual app modules in jsdom, with the
same memory adapter used by the website. VM module support is enabled by the test
command. Build replaces only generated `dist/`. GitHub Pages can serve `gh-pages`
at `/ (root)` directly. Commit and push this branch to publish; extension release
tags are unrelated.

## Sync the entire app

```powershell
npm run sync:sidenote -- C:\Users\justp\Documents\SideNote
npm run test:run
npm run build
```

The source checkout must have dependencies installed (`npm ci`). Sync builds the
editor and extension, replaces generated `app/` with `build/chrome/`, substitutes
two bootstrap script URLs, and bundles the memory database adapter. No source
functions are extracted or rewritten. All original CSS and runtime/vendor files,
including PDF/HTML export dependencies, are copied. Licenses and both WYSIWYG
behavior references are refreshed. `vendor/sidenote-source.json` records the exact
source version/commit. Published `.snote` files are not changed.

This is explicit command-based synchronization, not an automatic push after each
main commit. Review changes to the entry points, exported state APIs or extension
API use when updating upstream. Test and commit generated assets together.

## Files

- `app/`: complete generated original extension distribution; do not edit manually.
- `web-platform.js`: memory storage/IndexedDB compatibility, disables auto bootstrap.
- `app-bootstrap.js`: imports published archives, starts original app, mirrors state.
- `script.js`, `index.html`, `style.css`: platform owner and responsive iframe layout.
- `vendor/`: bundled memory database and source revision record.
- `notes/`: published archives and manifest.
- `scripts/`: source sync, static server/build and sample generation.
- `tests/`: actual-runtime integration and archive validation.

See [input behaviors](WYSIWYG_INPUT_BEHAVIORS.md) and [licenses](LIBRARY_LICENSES.md).
`npm run samples` overwrites the two sample archives; do not run it over your own
replacement files. Removed simplified-reader code remains recoverable in Git history.
