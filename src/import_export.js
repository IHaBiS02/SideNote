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
  const newNote = {
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

  await saveNote(newNote);
  return newNote;
}
