// === 유틸리티 함수들 ===

/**
 * Gets a timestamp string.
 * @returns {string} The timestamp string.
 */
function getTimestamp() {
  // 날짜/시간을 YYYY_MM_DD_HH_MM_SS 형식으로 변환
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
  // 파일명에 사용할 수 없는 문자를 언더스코어(_)로 대체
  return filename.replace(/[/\\?%*:|"<>]/g, '_');
}

/**
 * Downloads a file.
 * @param {Blob} blob The blob to download.
 * @param {string} fileName The name of the file.
 */
function downloadFile(blob, fileName) {
  // 임시 <a> 태그를 생성하여 파일 다운로드
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);  // Blob을 URL로 변환
  a.download = fileName;
  a.click();  // 자동 클릭으로 다운로드 수행
  URL.revokeObjectURL(a.href);  // 메모리 정리를 위해 URL 제거
}

/**
 * Extracts image IDs from a string of content.
 * @param {string} content The content to extract image IDs from.
 * @returns {Array<string>} An array of image IDs.
 */
function extractImageIds(content) {
  // 마크다운 이미지 문법에서 이미지 ID 추출
  const imageRegex = /!\[.*?\]\(images\/(.*?)\.png\)/g;
  const ids = new Set();  // 중복 제거를 위해 Set 사용
  let match;
  while ((match = imageRegex.exec(content)) !== null) {
    ids.add(match[1]);  // 캡쳐그룹에서 이미지 ID 추출
  }
  return Array.from(ids);  // Set을 배열로 변환하여 반환
}

// Export all functions
export {
  getTimestamp,
  sanitizeFilename,
  downloadFile,
  extractImageIds
};
