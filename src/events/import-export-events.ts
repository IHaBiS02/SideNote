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
import { getAllNotes, getNote, saveNote } from '../database/index.js';
import { 
  getTimestamp, 
  sanitizeFilename, 
  downloadFile
} from '../utils.js';
import {
  createAllNotesArchive,
  createSingleNoteArchive,
  parseSnote,
  parseSnotesArchive,
  saveImportedNotes,
  saveParsedSnote,
  saveParsedSnoteImages
} from '../import_export.js';
import { createDropdown } from '../ui-helpers.js';
import {
  downloadStandaloneNoteHtml,
  downloadStandaloneNotePdf,
} from '../document-export.js';

// Import state from state module
import {
  notes,
  activeNoteId,
  getLoadedNote,
  hydrateNote,
} from '../state.js';
import type { Note } from '../types.js';
import { ensureJsZipLoaded } from '../vendor-loader.js';

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
  additionalActions?: Array<{
    label: string;
    action: ExportAction;
  }>;
}

async function loadActiveNotesInListOrder(): Promise<Note[]> {
  const storedNotes = await getAllNotes();
  const activeById = new Map(
    storedNotes
      .filter(note => !note.metadata.deletedAt)
      .map(note => [note.id, note]),
  );
  return notes
    .map(note => activeById.get(note.id))
    .filter((note): note is Note => Boolean(note));
}

async function loadCurrentNote(): Promise<Note | null> {
  const loadedNote = getLoadedNote();
  if (loadedNote) return loadedNote;
  if (!activeNoteId) return null;
  const note = await getNote(activeNoteId);
  return note ? hydrateNote(note) : null;
}

// === Import/Export Event Listeners ===

async function exportAllNotes({
  extension = 'snotes',
  addTwoSpaceLineBreaks = false,
  useTitleFolderNames = false
}: ExportAllOptions = {}): Promise<void> {
  await ensureJsZipLoaded();
  const timestamp = getTimestamp();
  const activeNotes = await loadActiveNotesInListOrder();
  const zip = await createAllNotesArchive(activeNotes, {
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
  await ensureJsZipLoaded();
  const note = await loadCurrentNote();
  if (!note) {
    return;
  }

  const sanitizedTitle = sanitizeFilename(note.title);
  const zip = await createSingleNoteArchive(note, { addTwoSpaceLineBreaks });
  const blob = await zip.generateAsync({ type: 'blob' });
  downloadFile(blob, `${sanitizedTitle}.${extension}`);
}

async function exportCurrentNoteAsHtml(): Promise<void> {
  const note = await loadCurrentNote();
  if (!note) return;

  try {
    await downloadStandaloneNoteHtml(note);
  } catch (error) {
    console.error('Failed to export note as HTML:', error);
    alert('Failed to save this note as HTML. A referenced image may be missing.');
  }
}

async function exportCurrentNoteAsPdf(): Promise<void> {
  const note = await loadCurrentNote();
  if (!note) return;

  try {
    await downloadStandaloneNotePdf(note);
  } catch (error) {
    console.error('Failed to export note as PDF:', error);
    alert('Failed to save this note as PDF. A referenced image may be missing.');
  }
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
  {
    archiveExtension,
    zipExport,
    archiveExport,
    additionalActions = [],
  }: ExportDropdownOptions,
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
      additionalActions.forEach(({ label, action }) => {
        addDropdownItem(dropdownElement, label, action);
      });
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
      archiveExport: () => exportCurrentNote(),
      additionalActions: [
        { label: 'Save as PDF', action: exportCurrentNoteAsPdf },
        { label: 'Save as HTML', action: exportCurrentNoteAsHtml },
      ],
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
        const parsedNotes = await parseSnotesArchive(zip);
        const newNotes = await saveImportedNotes(parsedNotes, notes);
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
      await ensureJsZipLoaded();
      await ensureJsZipLoaded();
      const zip = await JSZip.loadAsync(file);
      const importedNote = await parseSnote(zip);
      const note = getLoadedNote();
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
  exportCurrentNoteAsHtml,
  exportCurrentNoteAsPdf,
  initializeImportExportEvents
};
