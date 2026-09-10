# SideNote published notes

A GitHub Pages site using SideNote's real Lit/ProseMirror editor. Published
content lives in .snote archives. Visitors can edit in WYSIWYG, double-click
to edit the whole Markdown document, then return with Edit/WYSIWYG,
Ctrl/Cmd+Enter, or Shift+Enter/Escape in source mode.

Edits and pasted images survive note navigation only in memory. Refresh restores
published content. The disk/download control downloads the original .snote,
not the visitor's draft. Nothing is written to extension storage or a server.
Checkboxes, headings, lists, code language editing and code copying use the
same editor as SideNote. See [input behaviors](WYSIWYG_INPUT_BEHAVIORS.md)
or [Korean reference](WYSIWYG_INPUT_BEHAVIORS.ko.md).

The list reuses SideNote's source CSS, icon spacing, 51px header and 41px footer.
The gear opens theme settings. Pins are clickable and sort pinned notes first,
preserving manifest order within each group. Pin changes reset on refresh.
Add/import/delete are unavailable on this published demo. The browser-owned
panel frame is not part of the website. Small screens put the list above the editor.

## Publishing notes

Export a .snote from SideNote into notes/my-note.snote and add an entry to
notes/index.json:

```json
{ "id": "my-note", "title": "My note", "file": "notes/my-note.snote", "pinned": false }
```

Use unique lowercase IDs with hyphens. File names accept ASCII letters, numbers,
hyphens and underscores. Array order controls order within each pin group.
List titles come from this manifest; reader titles come from archive metadata.
Replace a .snote to update it. Delete its entry and file to unpublish it.
Published archives, including their attached images, are public.

## Development

Use Node.js 24. Runtime dependencies are vendored; jsdom is a development dependency.

```powershell
npm ci
npm run dev
npm run test:run
npm run build
```

Open http://127.0.0.1:4173. The build replaces only the generated dist folder.
GitHub Pages can serve the branch root directly: Settings → Pages → Deploy
from a branch → gh-pages → / (root). Commit and push gh-pages to publish;
extension version tags are unrelated.

## Sync from SideNote

From this gh-pages checkout, run:

```powershell
npm run sync:sidenote -- C:\Users\justp\Documents\SideNote
npm run test:run
npm run build
```

The argument must be an extension source checkout with its dependencies installed
(npm ci). The command builds its editor, copies the bundle/source map and original
CSS, extracts the pure theme and highlighter declarations using the TypeScript AST,
and copies the shared Markdown styles, runtime libraries, license notices and
both input-behavior references. It records the source version/commit in
vendor/sidenote-source.json. It does not modify your published .snote files.
If upstream declaration names change, extraction fails and requires review.
Changes in browser-dependent adapter behavior still require host integration work.

Review and commit the generated files after tests. This is explicit command-based
sync, not an automatic push on every main commit. No sync/build is needed merely
to replace a published .snote file.

## Files

- script.js: archive loading, navigation, theme and temporary pins/drafts.
- editor-session.js: real editor host, in-memory pasted images, mode switching.
- vendor/: generated editor, extracted theme and original SideNote CSS.
- notes/: publication manifest and .snote archives.
- scripts/: server, build, source sync and sample generation.
- tests/: archive validation and real-bundle DOM integration tests.

External image URLs need network access; attached images are resolved from ZIP
entries. Each editor image node owns and revokes its Blob URL.
npm run samples overwrites only the two sample archives: do not run it after
replacing those files with your own content. Old site artifacts remain in Git history.
