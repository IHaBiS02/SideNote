// Import DOM elements for import/export
import {
  globalExportButton,
  globalImportButton,
  globalImportInput,
  exportNoteButton,
  importNoteButton,
  importNoteInput,
  editorTitle,
  markdownEditor
} from '../dom.js';

// Import functions from other modules
import { sortNotes } from '../notes.js';
import { renderMarkdown, renderNoteList } from '../notes_view/index.js';
import { saveNote } from '../database/index.js';
import { 
  getTimestamp, 
  sanitizeFilename, 
  downloadFile
} from '../utils.js';
import {
  createAllNotesArchive,
  createSingleNoteArchive,
  parseSnote,
  saveImportedNotes,
  saveParsedSnote,
  saveParsedSnoteImages
} from '../import_export.js';

// Import state from state module
import {
  notes,
  activeNoteId
} from '../state.js';

// === Import/Export Event Listeners ===

function initializeImportExportEvents() {
  // Export all notes
  globalExportButton.addEventListener('click', async () => {
    const timestamp = getTimestamp();
    const zip = await createAllNotesArchive(notes);
    const blob = await zip.generateAsync({ type: 'blob' });
    downloadFile(blob, `notes_${timestamp}.snotes`);
  });

  // Export current note
  exportNoteButton.addEventListener('click', async () => {
    const note = notes.find(n => n.id === activeNoteId);
    if (note) {
      const sanitizedTitle = sanitizeFilename(note.title);
      const zip = await createSingleNoteArchive(note);
      const blob = await zip.generateAsync({ type: 'blob' });
      downloadFile(blob, `${sanitizedTitle}.snote`);
    }
  });

  // Global import button
  globalImportButton.addEventListener('click', () => {
    globalImportInput.click();
  });

  // Import note button
  importNoteButton.addEventListener('click', () => {
    importNoteInput.click();
  });

  // Global import file selection
  globalImportInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    try {
      const zip = await JSZip.loadAsync(file);
      // Single note file (.snote)
      if (file.name.endsWith('.snote')) {
        const parsedNote = await parseSnote(zip);
        const newNote = await saveParsedSnote(parsedNote, {
          metadata: {
            ...parsedNote.metadata,
            lastModified: Date.now()
          }
        });
        notes.push(newNote);
      } else if (file.name.endsWith('.snotes')) {
        // Multiple notes file (.snotes)
        const parsedNotes = [];
        const topLevelFolders = new Set();
        
        // Find top-level folders (each folder is one note)
        for (const path in zip.files) {
          if (path.endsWith('/') && path.split('/').length === 2) {
            topLevelFolders.add(path);
          }
        }

        for (const noteFolder of topLevelFolders) {
          const parsedNote = await parseSnote(zip.folder(noteFolder));
          parsedNotes.push(parsedNote);
        }

        const newNotes = await saveImportedNotes(parsedNotes);
        for (const note of newNotes) {
          notes.push(note);
        }
        
      }
      sortNotes();
      renderNoteList();
    } catch (error) {
      console.error('Error importing file:', error);
      alert('Failed to import file. It may be corrupted or in the wrong format.');
    }

    globalImportInput.value = '';
  });

  // Import note file selection
  importNoteInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    
    try {
      const zip = await JSZip.loadAsync(file);
      const importedNote = await parseSnote(zip);
      const note = notes.find(n => n.id === activeNoteId);
      if (note) {
        await saveParsedSnoteImages(importedNote);
        note.title = importedNote.title;
        note.content = importedNote.content;
        note.settings = importedNote.settings;
        note.metadata.lastModified = Date.now();
        editorTitle.textContent = note.title;
        markdownEditor.value = note.content;
        sortNotes();
        await saveNote(note);
        renderMarkdown();
      }
    } catch (error) {
      console.error('Error importing note:', error);
      alert('Failed to import note. It may be corrupted or in the wrong format.');
    }

    importNoteInput.value = '';
  });
}

// Export functions
export {
  initializeImportExportEvents
};
