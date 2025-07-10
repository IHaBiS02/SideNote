// Initialize the database when the script loads
initDB().then(() => {
  loadAndMigrateData();
  cleanupDeletedImages();
}).catch(err => console.error("Failed to initialize DB:", err));

/**
 * Loads data from storage and migrates it to IndexedDB if necessary.
 */
async function loadAndMigrateData() {
  // Load settings from storage
  chrome.storage.local.get(['globalSettings', 'notes', 'deletedNotes'], async (data) => {
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

    const loadedNotes = data.notes;
    const loadedDeletedNotes = data.deletedNotes;

    // One-time migration from chrome.storage.local to IndexedDB
    if (loadedNotes || loadedDeletedNotes) {
      const allNotesToMigrate = (loadedNotes || []).concat(loadedDeletedNotes || []);
      if (allNotesToMigrate.length > 0) {
        try {
          for (const note of allNotesToMigrate) {
            await saveNote(note);
          }
          chrome.storage.local.remove(['notes', 'deletedNotes']);
        } catch (err) {
          console.error("Failed to migrate notes to IndexedDB:", err);
        }
      }
    }

    // Load all notes from IndexedDB
    const allNotesFromDB = await getAllNotes();
    notes = allNotesFromDB.filter(note => !note.metadata.deletedAt);
    deletedNotes = allNotesFromDB.filter(note => note.metadata.deletedAt);

    sortNotes();
    renderNoteList();
    applyMode(globalSettings.mode);
    cleanupDeletedNotes();
  });
}

/**
 * Deletes images that have been in the recycle bin for more than 30 days.
 */
async function cleanupDeletedImages() {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const imageObjects = await getAllImageObjectsFromDB();
    const imagesToDelete = imageObjects.filter(img => img.deletedAt && img.deletedAt < thirtyDaysAgo);
    for (const image of imagesToDelete) {
        await deleteImagePermanently(image.id);
    }
}

/**
 * Deletes notes that have been in the recycle bin for more than 30 days.
 */
async function cleanupDeletedNotes() {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const notesToDelete = deletedNotes.filter(note => note.metadata.deletedAt < thirtyDaysAgo);
    for (const note of notesToDelete) {
        await deleteNotePermanentlyDB(note.id);
    }
    deletedNotes = deletedNotes.filter(note => note.metadata.deletedAt >= thirtyDaysAgo);
}

showListView();


// Initial setup
updateAutoLineBreakButton();
updateTildeReplacementButton();
applyFontSize(globalSettings.fontSize || 12);
applyMode(globalSettings.mode || 'system');
renderNoteList();