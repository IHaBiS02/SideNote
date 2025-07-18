const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const glob = require('glob');

const exec = (command) => execSync(command, { stdio: 'inherit' });

const mkdirp = 'mkdirp';

const buildDir = 'build';
const chromeDir = path.join(buildDir, 'chrome');
const firefoxDir = path.join(buildDir, 'firefox');

// Create build directories if they don't exist
if (!fs.existsSync(chromeDir)) {
    exec(`${mkdirp} ${chromeDir}`);
}
if (!fs.existsSync(firefoxDir)) {
    exec(`${mkdirp} ${firefoxDir}`);
}

// Copy common files
const commonFiles = [
    'src',
    'sidepanel.html',
    'sidepanel.css',
    'dark_mode.css',
    'images',
    'background.js',
    'LICENSE',
    'LIBRARY_LICENSES.md'
];

for (const file of commonFiles) {
    fs.cpSync(file, path.join(chromeDir, file), { recursive: true });
    fs.cpSync(file, path.join(firefoxDir, file), { recursive: true });
}


// Copy vendor files
const vendorFiles = {
    'dompurify/dist/purify.min.js': 'dompurify.min.js',
    'marked/marked.min.js': 'marked.min.js',
    'highlight.js/styles/atom-one-dark.css': 'atom-one-dark.css',
    'highlight.js/styles/atom-one-light.css': 'atom-one-light.css',
    '@highlightjs/cdn-assets/highlight.min.js': 'highlight.min.js',
    'highlightjs-line-numbers.js/dist/highlightjs-line-numbers.min.js': 'highlightjs-line-numbers.min.js',
    'jszip/dist/jszip.min.js': 'jszip.min.js',
    'webextension-polyfill/dist/browser-polyfill.min.js': 'browser-polyfill.min.js'
};

exec(`${mkdirp} ${chromeDir}/vendor`);
exec(`${mkdirp} ${firefoxDir}/vendor`);

for (const [src, dest] of Object.entries(vendorFiles)) {
    const sourcePath = path.join('node_modules', src);
    const destPathChrome = path.join(chromeDir, 'vendor', dest);
    const destPathFirefox = path.join(firefoxDir, 'vendor', dest);
    fs.copyFileSync(sourcePath, destPathChrome);
    fs.copyFileSync(sourcePath, destPathFirefox);
}

// Create manifest.json for Chrome
const chromeManifest = JSON.parse(fs.readFileSync('manifest.json', 'utf-8'));
fs.writeFileSync(path.join(chromeDir, 'manifest.json'), JSON.stringify(chromeManifest, null, 2));

// Create manifest.json for Firefox
const firefoxManifest = { ...chromeManifest };
delete firefoxManifest.side_panel;
if (firefoxManifest.background.service_worker) {
    firefoxManifest.background.scripts = [firefoxManifest.background.service_worker];
    delete firefoxManifest.background.service_worker;
}
firefoxManifest.permissions = firefoxManifest.permissions.filter(p => p !== 'sidePanel');
firefoxManifest.sidebar_action = {
    "default_panel": "sidepanel.html",
    "default_title": "SideNote",
    "default_icon": {
        "16": "images/icon16.png",
        "48": "images/icon48.png",
        "128": "images/icon128.png"
    }
};
firefoxManifest.browser_specific_settings = {
    gecko: {
        id: 'sidenote@example.com'
    }
};

if (firefoxManifest.commands && firefoxManifest.commands._execute_action) {
    firefoxManifest.commands._execute_sidebar_action = firefoxManifest.commands._execute_action;
    delete firefoxManifest.commands._execute_action;
}

fs.writeFileSync(path.join(firefoxDir, 'manifest.json'), JSON.stringify(firefoxManifest, null, 2));


const archiver = require('archiver');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
const version = packageJson.version.replace(/\./g, '_');

function createZip(sourceDir, outPath) {
    const archive = archiver('zip', { zlib: { level: 9 } });
    const stream = fs.createWriteStream(outPath);

    return new Promise((resolve, reject) => {
        archive
            .directory(sourceDir, false)
            .on('error', err => reject(err))
            .pipe(stream);

        stream.on('close', () => resolve());
        archive.finalize();
    });
}

async function main() {
    console.log('Deleting old zip files if they exist...');
    const oldChromeZips = await glob.glob('build/chrome-*.zip');
    const oldFirefoxZips = await glob.glob('build/firefox-*.zip');

    for (const file of [...oldChromeZips, ...oldFirefoxZips]) {
        try {
            fs.unlinkSync(file);
            console.log(`Deleted ${file}`);
        } catch (err) {
            console.error(`Could not delete ${file}:`, err.message);
        }
    }

    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
    const version = packageJson.version.replace(/\./g, '_');
    const chromeZipPath = path.join(buildDir, `chrome-${version}.zip`);
    const firefoxZipPath = path.join(buildDir, `firefox-${version}.zip`);

    console.log('Creating zip archives...');
    await createZip(chromeDir, chromeZipPath);
    await createZip(firefoxDir, firefoxZipPath);
    console.log('Zip archives created successfully!');
}

main().then(() => {
    console.log('Build finished successfully!');
}).catch(err => {
    console.error('Error during build:', err);
    process.exit(1);
});