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