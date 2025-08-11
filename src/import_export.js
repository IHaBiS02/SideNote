/**
 * Processes a .snote or .snotes file.
 * @param {JSZip} zip The JSZip object representing the zip file.
 * @returns {Promise<object>} A promise that resolves with the new note object.
 */
// .snote 파일 처리 (단일 노트 또는 전체 가져오기에서 사용)
async function processSnote(zip) {
  // 필수 파일 확인: metadata.json과 note.md
  const metadataFile = zip.file('metadata.json');
  const noteFile = zip.file('note.md');

  // 필수 파일이 없으면 오류 발생
  if (!metadataFile || !noteFile) {
    throw new Error('Invalid .snote format: missing metadata.json or note.md');
  }

  // 메타데이터와 노트 내용 읽기
  const metadata = JSON.parse(await metadataFile.async('string'));
  const content = await noteFile.async('string');
  
  // 이미지 폴더가 있으면 모든 이미지 처리
  const imagesFolder = zip.folder('images');
  if (imagesFolder) {
    const imagePromises = [];
    imagesFolder.forEach((relativePath, imageFile) => {
        if (!imageFile.dir) {  // 파일일 경우만 처리 (폴더 제외)
            // 이미지 ID 추출 (images/[id].png 형식)
            const imageId = imageFile.name.split('/').pop().replace('.png', '');
            const promise = imageFile.async('blob').then(blob => {
                return saveImage(imageId, blob);
            });
            imagePromises.push(promise);
        }
    });
    // 모든 이미지 저장 완료 대기
    await Promise.all(imagePromises);
  }

  // 새 노트 객체 생성
  const now = Date.now();
  const newNote = {
    id: crypto.randomUUID(),  // 새 UUID 생성 (중복 방지)
    title: metadata.title,
    content: content,
    settings: metadata.settings,
    metadata: {
      createdAt: metadata.metadata?.createdAt || now,  // 원래 생성 시간 유지 또는 현재 시간
      lastModified: metadata.metadata?.lastModified || now
    },
    isPinned: false  // 가져온 노트는 고정되지 않음
  };

  // 데이터베이스에 저장
  await saveNote(newNote);
  return newNote;
}