import { readFile, writeFile, cp, mkdir } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const source = resolve(process.argv[2] || (() => { throw new Error('Usage: npm run sync:sidenote -- C:\\path\\to\\SideNote'); })());
const destination = fileURLToPath(new URL('../vendor/', import.meta.url));
const requireSource = createRequire(join(source, 'package.json'));
const ts = requireSource('typescript');
const pkg = JSON.parse(await readFile(join(source, 'package.json'), 'utf8'));
if (pkg.name !== 'simple-notes-extension') throw new Error('Expected the SideNote extension checkout.');
if (!process.env.npm_execpath) throw new Error('Run through npm run sync:sidenote.');
execFileSync(process.execPath, [process.env.npm_execpath, 'run', 'build:editor'], { cwd: source, stdio: 'inherit' });
await mkdir(destination, { recursive: true });
for (const [from, to] of [
  ['jszip/dist/jszip.min.js', 'jszip.min.js'],
  ['@highlightjs/cdn-assets/highlight.min.js', 'highlight.min.js'],
  ['reset-css/reset.css', 'reset.css'],
]) await cp(join(source, 'node_modules', from), join(destination, to));
for (const name of ['sidepanel.css', 'dark_mode.css', 'sidenote-controls.css']) {
  await cp(join(source, name), join(destination, name));
}
await cp(join(source, 'packages/wysiwyg-markdown/dist/wysiwyg-markdown.js'), join(destination, 'wysiwyg-markdown.js'));
await cp(join(source, 'packages/wysiwyg-markdown/dist/wysiwyg-markdown.js.map'), join(destination, 'wysiwyg-markdown.js.map'));
// Select the pure host theme/highlighter declarations using the TypeScript AST.
// Never import the extension adapter's database, state or browser API bindings.
const adapter = await readFile(join(source, 'src/editor/sidenote-editor-adapter.ts'), 'utf8');
const ast = ts.createSourceFile('adapter.ts', adapter, ts.ScriptTarget.Latest, true);
const selected = ast.statements.filter(node =>
  (ts.isFunctionDeclaration(node) && node.name?.text === 'highlightCode') ||
  (ts.isVariableStatement(node) && node.declarationList.declarations.some(d => d.name.getText(ast) === 'SIDENOTE_EDITOR_THEME')));
if (selected.length !== 2) throw new Error('Upstream adapter changed: review theme/highlighter extraction.');
const compile = text => ts.transpileModule(text, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText;
await writeFile(join(destination, 'sidenote-editor-theme.js'), compile(
  "import { createNoteContentStyles } from './note-content-styles.js';\n" + selected.map(node => node.getText(ast)).join('\n') + '\nexport { highlightCode, SIDENOTE_EDITOR_THEME };'));
await writeFile(join(destination, 'note-content-styles.js'), compile(await readFile(join(source, 'src/editor/note-content-styles.ts'), 'utf8')));
await cp(join(source, 'LIBRARY_LICENSES.md'), new URL('../licenses/sidenote-runtime.md', import.meta.url));
for (const name of ['WYSIWYG_INPUT_BEHAVIORS.md', 'WYSIWYG_INPUT_BEHAVIORS.ko.md']) {
  const intro = name.endsWith('.ko.md')
    ? '> GitHub Pages 체험: 직접 입력하거나 더블클릭으로 전체 Markdown을 수정합니다. Edit/WYSIWYG 버튼, Ctrl/Cmd+Enter, 소스 모드의 Shift+Enter 또는 Escape로 전환합니다. 수정과 붙여넣은 이미지는 노트 전환 중 유지되지만 새로고침하면 초기화됩니다. 다운로드는 게시된 원본입니다.\n\n'
    : '> GitHub Pages demo: edit directly or double-click for full Markdown. Switch with Edit/WYSIWYG, Ctrl/Cmd+Enter, or Shift+Enter/Escape in source mode. Edits and pasted images survive note navigation but reset on refresh. Downloads contain the published original.\n\n';
  await writeFile(new URL(`../${name}`, import.meta.url), intro + await readFile(join(source, 'packages/wysiwyg-markdown', name), 'utf8'));
}
await writeFile(join(destination, 'sidenote-source.json'), JSON.stringify({
  version: pkg.version,
  commit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: source, encoding: 'utf8' }).trim(),
}, null, 2) + '\n');
console.log('Synced editor, host styles, behavior references and license notices. Run tests and build before publishing.');
