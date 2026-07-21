import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import archiver from 'archiver';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = path.join(root, 'build');
const stagingDirectory = path.join(outputDirectory, '.amo-source-staging');
const fixedArchiveDate = new Date('2000-01-01T00:00:00.000Z');

const sourceEntries = [
  'LICENSE',
  'LIBRARY_LICENSES.md',
  'README.md',
  'FIREFOX_AMO_SOURCE_SUBMISSION_GUIDE.md',
  'background.ts',
  'build.js',
  'dark_mode.css',
  'images',
  'manifest.json',
  'package.json',
  'package-lock.json',
  'shortcut-setup.css',
  'shortcut-setup.html',
  'sidepanel.css',
  'sidepanel.html',
  'src',
  'tests',
  'tsconfig.extension.json',
  'vitest.config.js',
  'scripts/create-amo-source-package.mjs',
  'packages/wysiwyg-markdown/LICENSE',
  'packages/wysiwyg-markdown/README.md',
  'packages/wysiwyg-markdown/README.ko.md',
  'packages/wysiwyg-markdown/ARCHITECTURE.md',
  'packages/wysiwyg-markdown/package.json',
  'packages/wysiwyg-markdown/src',
  'packages/wysiwyg-markdown/tests',
  'packages/wysiwyg-markdown/scripts/generate-third-party-licenses.mjs',
  'packages/wysiwyg-markdown/tsconfig.json',
  'packages/wysiwyg-markdown/tsconfig.build.json',
  'packages/wysiwyg-markdown/vite.config.ts',
  'packages/wysiwyg-markdown/vitest.config.ts',
];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function assertDirectoryInside(parent, candidate) {
  const relative = path.relative(parent, candidate);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`Refusing to modify a path outside ${parent}: ${candidate}`);
  }
}

function copyEntry(relativePath) {
  const source = path.join(root, relativePath);
  const destination = path.join(stagingDirectory, relativePath);

  if (!fs.existsSync(source)) {
    throw new Error(`Required AMO source entry is missing: ${source}`);
  }

  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.cpSync(source, destination, { recursive: true, dereference: true });
}

function gitValue(args) {
  const result = spawnSync(
    'git',
    ['-c', `safe.directory=${root}`, '-C', root, ...args],
    { encoding: 'utf8', shell: false },
  );

  return result.status === 0 ? result.stdout.trim() : null;
}

function repositoryMetadata() {
  const commit = gitValue(['rev-parse', 'HEAD']);
  const status = gitValue(['status', '--porcelain', '--', ...sourceEntries]);
  return {
    commit,
    dirty: status === null ? null : status.length > 0,
  };
}

function npmVersion() {
  const npmCli = process.env.npm_execpath;
  const command = npmCli
    ? process.execPath
    : process.platform === 'win32'
      ? 'npm.cmd'
      : 'npm';
  const args = npmCli ? [npmCli, '--version'] : ['--version'];
  const result = spawnSync(command, args, {
    encoding: 'utf8',
    shell: !npmCli && process.platform === 'win32',
  });
  return result.status === 0 ? result.stdout.trim() : 'unknown';
}

function reviewerReadme(version, archiveVersion) {
  return `# SideNote ${version} - AMO Source Build Instructions

This archive contains the readable first-party source and build scripts needed
to reproduce the Firefox extension package submitted to addons.mozilla.org.

## Required environment

Mozilla's default reviewer environment when this archive was prepared:

- Ubuntu 24.04.4 LTS, ARM64
- Node.js 24.14.0
- npm 11.9.0

The build uses cross-platform Node.js APIs. Network access is used only by
\`npm ci\` to download public packages from the official npm registry.

## Build

Extract the archive, open a terminal in the directory containing this README,
and run:

\`\`\`bash
npm ci
npm run build
\`\`\`

The command creates:

- Firefox build directory: \`build/firefox/\`
- Firefox package: \`build/firefox-${archiveVersion}.zip\`
- Reviewer source package: \`build/sidenote-${version}-source.zip\`

The first command installs the exact versions in the included workspace
lockfile. The build compiles \`background.ts\` and \`src/**/*.ts\` with
TypeScript, then compiles \`packages/wysiwyg-markdown/src/**/*.ts\` with Vite
and TypeScript before packaging the extension. Generated JavaScript and the
editor bundle are not included as source.

All third-party dependencies are public, unmodified packages declared in the
included \`package.json\` files and locked by the root \`package-lock.json\`.
No private package, private registry, web-based build tool, or remotely
executed runtime code is used.

Optional verification:

\`\`\`bash
npm run typecheck
npm run test:run
\`\`\`
`;
}

function collectFiles(directory, relativeDirectory = '') {
  const absoluteDirectory = path.join(directory, relativeDirectory);
  const entries = fs
    .readdirSync(absoluteDirectory, { withFileTypes: true })
    .sort((left, right) => left.name.localeCompare(right.name, 'en'));
  const files = [];

  for (const entry of entries) {
    const relativePath = path.join(relativeDirectory, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectFiles(directory, relativePath));
    } else if (entry.isFile()) {
      files.push(relativePath);
    } else {
      throw new Error(`Unsupported source entry type: ${relativePath}`);
    }
  }

  return files;
}

async function createZip(sourceDirectory, outputPath) {
  const files = collectFiles(sourceDirectory);
  const output = fs.createWriteStream(outputPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  await new Promise((resolve, reject) => {
    output.on('close', resolve);
    output.on('error', reject);
    archive.on('error', reject);
    archive.on('warning', (error) => {
      if (error.code === 'ENOENT') {
        console.warn(error.message);
      } else {
        reject(error);
      }
    });

    archive.pipe(output);
    for (const relativePath of files) {
      archive.append(fs.readFileSync(path.join(sourceDirectory, relativePath)), {
        name: relativePath.split(path.sep).join('/'),
        date: fixedArchiveDate,
        mode: 0o100644,
      });
    }
    archive.finalize();
  });

  return files.length;
}

const packageJson = readJson(path.join(root, 'package.json'));
const manifest = readJson(path.join(root, 'manifest.json'));
const editorPackage = readJson(
  path.join(root, 'packages', 'wysiwyg-markdown', 'package.json'),
);

if (packageJson.version !== manifest.version) {
  throw new Error(
    `SideNote version mismatch: package.json=${packageJson.version}, ` +
      `manifest.json=${manifest.version}`,
  );
}

const archiveVersion = packageJson.version.replaceAll('.', '_');
const outputPath = path.join(
  outputDirectory,
  `sidenote-${packageJson.version}-source.zip`,
);

fs.mkdirSync(outputDirectory, { recursive: true });
assertDirectoryInside(outputDirectory, stagingDirectory);
fs.rmSync(stagingDirectory, { recursive: true, force: true });
fs.mkdirSync(stagingDirectory, { recursive: true });

try {
  for (const entry of sourceEntries) {
    copyEntry(entry);
  }

  const metadata = {
    sideNoteVersion: packageJson.version,
    editorVersion: editorPackage.version,
    repository: repositoryMetadata(),
    sourcePackager: {
      platform: process.platform,
      architecture: process.arch,
      osRelease: os.release(),
      node: process.version,
      npm: npmVersion(),
    },
    reviewerEnvironment: {
      operatingSystem: 'Ubuntu 24.04.4 LTS',
      architecture: 'arm64',
      node: '24.14.0',
      npm: '11.9.0',
    },
  };

  fs.writeFileSync(
    path.join(stagingDirectory, 'BUILD_METADATA.json'),
    `${JSON.stringify(metadata, null, 2)}\n`,
    'utf8',
  );
  fs.writeFileSync(
    path.join(stagingDirectory, 'README-AMO.md'),
    reviewerReadme(packageJson.version, archiveVersion),
    'utf8',
  );

  fs.rmSync(outputPath, { force: true });
  const fileCount = await createZip(stagingDirectory, outputPath);
  const size = fs.statSync(outputPath).size;

  console.log('AMO source package created.');
  console.log(`Archive: ${path.relative(root, outputPath)}`);
  console.log(`Files:   ${fileCount}`);
  console.log(`Size:    ${size} bytes`);
} finally {
  fs.rmSync(stagingDirectory, { recursive: true, force: true });
}
