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
import { renderNoteList } from '../notes_view/index.js';
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
import { createDropdown } from '../ui-helpers.js';

// Import state from state module
import {
  notes,
  activeNoteId
} from '../state.js';
import type { ParsedSnote } from '../import_export.js';

interface ExportAllOptions {
  extension?: 'snotes' | 'zip';
  addTwoSpaceLineBreaks?: boolean;
  useTitleFolderNames?: boolean;
}

interface ExportNoteOptions {
  extension?: 'snote' | 'zip';
  addTwoSpaceLineBreaks?: boolean;
}

type ExportAction = () => Promise<void>;
type ZipExportAction = (addTwoSpaceLineBreaks: boolean) => Promise<void>;

interface ExportDropdownOptions {
  archiveExtension: 'snote' | 'snotes';
  zipExport: ZipExportAction;
  archiveExport: ExportAction;
}

// === Import/Export Event Listeners ===

async function exportAllNotes({
  extension = 'snotes',
  addTwoSpaceLineBreaks = false,
  useTitleFolderNames = false
}: ExportAllOptions = {}): Promise<void> {
  const timestamp = getTimestamp();
  const zip = await createAllNotesArchive(notes, {
    addTwoSpaceLineBreaks,
    useTitleFolderNames
  });
  const blob = await zip.generateAsync({ type: 'blob' });
  downloadFile(blob, `notes_${timestamp}.${extension}`);
}

async function exportCurrentNote({
  extension = 'snote',
  addTwoSpaceLineBreaks = false,
}: ExportNoteOptions = {}): Promise<void> {
  const note = notes.find(n => n.id === activeNoteId);
  if (!note) {
    return;
  }

  const sanitizedTitle = sanitizeFilename(note.title);
  const zip = await createSingleNoteArchive(note, { addTwoSpaceLineBreaks });
  const blob = await zip.generateAsync({ type: 'blob' });
  downloadFile(blob, `${sanitizedTitle}.${extension}`);
}

function positionDropdownNearButton(
  dropdown: HTMLDivElement,
  button: HTMLButtonElement,
): void {
  const rect = button.getBoundingClientRect();
  const margin = 6;
  const left = Math.min(rect.left, window.innerWidth - dropdown.offsetWidth - margin);
  const topAbove = rect.top - dropdown.offsetHeight - margin;
  const top = topAbove >= margin ? topAbove : rect.bottom + margin;

  dropdown.style.left = `${Math.max(margin, left)}px`;
  setDropdownTop(dropdown, top);
}

function setDropdownTop(dropdown: HTMLDivElement, top: number): void {
  const margin = 6;
  const maxTop = window.innerHeight - dropdown.offsetHeight - margin;
  const boundedTop = Math.min(Math.max(margin, top), Math.max(margin, maxTop));
  dropdown.style.top = `${boundedTop}px`;
}

function keepDropdownBottomStable(
  dropdown: HTMLDivElement,
  update: () => void,
): void {
  const previousBottom = dropdown.getBoundingClientRect().bottom;
  update();
  setDropdownTop(dropdown, previousBottom - dropdown.offsetHeight);
}

function addDropdownItem(
  dropdown: HTMLDivElement,
  text: string,
  onClick: ExportAction,
): HTMLDivElement {
  const item = document.createElement('div');
  item.textContent = text;
  item.tabIndex = 0;
  item.addEventListener('click', async (event) => {
    event.stopPropagation();
    await onClick();
    dropdown.remove();
  });
  dropdown.appendChild(item);
  return item;
}

function showZipLineBreakOptions(
  parentItem: HTMLDivElement,
  exportZip: ZipExportAction,
): void {
  const dropdown = parentItem.closest<HTMLDivElement>('.export-options-dropdown');
  if (!dropdown) {
    return;
  }

  const existingOptions = dropdown.querySelectorAll('.export-zip-line-break-option');
  if (existingOptions.length > 0) {
    keepDropdownBottomStable(dropdown, () => {
      existingOptions.forEach(option => option.remove());
    });
    return;
  }

  const addZipOption = (text: string, addTwoSpaceLineBreaks: boolean): void => {
    const item = document.createElement('div');
    item.textContent = text;
    item.tabIndex = 0;
    item.classList.add('export-zip-line-break-option');
    item.addEventListener('click', async (event) => {
      event.stopPropagation();
      await exportZip(addTwoSpaceLineBreaks);
      dropdown.remove();
    });
    dropdown.insertBefore(item, parentItem);
  };

  keepDropdownBottomStable(dropdown, () => {
    addZipOption('Export original', false);
    addZipOption('Export with two-space line breaks', true);
  });
}

function showExportOptionsDropdown(
  button: HTMLButtonElement,
  { archiveExtension, zipExport, archiveExport }: ExportDropdownOptions,
): void {
  const dropdown = createDropdown({
    className: 'export-options-dropdown',
    populate: (dropdownElement) => {
      const zipItem = addDropdownItem(dropdownElement, 'Export as .zip', () => zipExport(false));
      zipItem.classList.add('export-zip-option');
      zipItem.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        event.stopPropagation();
        showZipLineBreakOptions(zipItem, zipExport);
      });

      addDropdownItem(dropdownElement, `Export as .${archiveExtension}`, archiveExport);
    },
    excludeFromClose: ['.export-options-dropdown']
  });

  if (dropdown) {
    positionDropdownNearButton(dropdown, button);
  }
}

function initializeImportExportEvents(): void {
  // Export all notes
  globalExportButton.addEventListener('click', async () => {
    await exportAllNotes();
  });

  globalExportButton.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    showExportOptionsDropdown(globalExportButton, {
      archiveExtension: 'snotes',
      zipExport: (addTwoSpaceLineBreaks) => exportAllNotes({
        extension: 'zip',
        addTwoSpaceLineBreaks,
        useTitleFolderNames: true
      }),
      archiveExport: () => exportAllNotes()
    });
  });

  // Export current note
  exportNoteButton.addEventListener('click', async () => {
    await exportCurrentNote();
  });

  exportNoteButton.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    showExportOptionsDropdown(exportNoteButton, {
      archiveExtension: 'snote',
      zipExport: (addTwoSpaceLineBreaks) => exportCurrentNote({
        extension: 'zip',
        addTwoSpaceLineBreaks
      }),
      archiveExport: () => exportCurrentNote()
    });
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
    const file = globalImportInput.files?.[0];
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
        const parsedNotes: ParsedSnote[] = [];
        const topLevelFolders = new Set<string>();
        
        // Find top-level folders (each folder is one note)
        for (const path in zip.files) {
          if (path.endsWith('/') && path.split('/').length === 2) {
            topLevelFolders.add(path);
          }
        }

        for (const noteFolder of topLevelFolders) {
          const folder = zip.folder(noteFolder);
          if (!folder) continue;
          const parsedNote = await parseSnote(folder);
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
    const file = importNoteInput.files?.[0];
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
  exportAllNotes,
  exportCurrentNote,
  initializeImportExportEvents
};
