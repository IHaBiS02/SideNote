// Import database helpers
import { dbTransaction, getDB } from './init.js';
import { createNoteSummary } from '../note-summary.js';
/**
 * Retrieves a note object from the database by its ID.
 * @param {string} id The ID of the note to retrieve.
 * @returns {Promise<object>} A promise that resolves with the note object.
 */
function getNote(id) {
    return dbTransaction('notes', 'readonly', (store) => store.get(id));
}
/**
 * Saves a note object to the database.
 * @param {object} note The note object to save.
 * @returns {Promise<void>} A promise that resolves when the note is saved.
 */
function saveNote(note) {
    return new Promise((resolve, reject) => {
        const database = getDB();
        if (!database) {
            reject(new Error('DB not initialized'));
            return;
        }
        const transaction = database.transaction(['notes', 'noteSummaries'], 'readwrite');
        const request = transaction.objectStore('notes').put(note);
        transaction.objectStore('noteSummaries').put(createNoteSummary(note));
        let savedKey = note.id;
        request.onsuccess = () => { savedKey = request.result; };
        transaction.oncomplete = () => resolve(savedKey);
        transaction.onerror = () => reject(transaction.error);
        transaction.onabort = () => reject(transaction.error);
    });
}
/**
 * Retrieves all note objects from the database.
 * @returns {Promise<Array<object>>} A promise that resolves with an array of note objects.
 */
function getAllNotes() {
    return dbTransaction('notes', 'readonly', (store) => store.getAll());
}
function getAllNoteSummaries() {
    return dbTransaction('noteSummaries', 'readonly', (store) => store.getAll());
}
/**
 * Marks a note as deleted in the database.
 * @param {string} id The ID of the note to delete.
 * @returns {Promise<void>} A promise that resolves when the note is marked as deleted.
 */
async function deleteNoteDB(id) {
    const noteObject = await getNote(id);
    if (noteObject) {
        noteObject.metadata.deletedAt = Date.now();
        await saveNote(noteObject);
    }
}
/**
 * Restores a deleted note in the database.
 * @param {string} id The ID of the note to restore.
 * @returns {Promise<void>} A promise that resolves when the note is restored.
 */
async function restoreNoteDB(id) {
    const noteObject = await getNote(id);
    if (noteObject) {
        delete noteObject.metadata.deletedAt;
        await saveNote(noteObject);
    }
}
/**
 * Permanently deletes a note from the database.
 * @param {string} id The ID of the note to delete permanently.
 * @returns {Promise<void>} A promise that resolves when the note is deleted.
 */
function deleteNotePermanentlyDB(id) {
    return new Promise((resolve, reject) => {
        const database = getDB();
        if (!database) {
            reject(new Error('DB not initialized'));
            return;
        }
        const transaction = database.transaction(['notes', 'noteSummaries'], 'readwrite');
        transaction.objectStore('notes').delete(id);
        transaction.objectStore('noteSummaries').delete(id);
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
        transaction.onabort = () => reject(transaction.error);
    });
}
// Export functions
export { saveNote, getNote, getAllNotes, getAllNoteSummaries, deleteNoteDB, restoreNoteDB, deleteNotePermanentlyDB };
