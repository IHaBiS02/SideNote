const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const exec = (command) => execSync(command, { stdio: 'inherit' });

const rimraf = 'rimraf';
const mkdirp = 'mkdirp';

const buildDir = 'build';
const chromeDir = path.join(buildDir, 'chrome');
const firefoxDir = path.join(buildDir, 'firefox');

// Clean up previous builds
if (fs.existsSync(buildDir)) {
    exec(`${rimraf} ${buildDir}`);
}

// Create build directories
exec(`${mkdirp} ${chromeDir}`);
exec(`${mkdirp} ${firefoxDir}`);

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
    'highlight.js/styles/atom-one-dark.min.css': 'atom-one-dark.min.css',
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
fs.writeFileSync(path.join(firefoxDir, 'manifest.json'), JSON.stringify(firefoxManifest, null, 2));

console.log('Build finished successfully!');