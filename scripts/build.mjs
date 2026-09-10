import { cp, mkdir, rm } from 'node:fs/promises';
// GitHub Pages serves the branch root directly. dist is an optional portable copy.
const destination = new URL('../dist/', import.meta.url);
// This fixed path is only the generated site output, never the source root.
await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
for (const name of ['index.html', 'style.css', 'script.js', 'vendor', 'licenses', 'notes', 'assets', 'LIBRARY_LICENSES.md', 'LICENSE', '.nojekyll']) {
  await cp(new URL(`../${name}`, import.meta.url), new URL(name, destination), { recursive: true });
}
console.log('Static site copied to dist/. GitHub Pages can also serve the branch root.');
