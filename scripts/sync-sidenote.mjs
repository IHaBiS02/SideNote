import { readFile, writeFile, cp, mkdir, rm } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const source = resolve(process.argv[2] || (() => { throw new Error('Pass the SideNote source directory.'); })());
const root = fileURLToPath(new URL('../', import.meta.url));
const requireSource = createRequire(join(source, 'package.json'));
const pkg = JSON.parse(await readFile(join(source, 'package.json'), 'utf8'));
if (pkg.name !== 'simple-notes-extension' || !process.env.npm_execpath) throw new Error('Run via npm with a SideNote checkout.');
for (const command of ['build:editor', 'build:extension']) execFileSync(process.execPath, [process.env.npm_execpath, 'run', command], { cwd: source, stdio: 'inherit' });
// Fixed generated directories only. Never remove published notes.
for (const name of ['app', 'vendor']) {
  await rm(join(root, name), { recursive: true, force: true });
  await mkdir(join(root, name), { recursive: true });
}
await cp(join(source, 'build/chrome'), join(root, 'app'), { recursive: true });
const html = await readFile(join(root, 'app/sidepanel.html'), 'utf8');
if (!html.includes('src="src/main.js"') || !html.includes('src="vendor/browser-polyfill.min.js"')) throw new Error('Upstream entry points changed.');
await writeFile(join(root, 'app/sidepanel.html'), html.replace('src="vendor/browser-polyfill.min.js"', 'src="../web-platform.js"').replace('src="src/main.js"', 'src="../app-bootstrap.js"'));
// Apache-2.0 is compatible with this MIT site; retain the complete notice.
requireSource('esbuild').buildSync({ stdin: { contents: 'export { IDBFactory, IDBKeyRange } from "fake-indexeddb";', resolveDir: source }, bundle: true, platform: 'browser', format: 'iife', globalName: 'SideNoteMemoryDB', outfile: join(root, 'vendor/memory-db.js'), legalComments: 'inline' });
await cp(join(source, 'node_modules/fake-indexeddb/LICENSE'), join(root, 'licenses/fake-indexeddb.txt'));
await cp(join(source, 'LIBRARY_LICENSES.md'), join(root, 'licenses/sidenote-runtime.md'));
for (const name of ['WYSIWYG_INPUT_BEHAVIORS.md', 'WYSIWYG_INPUT_BEHAVIORS.ko.md']) {
  const intro = name.endsWith('.ko.md') ? '> 사이트는 SideNote 원본 앱의 설정·탐색·편집·내보내기를 사용합니다. 노트·이미지·설정은 메모리에 저장되며 새로고침 시 초기화됩니다. 브라우저 전역 확장 단축키는 웹페이지에서 등록할 수 없습니다.\n\n' : '> This site runs the original SideNote app, including settings, navigation, editing and exports. Notes, images and settings use memory storage and reset on reload. A website cannot register browser-wide extension shortcuts.\n\n';
  await writeFile(join(root, name), intro + await readFile(join(source, 'packages/wysiwyg-markdown', name), 'utf8'));
}
await writeFile(join(root, 'vendor/sidenote-source.json'), JSON.stringify({ version: pkg.version, commit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: source, encoding: 'utf8' }).trim() }, null, 2) + '\n');
console.log('Synced the complete extension app, storage adapter license and behavior references.');
