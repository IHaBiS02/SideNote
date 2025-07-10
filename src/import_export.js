function getTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}_${month}_${day}_${hours}_${minutes}_${seconds}`;
}

function sanitizeFilename(filename) {
  return filename.replace(/[\\/\\?%*:|"<>]/g, '_');
}

function downloadFile(blob, fileName) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
}

function extractImageIds(content) {
  const imageRegex = /!\[.*?\]\(images\/(.*?)\.png\)/g;
  const ids = new Set();
  let match;
  while ((match = imageRegex.exec(content)) !== null) {
    ids.add(match[1]);
  }
  return Array.from(ids);
}

async function processSnote(zip) {
  const metadataFile = zip.file('metadata.json');
  const noteFile = zip.file('note.md');

  if (!metadataFile || !noteFile) {
    throw new Error('Invalid .snote format: missing metadata.json or note.md');
  }

  const metadata = JSON.parse(await metadataFile.async('string'));
  const content = await noteFile.async('string');
  
  const imagesFolder = zip.folder('images');
  if (imagesFolder) {
    const imagePromises = [];
    imagesFolder.forEach((relativePath, imageFile) => {
        if (!imageFile.dir) {
            const imageId = imageFile.name.split('/').pop().replace('.png', '');
            const promise = imageFile.async('blob').then(blob => {
                return saveImage(imageId, blob);
            });
            imagePromises.push(promise);
        }
    });
    await Promise.all(imagePromises);
  }

  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    title: metadata.title,
    content: content,
    settings: metadata.settings,
    metadata: {
      createdAt: metadata.metadata?.createdAt || now,
      lastModified: metadata.metadata?.lastModified || now
    },
    isPinned: false
  };
}