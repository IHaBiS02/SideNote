// Initialize the database when the script loads
initDB().then(() => {
  cleanupDeletedNotes();
  cleanupDeletedImages();
}).catch(err => console.error("Failed to initialize DB:", err));

// Load notes and settings from storage
chrome.storage.local.get(['notes', 'deletedNotes', 'globalSettings'], (data) => {
  const loadedNotes = data.notes;
  const loadedDeletedNotes = data.deletedNotes;
  const loadedSettings = data.globalSettings;

  if (loadedSettings) {
    globalSettings = loadedSettings;
  } else {
    globalSettings = {
      title: 'default',
      fontSize: 12,
      autoLineBreak: true,
      tildeReplacement: true,
      autoAddSpaces: true,
      preventUsedImageDeletion: true,
      mode: 'system'
    };
  }

  if (loadedDeletedNotes) {
    deletedNotes = loadedDeletedNotes;
  } else {
    deletedNotes = [];
  }
  
  if (!loadedNotes) {
    notes = [];
  } else if (typeof loadedNotes === 'string') {
    const now = Date.now();
    const content = loadedNotes;
    const title = content.trim().split('\n')[0].substring(0, 30) || 'Imported Note';
    notes = [{
      id: crypto.randomUUID(),
      title: title,
      content: content,
      settings: {},
      metadata: {
        createdAt: now,
        lastModified: now
      },
      isPinned: false
    }];
  } else if (Array.isArray(loadedNotes)) {
    notes = loadedNotes.map(note => {
      note.isPinned = note.isPinned || false;
      if (note.metadata && note.metadata.createdAt && note.metadata.lastModified) {
        return note;
      }
      const now = Date.now();
      let timestamp = now;
      if (typeof note.id === 'string') {
        const idNumber = parseInt(note.id.replace('migrated-', ''));
        if (!isNaN(idNumber)) {
          timestamp = idNumber;
        }
      }
      return {
        ...note,
        id: note.id || crypto.randomUUID(),
        settings: note.settings || {},
        metadata: {
          createdAt: timestamp,
          lastModified: timestamp
        }
      };
    });
  } else {
    notes = [];
  }
  sortNotes();
  renderNoteList();
  applyMode(globalSettings.mode);
  cleanupDeletedNotes();
});

async function cleanupDeletedImages() {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const imageObjects = await getAllImageObjectsFromDB();
    const imagesToDelete = imageObjects.filter(img => img.deletedAt && img.deletedAt < thirtyDaysAgo);
    for (const image of imagesToDelete) {
        await deleteImagePermanently(image.id);
    }
}

showListView();


// Initial setup
updateAutoLineBreakButton();
updateTildeReplacementButton();
applyFontSize(globalSettings.fontSize || 12);
applyMode(globalSettings.mode || 'system');
renderNoteList();