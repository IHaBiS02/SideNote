// Re-export all functions from sub-modules for backward compatibility
// Database initialization
export { initDB, closeDB } from './init.js';
// Notes operations
export { saveNote, getNote, getAllNotes, getAllNoteSummaries, deleteNoteDB, restoreNoteDB, deleteNotePermanentlyDB } from './notes.js';
// Image operations
export { saveImage, getImage, deleteImage, restoreImage, deleteImagePermanently, getAllImageObjectsFromDB, getDeletedImageIdsFromDB, } from './images.js';
