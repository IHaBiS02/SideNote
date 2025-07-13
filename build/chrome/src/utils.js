/**
 * Gets a timestamp string.
 * @returns {string} The timestamp string.
 */
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

/**
 * Sanitizes a filename.
 * @param {string} filename The filename to sanitize.
 * @returns {string} The sanitized filename.
 */
function sanitizeFilename(filename) {
  return filename.replace(/[/\\?%*:|"<>]/g, '_');
}

/**
 * Downloads a file.
 * @param {Blob} blob The blob to download.
 * @param {string} fileName The name of the file.
 */
function downloadFile(blob, fileName) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
}

/**
 * Extracts image IDs from a string of content.
 * @param {string} content The content to extract image IDs from.
 * @returns {Array<string>} An array of image IDs.
 */
function extractImageIds(content) {
  const imageRegex = /!\[.*?\]\(images\/(.*?)\.png\)/g;
  const ids = new Set();
  let match;
  while ((match = imageRegex.exec(content)) !== null) {
    ids.add(match[1]);
  }
  return Array.from(ids);
}
