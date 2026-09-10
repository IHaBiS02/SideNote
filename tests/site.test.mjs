import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const JSZip = require('../vendor/jszip.min.js');
const notes = JSON.parse(await readFile(new URL('../notes/index.json', import.meta.url), 'utf8'));
test('published notes have unique routes and valid SideNote archives', async () => {
  const ids = new Set();
  assert.ok(notes.length > 0);
  for (const note of notes) {
    assert.match(note.id, /^[a-z0-9-]+$/);
    assert.equal(ids.has(note.id), false);
    ids.add(note.id);
    assert.match(note.file, /^notes\/[a-zA-Z0-9_-]+\.snote$/);
    const archive = await JSZip.loadAsync(await readFile(new URL(`../${note.file}`, import.meta.url)));
    const metadata = JSON.parse(await archive.file('metadata.json').async('string'));
    assert.equal(typeof metadata.title, 'string');
    const markdown = await archive.file('note.md').async('string');
    for (const match of markdown.matchAll(/!\[[^\]]*\]\((images\/[^)]+)\)/g)) {
      assert.ok(archive.file(match[1]), `Missing attachment ${match[1]}`);
    }
  }
});
