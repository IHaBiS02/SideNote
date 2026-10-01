# Gemini repository instructions

The canonical development and repository instructions are maintained in
[`AGENTS.md`](./AGENTS.md). Read that file completely before changing this
repository; do not maintain a separate copy of its architecture, testing,
versioning, or commit rules here.

Current architecture references:

- [`STRUCTURE.md`](./STRUCTURE.md): repository and runtime structure
- [`Functions.md`](./Functions.md): application functions and editor API
- [`packages/wysiwyg-markdown/ARCHITECTURE.md`](./packages/wysiwyg-markdown/ARCHITECTURE.md): Lit/ProseMirror editor internals

Local development uses Node.js and npm on Windows, macOS, or Linux. The root
`npm run build` command builds the editor, Chrome/Firefox extensions, and the
Firefox AMO reviewer source archive.
