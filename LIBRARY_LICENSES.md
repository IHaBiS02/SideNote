# Library licenses

SideNote website code is MIT licensed; see [LICENSE](LICENSE).
Runtime distributions are copied from the SideNote checkout recorded in
vendor/sidenote-source.json. The actual editor bundles Lit, ProseMirror,
Markdown-it and their dependencies. Their full upstream notices are included in
[SideNote runtime licenses](licenses/sidenote-runtime.md) and refreshed by
npm run sync:sidenote. The site's source remains MIT; each dependency retains
its own license. The complete app includes its on-demand HTML/PDF and archive
export libraries, not just the editor. Their transitive notices are included in
the runtime document and `app/vendor/` distributions.

| Library | License used | Full notice |
| --- | --- | --- |
| JSZip 3.10.1 | MIT (dual MIT/GPL; MIT selected) | [JSZip](licenses/jszip.txt) |
| Marked 10.0.0 | MIT | [Marked](licenses/marked.txt) |
| DOMPurify 3.4.12 | Apache-2.0 (dual Apache/MPL; Apache selected) | [DOMPurify](licenses/dompurify.txt) |
| highlight.js 11.11.1 | BSD-3-Clause | [highlight.js](licenses/highlight.txt) |
| reset-css 5.0.2 | Unlicense | [reset-css](licenses/reset.txt) |
| fake-indexeddb 6.2.5 | Apache-2.0 | [fake-indexeddb](licenses/fake-indexeddb.txt) |

fake-indexeddb supplies a fresh in-memory IndexedDB factory shared by the two
app frames. Its Apache-2.0 license permits distribution alongside the MIT app;
the library remains Apache-2.0 and its complete license must be retained.
The sync command bundles it without changing its source. esbuild is a build-only
tool (MIT), not a separately loaded website runtime dependency.

JSZip's bundled distribution retains its embedded dependency notices. All notices
above must accompany redistribution. These licenses permit use in this MIT site;
their individual terms continue to apply to their respective libraries.
