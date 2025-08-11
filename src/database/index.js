// Re-export all functions from sub-modules for backward compatibility

// Database initialization
export { initDB } from './init.js';

// Notes operations
export {
  saveNote,
  getAllNotes,
  deleteNoteDB,
  restoreNoteDB,
  deleteNotePermanentlyDB
} from './notes.js';

// Image operations
export {
  saveImage,
  getImage,
  deleteImage,
  restoreImage,
  deleteImagePermanently,
  getAllImageObjectsFromDB
} from './images.js';