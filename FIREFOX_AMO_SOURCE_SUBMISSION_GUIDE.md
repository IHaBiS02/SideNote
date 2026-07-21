# SideNote Firefox AMO source submission guide

Checked against Mozilla documentation on 2026-07-21. Review requirements and
the default build environment can change, so verify the linked Mozilla pages
before submitting a new version.

## Why source is submitted

SideNote compiles its TypeScript extension runtime (`background.ts` and
`src/**/*.ts`) into readable JavaScript with `tsc`, and compiles the TypeScript
editor under `packages/wysiwyg-markdown/src/` into a browser bundle with Vite.
Mozilla requires readable source, a lockfile, and reproducible build
instructions when an extension uses bundling, minification, transpilation, or
similar processing.

Official references:

- [Source code submission](https://extensionworkshop.com/documentation/publish/source-code-submission/)
- [Add-on policies: Source Code Submission](https://extensionworkshop.com/documentation/publish/add-on-policies/#3-1-source-code-submission)
- [Submitting an add-on](https://extensionworkshop.com/documentation/publish/submitting-an-add-on/)

## Create the release files

From the SideNote repository root:

```powershell
npm.cmd ci
npm.cmd run test:run
npm.cmd run typecheck
npm.cmd run build
```

`build` creates all browser builds and the reviewer source archive:

```text
build/chrome-<version>.zip
build/firefox-<version>.zip
build/sidenote-<version>-source.zip
```

The source ZIP is built from an allow-list. It includes SideNote and editor
source, build configuration, package manifests, the workspace lockfile, and an
automatically generated `README-AMO.md`. It excludes `.git`, `node_modules`,
existing `build`/`dist` output, and the generated editor bundle.

## Reproduce from the submitted source ZIP

Extract `sidenote-<version>-source.zip`, open a terminal at its root, and run:

```bash
npm ci
npm run build
```

The result is `build/firefox-<version-with-underscores>.zip`. The editor is
compiled first, then `tsc` emits the SideNote runtime to
`build/extension-runtime/`; `build.js` copies only the generated JavaScript into
the extension package. There is no second repository, nested install, or manual
synchronization step.

The generated `README-AMO.md` records Mozilla's reviewer environment used when
this workflow was prepared:

- Ubuntu 24.04.4 LTS, ARM64
- Node.js 24.14.0
- npm 11.9.0

All dependencies are public packages from the npm registry and are pinned by
the root `package-lock.json`.

## Upload to AMO

For each release, upload both:

1. `build/firefox-<version>.zip` as the extension package.
2. `build/sidenote-<version>-source.zip` when AMO asks for source code.

In Notes for Reviewers, state that the repository is an npm workspace and the
complete build is `npm ci` followed by `npm run build`. Mention that
`background.js` and `src/**/*.js` in the built extension are generated from the
root TypeScript sources, while `vendor/wysiwyg-markdown.js` is generated from
`packages/wysiwyg-markdown/src/`.

The current editor source layout and host boundary are documented in
`packages/wysiwyg-markdown/ARCHITECTURE.md`.

Before uploading, extract the source ZIP into a clean directory, execute only
the included README commands, and compare the rebuilt `build/firefox/` files
with the release build by path and SHA-256 hash.
