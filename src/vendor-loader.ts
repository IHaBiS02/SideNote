type VendorReadyCheck = () => boolean;

const loadingVendors = new Map<string, Promise<void>>();

function loadVendorScript(
  name: string,
  source: string,
  isReady: VendorReadyCheck,
): Promise<void> {
  if (isReady()) return Promise.resolve();

  const existingPromise = loadingVendors.get(name);
  if (existingPromise) return existingPromise;

  const promise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = source;
    script.async = true;
    script.dataset.sidenoteVendor = name;
    script.addEventListener('load', () => {
      if (isReady()) {
        resolve();
      } else {
        reject(new Error(`${name} loaded without exposing its browser API`));
      }
    }, { once: true });
    script.addEventListener('error', () => {
      reject(new Error(`Could not load vendor script: ${source}`));
    }, { once: true });
    document.head.appendChild(script);
  }).catch((error) => {
    loadingVendors.delete(name);
    document.querySelector(`script[data-sidenote-vendor="${name}"]`)?.remove();
    throw error;
  });

  loadingVendors.set(name, promise);
  return promise;
}

function ensureJsZipLoaded(): Promise<void> {
  return loadVendorScript(
    'jszip',
    'vendor/jszip.min.js',
    () => typeof globalThis.JSZip?.loadAsync === 'function',
  );
}

async function ensureMarkdownRenderersLoaded(): Promise<void> {
  await Promise.all([
    loadVendorScript(
      'marked',
      'vendor/marked.min.js',
      () => typeof globalThis.marked?.parse === 'function',
    ),
    loadVendorScript(
      'dompurify',
      'vendor/dompurify.min.js',
      () => typeof globalThis.DOMPurify?.sanitize === 'function',
    ),
  ]);
}

async function ensureHtml2PdfLoaded(): Promise<void> {
  if (typeof globalThis.html2pdf === 'function') return;
  await loadVendorScript(
    'html2pdf',
    'vendor/html2pdf.bundle.min.js',
    () => typeof globalThis.html2pdf === 'function',
  );
}

export {
  ensureHtml2PdfLoaded,
  ensureJsZipLoaded,
  ensureMarkdownRenderersLoaded,
  loadVendorScript,
};
