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
import { saveNote, getImage } from '../database.js';
import { 
  getTimestamp, 
  sanitizeFilename, 
  downloadFile, 
  extractImageIds 
} from '../utils.js';
import { processSnote } from '../import_export.js';

// Import state from state module
import {
  notes,
  activeNoteId
} from '../state.js';

// === Import/Export Event Listeners ===

function initializeImportExportEvents() {
  // Export all notes
  globalExportButton.addEventListener('click', async () => {
    const zip = new JSZip();
    const timestamp = getTimestamp();

    // Compress all notes into ZIP
    for (const note of notes) {
      const noteFolder = zip.folder(note.id);
      
      const metadata = {
        title: note.title,
        settings: note.settings,
        metadata: note.metadata
      };
      noteFolder.file('metadata.json', JSON.stringify(metadata, null, 2));
      noteFolder.file('note.md', note.content);

      const imageIds = extractImageIds(note.content);
      if (imageIds.length > 0) {
        const imagesFolder = noteFolder.folder('images');
        for (const imageId of imageIds) {
          try {
            const imageBlob = await getImage(imageId);
            if (imageBlob) {
              imagesFolder.file(`${imageId}.png`, imageBlob);
            }
          } catch (err) {
            console.error(`Failed to get image ${imageId} for export:`, err);
          }
        }
      }
    }

    zip.generateAsync({ type: 'blob' }).then(blob => {
      downloadFile(blob, `notes_${timestamp}.snotes`);
    });
  });

  // Export current note
  exportNoteButton.addEventListener('click', async () => {
    const note = notes.find(n => n.id === activeNoteId);
    if (note) {
      const zip = new JSZip();
      const sanitizedTitle = sanitizeFilename(note.title);

      const metadata = {
        title: note.title,
        settings: note.settings,
        metadata: note.metadata
      };
      zip.file('metadata.json', JSON.stringify(metadata, null, 2));
      zip.file('note.md', note.content);

      const imageIds = extractImageIds(note.content);
      if (imageIds.length > 0) {
        const imagesFolder = zip.folder('images');
        for (const imageId of imageIds) {
          try {
            const imageBlob = await getImage(imageId);
            if (imageBlob) {
              imagesFolder.file(`${imageId}.png`, imageBlob);
            }
          } catch (err) {
            console.error(`Failed to get image ${imageId} for export:`, err);
          }
        }
      }

      zip.generateAsync({ type: 'blob' }).then(blob => {
        downloadFile(blob, `${sanitizedTitle}.snote`);
      });
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
        const newNote = await processSnote(zip);
        newNote.metadata.lastModified = Date.now();
        notes.push(newNote);
        await saveNote(newNote);
      } else if (file.name.endsWith('.snotes')) {
        // Multiple notes file (.snotes)
        const newNotes = [];
        const topLevelFolders = new Set();
        
        // Find top-level folders (each folder is one note)
        for (const path in zip.files) {
          if (path.endsWith('/') && path.split('/').length === 2) {
            topLevelFolders.add(path);
          }
        }

        for (const noteFolder of topLevelFolders) {
          const newNote = await processSnote(zip.folder(noteFolder));
          newNotes.push(newNote);
        }

        newNotes.sort((a, b) => a.metadata.lastModified - b.metadata.lastModified);
        
        const now = Date.now();
        newNotes.forEach(async (note, index) => {
          note.metadata.lastModified = now + index;
          notes.push(note);
          await saveNote(note);
        });
        
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
      const importedNote = await processSnote(zip);
      const note = notes.find(n => n.id === activeNoteId);
      if (note) {
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