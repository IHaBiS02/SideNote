# SideNote published notes

A static GitHub Pages site on `gh-pages`. Its left-hand list reuses SideNote 4.5.1's
original CSS, pin/paperclip/trash icons, 51px header, 41px bottom toolbar and row padding. Selecting a note
loads its `.snote` archive and displays the title, Markdown and attached images.
On small screens the list is above the reader. Light, dark and system themes
are available, and note links use hashes so refresh and back/forward work on Pages.
Open the gear button for theme settings. The disk button downloads the selected
note. Add/import/delete controls are inactive because publication is managed in
the repository. Visitors can toggle pins by mouse or keyboard. Pinned notes sort
first; both groups retain manifest order. Changes are memory-only and reset to
publisher defaults on refresh. Pinning keeps the current note open. Browser-owned panel chrome
(the browser's outer title bar and rounded frame) is not part of the website.

## Publish a note

1. Export a note from SideNote as `.snote`.
2. Place it under `notes/`, for example `notes/my-note.snote`.
3. Add an entry to `notes/index.json`:

```json
{ "id": "my-note", "title": "My note", "file": "notes/my-note.snote", "pinned": false }
```

Use unique lowercase IDs with hyphens. File names may contain ASCII letters,
numbers, hyphens and underscores. The array controls order within each pin group;
`pinned: true` places a note in the upper group. The list title comes from this manifest to avoid downloading
every archive at startup; the reader title comes from `metadata.json`.
To update a note, replace its `.snote` file. To remove one, delete its entry and file.
Only published files are read; this site has no access to extension storage.
Everything committed to this site is public, including downloadable archives.

## Local development and deployment

Use Node.js 24. Runtime libraries are included locally; `npm ci` installs jsdom
for the reader integration tests.

```powershell
npm ci
npm run dev
npm run test:run
npm run build
```

Open `http://127.0.0.1:4173` (opening index.html with file:// cannot fetch archives).
The optional build replaces the generated `dist/` folder with public assets. For GitHub Pages use
Settings → Pages → Deploy from a branch → `gh-pages` → `/ (root)`.
Push this branch normally; no extension release tag is needed. Site version is
independent of the extension version, and this branch has no extension manifest.

`npm run samples` regenerates only the bundled welcome/publishing examples.
Do not run it after replacing those examples with your own files.

## Structure and behavior

- `index.html`, `style.css`: responsive two-pane layout based on SideNote 4.5.1.
- `script.js`: list navigation, theme preferences, ZIP loading, sanitized Markdown,
  archive image URLs, highlighting and code copying. URLs are revoked on note switch.
- `notes/index.json`, `notes/*.snote`: published content.
- `vendor/`, `licenses/`: local libraries and their original notices; no CDN requests.
- `scripts/`: local server, static build and reproducible sample archive generation.
- `tests/`: publication validation and reader integration tests for archive images,
  settings, navigation races, code copying, themes, malformed files and sanitized HTML.

The archive format is SideNote's `metadata.json`, `note.md`, and optional `images/`.
Font size, paragraph/code line heights and code-header visibility are respected.
Rendering uses SideNote's existing Marked/DOMPurify approach; this website is a
reader, not the Lit/ProseMirror editor. `vendor/sidepanel.css`, `vendor/dark_mode.css`
and `vendor/sidenote-controls.css` are unchanged copies from `main` at 4.5.1.
`style.css` adapts their positioning for the two-pane website and styles the Markdown
reader. Refresh these copies explicitly when matching future extension styles.
Code blocks wrap and include a copy button. Task checkboxes are read-only.
External image URLs still need network access; archive images are self-contained.

The old website, screenshots, tracked node_modules and extension build artifacts
were removed in the replacement commit. They remain recoverable in Git history.
