// Import database helpers
import { dbTransaction } from './init.js';
import type { Note } from '../types.js';

/**
 * Retrieves a note object from the database by its ID.
 * @param {string} id The ID of the note to retrieve.
 * @returns {Promise<object>} A promise that resolves with the note object.
 */
function _getNoteObject(id: string): Promise<Note | undefined> {
    return dbTransaction('notes', 'readonly', (store) => store.get(id) as IDBRequest<Note | undefined>);
}

/**
 * Saves a note object to the database.
 * @param {object} note The note object to save.
 * @returns {Promise<void>} A promise that resolves when the note is saved.
 */
function saveNote(note: Note): Promise<IDBValidKey> {
    return dbTransaction('notes', 'readwrite', (store) => store.put(note));
}

/**
 * Retrieves all note objects from the database.
 * @returns {Promise<Array<object>>} A promise that resolves with an array of note objects.
 */
function getAllNotes(): Promise<Note[]> {
    return dbTransaction('notes', 'readonly', (store) => store.getAll() as IDBRequest<Note[]>);
}

/**
 * Marks a note as deleted in the database.
 * @param {string} id The ID of the note to delete.
 * @returns {Promise<void>} A promise that resolves when the note is marked as deleted.
 */
async function deleteNoteDB(id: string): Promise<void> {
    const noteObject = await _getNoteObject(id);
    if (noteObject) {
        noteObject.metadata.deletedAt = Date.now();
        await dbTransaction('notes', 'readwrite', (store) => store.put(noteObject));
    }
}

/**
 * Restores a deleted note in the database.
 * @param {string} id The ID of the note to restore.
 * @returns {Promise<void>} A promise that resolves when the note is restored.
 */
async function restoreNoteDB(id: string): Promise<void> {
    const noteObject = await _getNoteObject(id);
    if (noteObject) {
        delete noteObject.metadata.deletedAt;
        await dbTransaction('notes', 'readwrite', (store) => store.put(noteObject));
    }
}

/**
 * Permanently deletes a note from the database.
 * @param {string} id The ID of the note to delete permanently.
 * @returns {Promise<void>} A promise that resolves when the note is deleted.
 */
function deleteNotePermanentlyDB(id: string): Promise<undefined> {
    return dbTransaction('notes', 'readwrite', (store) => store.delete(id));
}

// Export functions
export {
    saveNote,
    getAllNotes,
    deleteNoteDB,
    restoreNoteDB,
    deleteNotePermanentlyDB
};
