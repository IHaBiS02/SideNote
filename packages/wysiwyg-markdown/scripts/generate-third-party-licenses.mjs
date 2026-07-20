import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const editorRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const editorPackage = JSON.parse(
  fs.readFileSync(path.join(editorRoot, 'package.json'), 'utf8'),
);

function findPackageJson(packageName, fromDirectory) {
  const requireFromPackage = createRequire(
    path.join(fromDirectory, '__license-resolver.cjs'),
  );

  try {
    return requireFromPackage.resolve(`${packageName}/package.json`);
  } catch {
    const entryPoint = requireFromPackage.resolve(packageName);
    let currentDirectory = path.dirname(entryPoint);

    while (currentDirectory !== path.dirname(currentDirectory)) {
      const packageJsonPath = path.join(currentDirectory, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const metadata = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        if (metadata.name === packageName) return packageJsonPath;
      }
      currentDirectory = path.dirname(currentDirectory);
    }

    throw new Error(`Could not locate package metadata for ${packageName}`);
  }
}

const pending = Object.keys(editorPackage.dependencies ?? {}).map(name => ({
  name,
  fromDirectory: editorRoot,
  optional: false,
}));
const visitedPackageFiles = new Set();
const packages = new Map();

while (pending.length > 0) {
  const dependency = pending.shift();
  let packageJsonPath;

  try {
    packageJsonPath = findPackageJson(
      dependency.name,
      dependency.fromDirectory,
    );
  } catch (error) {
    if (dependency.optional) continue;
    throw error;
  }

  if (visitedPackageFiles.has(packageJsonPath)) continue;
  visitedPackageFiles.add(packageJsonPath);

  const packageDirectory = path.dirname(packageJsonPath);
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const key = `${packageJson.name}@${packageJson.version}`;
  const licenseFile = fs
    .readdirSync(packageDirectory)
    .find(file => /^licen[cs]e(?:\.|$)/i.test(file));
  const licenseText = licenseFile
    ? fs.readFileSync(path.join(packageDirectory, licenseFile), 'utf8').trim()
    : `No license file was included in the installed package. Declared license: ${packageJson.license ?? 'unknown'}`;
  const repository =
    typeof packageJson.repository === 'string'
      ? packageJson.repository
      : packageJson.repository?.url;

  packages.set(key, {
    name: packageJson.name,
    version: packageJson.version,
    license: packageJson.license ?? 'unknown',
    repository: repository?.replace(/^git\+/, '').replace(/\.git$/, ''),
    licenseText,
  });

  for (const name of Object.keys(packageJson.dependencies ?? {})) {
    pending.push({ name, fromDirectory: packageDirectory, optional: false });
  }
  for (const name of Object.keys(packageJson.optionalDependencies ?? {})) {
    pending.push({ name, fromDirectory: packageDirectory, optional: true });
  }
}

const sections = [...packages.values()]
  .sort((left, right) => left.name.localeCompare(right.name))
  .map(
    entry => `## ${entry.name} ${entry.version}

- License: ${entry.license}
${entry.repository ? `- Source: ${entry.repository}\n` : ''}
\`\`\`text
${entry.licenseText}
\`\`\``,
  );

const output = `# Third-party licenses

This distribution bundles the runtime dependencies listed below. This file is
generated from the installed workspace dependency tree by
\`packages/wysiwyg-markdown/scripts/generate-third-party-licenses.mjs\`.

${sections.join('\n\n')}
`;

fs.writeFileSync(
  path.join(editorRoot, 'THIRD_PARTY_LICENSES.md'),
  output,
  'utf8',
);
console.log(`Wrote licenses for ${sections.length} editor runtime packages.`);
