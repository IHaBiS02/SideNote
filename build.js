const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const buildDir = 'build';
const compiledRuntimeDir = path.join(buildDir, 'extension-runtime');
const chromeDir = path.join(buildDir, 'chrome');
const firefoxDir = path.join(buildDir, 'firefox');
const outputDirectories = [chromeDir, firefoxDir];

for (const outputDirectory of outputDirectories) {
    fs.mkdirSync(path.join(outputDirectory, 'vendor'), { recursive: true });
}

function copyToBrowserOutputs(source, destination) {
    for (const outputDirectory of outputDirectories) {
        fs.cpSync(source, path.join(outputDirectory, destination), { recursive: true });
    }
}

const commonFiles = [
    'sidepanel.html',
    'sidepanel.css',
    'dark_mode.css',
    'images',
    'LICENSE',
    'LIBRARY_LICENSES.md'
];

for (const file of commonFiles) {
    copyToBrowserOutputs(file, file);
}

const runtimeArtifacts = [
    { source: path.join(compiledRuntimeDir, 'src'), destination: 'src' },
    { source: path.join(compiledRuntimeDir, 'background.js'), destination: 'background.js' }
];

for (const artifact of runtimeArtifacts) {
    if (!fs.existsSync(artifact.source)) {
        throw new Error(`Required compiled runtime artifact is missing: ${artifact.source}`);
    }

    copyToBrowserOutputs(artifact.source, artifact.destination);
}

const vendorFiles = {
    'reset-css/reset.css': 'reset.css',
    'dompurify/dist/purify.min.js': 'dompurify.min.js',
    'marked/marked.min.js': 'marked.min.js',
    '@highlightjs/cdn-assets/highlight.min.js': 'highlight.min.js',
    'jszip/dist/jszip.min.js': 'jszip.min.js',
    'webextension-polyfill/dist/browser-polyfill.min.js': 'browser-polyfill.min.js'
};

for (const [source, destination] of Object.entries(vendorFiles)) {
    const sourcePath = path.join('node_modules', source);
    copyToBrowserOutputs(sourcePath, path.join('vendor', destination));
}

const editorArtifacts = [
    {
        source: path.join('packages', 'wysiwyg-markdown', 'dist', 'wysiwyg-markdown.js'),
        destination: path.join('vendor', 'wysiwyg-markdown.js')
    }
];

for (const artifact of editorArtifacts) {
    if (!fs.existsSync(artifact.source)) {
        throw new Error(`Required editor build artifact is missing: ${artifact.source}`);
    }

    copyToBrowserOutputs(artifact.source, artifact.destination);
}

const chromeManifest = JSON.parse(fs.readFileSync('manifest.json', 'utf-8'));
fs.writeFileSync(
    path.join(chromeDir, 'manifest.json'),
    JSON.stringify(chromeManifest, null, 2)
);

const firefoxManifest = structuredClone(chromeManifest);
delete firefoxManifest.side_panel;
if (firefoxManifest.background.service_worker) {
    firefoxManifest.background.scripts = [firefoxManifest.background.service_worker];
    delete firefoxManifest.background.service_worker;
}
firefoxManifest.permissions = firefoxManifest.permissions.filter(
    permission => permission !== 'sidePanel'
);
firefoxManifest.sidebar_action = {
    default_panel: 'sidepanel.html',
    default_title: 'SideNote',
    default_icon: {
        16: 'images/icon16.png',
        48: 'images/icon48.png',
        128: 'images/icon128.png'
    }
};
firefoxManifest.browser_specific_settings = {
    gecko: {
        id: 'sidenote@example.com',
        data_collection_permissions: {
            required: ['none']
        }
    }
};

if (firefoxManifest.commands && firefoxManifest.commands._execute_action) {
    firefoxManifest.commands._execute_sidebar_action =
        firefoxManifest.commands._execute_action;
    delete firefoxManifest.commands._execute_action;
}

fs.writeFileSync(
    path.join(firefoxDir, 'manifest.json'),
    JSON.stringify(firefoxManifest, null, 2)
);

function createZip(sourceDirectory, outputPath) {
    const archive = archiver('zip', { zlib: { level: 9 } });
    const output = fs.createWriteStream(outputPath);

    return new Promise((resolve, reject) => {
        output.on('close', resolve);
        output.on('error', reject);
        archive.on('error', reject);
        archive.directory(sourceDirectory, false).pipe(output);
        archive.finalize();
    });
}

async function main() {
    console.log('Deleting old browser zip files if they exist...');
    const oldBrowserZips = fs.readdirSync(buildDir, { withFileTypes: true })
        .filter(entry => entry.isFile() && /^(chrome|firefox)-.*\.zip$/.test(entry.name))
        .map(entry => path.join(buildDir, entry.name));

    for (const file of oldBrowserZips) {
        fs.unlinkSync(file);
        console.log(`Deleted ${file}`);
    }

    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
    const version = packageJson.version.replace(/\./g, '_');
    const chromeZipPath = path.join(buildDir, `chrome-${version}.zip`);
    const firefoxZipPath = path.join(buildDir, `firefox-${version}.zip`);

    console.log('Creating browser zip archives...');
    await createZip(chromeDir, chromeZipPath);
    await createZip(firefoxDir, firefoxZipPath);
    console.log('Browser zip archives created successfully.');
}

main().catch(error => {
    console.error('Build failed:', error);
    process.exit(1);
});
