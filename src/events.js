// Import DOM elements
import {
  listView,
  editorView,
  noteList,
  newNoteButton,
  backButton,
  editorTitle,
  markdownEditor,
  htmlPreview,
  toggleViewButton,
  settingsView,
  settingsButton,
  globalSettingsButton,
  settingsBackButton,
  licensesButton,
  licenseView,
  licenseBackButton,
  licenseContent,
  titleSetting,
  fontSizeSetting,
  modeSetting,
  autoLineBreakButton,
  tildeReplacementButton,
  autoAddSpacesCheckbox,
  globalExportButton,
  globalImportButton,
  globalImportInput,
  exportNoteButton,
  importNoteButton,
  importNoteInput,
  recycleBinButton,
  recycleBinView,
  recycleBinBackButton,
  imageManagementButton,
  imageManagementView,
  imageManagementBackButton,
  emptyRecycleBinButton,
  preventUsedImageDeletionCheckbox
} from './dom.js';

// Import functions from other modules
import {
  sortNotes,
  deleteNote,
  restoreNote,
  deleteNotePermanently,
  emptyRecycleBin
} from './notes.js';

import {
  renderNoteList,
  openNote,
  showListView,
  showEditorView,
  showSettingsView,
  showLicenseView,
  showRecycleBinView,
  showImageManagementView,
  renderDeletedItemsList,
  renderMarkdown,
  togglePreview,
  renderImagesList
} from './notes_view.js';

import {
  saveGlobalSettings,
  applyFontSize,
  applyMode,
  updateAutoLineBreakButton,
  updateTildeReplacementButton
} from './settings.js';

// Import state from state module
import {
  notes,
  deletedNotes,
  globalSettings,
  isGlobalSettings,
  activeNoteId,
  originalNoteContent,
  isPreview,
  setActiveNoteId,
  setOriginalNoteContent,
  setIsGlobalSettings
} from './state.js';

import {
  pushToHistory,
  moveBack,
  moveForward,
  canMoveBack,
  canMoveForward,
  getCurrentHistoryState,
  getHistory,
  getHistoryIndex,
  goToHistoryState
} from './history.js';

import {
  getTimestamp,
  sanitizeFilename,
  downloadFile,
  extractImageIds
} from './utils.js';

import {
  saveNote,
  getImage,
  saveImage,
  getAllNotes,
  getAllImageObjectsFromDB
} from './database.js';

import { processSnote } from './import_export.js';

// === 유틸리티 함수 ===

// textarea에 텍스트 삽입 (deprecated document.execCommand 대체)
function insertTextAtCursor(textarea, text) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const value = textarea.value;
  
  // 텍스트 삽입
  textarea.value = value.substring(0, start) + text + value.substring(end);
  
  // 커서 위치 조정
  textarea.selectionStart = textarea.selectionEnd = start + text.length;
  
  // input 이벤트 발생시키기 (자동 저장 등을 위해)
  textarea.dispatchEvent(new Event('input', { bubbles: true }));
}

// === 네비게이션 관련 함수 ===

// 주어진 상태로 네비게이션 (뷰 전환)
async function navigateToState(state) {
    if (!state) {
        showListView(false);
        return;
    }

    switch (state.view) {
        case 'list':
            showListView(false);
            break;
        case 'editor':
            openNote(state.params.noteId, state.params.inEditMode, false);
            break;
        case 'settings':
            setIsGlobalSettings(state.params.isGlobal);
            if (isGlobalSettings) {
                titleSetting.value = globalSettings.title || 'default';
                fontSizeSetting.value = globalSettings.fontSize || 12;
                modeSetting.value = globalSettings.mode || 'system';
                autoAddSpacesCheckbox.checked = globalSettings.autoAddSpaces;
                preventUsedImageDeletionCheckbox.checked = globalSettings.preventUsedImageDeletion;
            } else {
                const note = notes.find(n => n.id === state.params.noteId);
                if (note) {
                    setActiveNoteId(note.id);
                    titleSetting.value = note.settings.title || 'default';
                    fontSizeSetting.value = note.settings.fontSize || globalSettings.fontSize || 12;
                    modeSetting.value = globalSettings.mode || 'system';
                    autoAddSpacesCheckbox.checked = globalSettings.autoAddSpaces;
                    preventUsedImageDeletionCheckbox.checked = globalSettings.preventUsedImageDeletion;
                } else {
                    showListView(false); // Fallback
                    return;
                }
            }
            showSettingsView(false);
            break;
        case 'license':
            showLicenseView(false);
            break;
        case 'recycleBin':
            showRecycleBinView(false);
            break;
        case 'imageManagement':
            showImageManagementView(false);
            break;
        default:
            showListView(false);
    }
}

// 이전 화면으로 돌아가기
async function goBack() {
    const currentState = getCurrentHistoryState();
    // 현재 에디터 화면이면 변경사항 저장
    if (currentState && currentState.view === 'editor') {
        const note = notes.find(n => n.id === currentState.params.noteId);
        if (note && markdownEditor.value !== originalNoteContent) {
            note.content = markdownEditor.value;
            note.metadata.lastModified = Date.now();
            sortNotes();
            await saveNote(note);
            renderNoteList();
        }
    }

    const previousState = moveBack();
    if (previousState) {
        navigateToState(previousState);

        const existingDropdown = document.querySelector('.history-dropdown');
        if (existingDropdown) {
            const currentIndex = getHistoryIndex();
            const items = existingDropdown.querySelectorAll('div');
            const history = getHistory();
            
            items.forEach((item, reversedIndex) => {
                const originalIndex = history.length - 1 - reversedIndex;
                if (originalIndex === currentIndex) {
                    item.classList.add('current-history-item');
                } else {
                    item.classList.remove('current-history-item');
                }
            });
        }
    }
}

// === 노트 생성/편집 이벤트 ===

// 새 노트 생성
newNoteButton.addEventListener('click', async () => {
  const now = Date.now();
  const newNote = {
    id: crypto.randomUUID(),
    title: 'New Note',
    content: '',
    settings: {
      fontSize: globalSettings.fontSize || 12
    },
    metadata: {
      createdAt: now,
      lastModified: now
    },
    isPinned: false
  };
  notes.unshift(newNote);  // 리스트 맨 위에 추가
  await saveNote(newNote);
  inEditMode = false;
  noteId = newNote.id;
  pushToHistory({ view: 'editor', params: { noteId, inEditMode } });
  openNote(noteId, true);  // 편집 모드로 열기
});

const backButtons = [
    backButton,
    settingsBackButton,
    licenseBackButton,
    recycleBinBackButton,
    imageManagementBackButton
];

// 모든 뒤로가기 버튼에 이벤트 리스너 추가
backButtons.forEach(button => {
    button.addEventListener('click', goBack);
    // 오른쪽 클릭 시 히스토리 드롭다운 표시
    button.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showHistoryDropdown(e.currentTarget);
    });
});

function populateHistoryDropdown(dropdown) {
    dropdown.innerHTML = ''; // Clear existing items
    const history = getHistory();
    const currentIndex = getHistoryIndex();
    if (history.length === 0) {
        dropdown.remove();
        return;
    }

    // The history is displayed from most recent to oldest, so we reverse it for display
    [...history].reverse().forEach((state, reversedIndex) => {
        const originalIndex = history.length - 1 - reversedIndex;
        const item = document.createElement('div');
        let title = state.view;
        if (state.view === 'editor' && state.params && state.params.noteId) {
            const note = notes.find(n => n.id === state.params.noteId);
            title = note ? `Editor: ${note.title}` : 'Editor: Untitled';
        } else {
            // Capitalize first letter
            title = state.view.charAt(0).toUpperCase() + state.view.slice(1);
        }
        item.textContent = title;
        item.title = title;

        if (originalIndex === currentIndex) {
            item.classList.add('current-history-item');
        }

        item.addEventListener('click', async () => {
            const targetState = history[originalIndex];

            const currentState = getCurrentHistoryState();
            if (currentState && currentState.view === 'editor') {
                const note = notes.find(n => n.id === currentState.params.noteId);
                if (note && markdownEditor.value !== originalNoteContent) {
                    note.content = markdownEditor.value;
                    note.metadata.lastModified = Date.now();
                    sortNotes();
                    await saveNote(note);
                    renderNoteList();
                }
            }
            
            goToHistoryState(originalIndex);
            navigateToState(targetState);
            dropdown.remove();
        });
        dropdown.appendChild(item);
    });
}

function showHistoryDropdown(targetButton) {
    // Close any existing dropdown
    const existingDropdown = document.querySelector('.history-dropdown');
    if (existingDropdown) {
        existingDropdown.remove();
    }

    const history = getHistory();
    if (history.length === 0) return;

    const dropdown = document.createElement('div');
    dropdown.classList.add('history-dropdown');

    populateHistoryDropdown(dropdown);

    document.body.appendChild(dropdown);

    // Close dropdown when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeDropdown(event) {
            if (!dropdown.contains(event.target) && event.target !== targetButton) {
                dropdown.remove();
                document.removeEventListener('click', closeDropdown);
            }
        });
    }, 0);
}

function refreshHistoryDropdown() {
    const existingDropdown = document.querySelector('.history-dropdown');
    if (existingDropdown) {
        populateHistoryDropdown(existingDropdown);
    }
}

document.addEventListener('historytruncated', refreshHistoryDropdown);

// 마크다운 에디터 입력 이벤트 (자동 저장)
markdownEditor.addEventListener('input', async () => {
  const note = notes.find(n => n.id === activeNoteId);
  if (note) {
    note.content = markdownEditor.value;
    note.metadata.lastModified = Date.now();
    const titleSource = note.settings.title || globalSettings.title;
    let titleChanged = false;
    // 기본 제목 설정 시 첫 줄을 제목으로 사용
    if (titleSource === 'default') {
      const newTitle = note.content.trim().split('\n')[0].substring(0, 30) || 'New Note';
      if (note.title !== newTitle) {
        note.title = newTitle;
        editorTitle.textContent = note.title;
        titleChanged = true;
      }
    }
    sortNotes();
    await saveNote(note);
    if (titleChanged) {
      renderNoteList();
    }
  }
});

// 붙여넣기 이벤트 (이미지 및 텍스트 처리)
markdownEditor.addEventListener('paste', async (e) => {
  e.preventDefault();

  const items = Array.from(e.clipboardData.items);
  const imageItem = items.find(item => item.kind === 'file' && item.type.startsWith('image/'));

  // 이미지 붙여넣기 처리
  if (imageItem) {
    const imageFile = imageItem.getAsFile();
    const imageId = crypto.randomUUID();
    
    try {
      await saveImage(imageId, imageFile);
      const markdownImageText = `![Image](images/${imageId}.png)`;
      insertTextAtCursor(markdownEditor, markdownImageText);
    } catch (err) {
      console.error('Failed to save image:', err);
      return; 
    }
  } else {
    // 텍스트 붙여넣기 처리
    let text = e.clipboardData.getData('text/plain');

    // 틸던(~) 캐릭터 자동 이스케이프
    if (globalSettings.tildeReplacement) {
      text = text.replace(/~/g, '\~');
    }

    // 자동 줄바꿈 처리 (Markdown 줄바꿈을 위해 두 공백 추가)
    if (globalSettings.autoLineBreak) {
      const lines = text.split(/\r?\n/);
      if (lines.length > 1) {
        const processedText = lines.map((line, index) => {
          if (index < lines.length - 1 && line.trim().length > 0) {
            return line.trimEnd() + '  ';
          }
          return line;
        }).join('\n');
        text = processedText;
      }
    }
    insertTextAtCursor(markdownEditor, text);
  }
});

toggleViewButton.addEventListener('click', togglePreview);

// === 키보드 단축키 이벤트 ===

markdownEditor.addEventListener('keydown', (e) => {
  // Enter 키 누를 때 자동으로 줄 끝에 두 공백 추가
  if (e.key === 'Enter' && !e.isComposing && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
    if (globalSettings.autoAddSpaces) {
      const start = markdownEditor.selectionStart;
      const end = markdownEditor.selectionEnd;
      const currentLine = markdownEditor.value.substring(0, start).split('\n').pop();
      if (currentLine.trim().length > 0) {
        e.preventDefault();
        insertTextAtCursor(markdownEditor, '  \n');
      }
    }
  }


  // Shift+Enter로 미리보기 토글
  if (e.shiftKey && e.key === 'Enter') {
    e.preventDefault();
    togglePreview();
  }
});

htmlPreview.addEventListener('dblclick', togglePreview);

// 미리보기 영역 클릭 이벤트
htmlPreview.addEventListener('click', async (e) => {
  // 체크박스 클릭 처리
  if (e.target.tagName === 'INPUT' && e.target.type === 'checkbox') {
    const checkboxes = Array.from(htmlPreview.querySelectorAll('input[type="checkbox"]'));
    const checkboxIndex = checkboxes.indexOf(e.target);

    const markdown = markdownEditor.value;
    const regex = /\[[x ]\]/g;
    let match;
    const matches = [];
    while ((match = regex.exec(markdown)) !== null) {
      matches.push(match);
    }

    if (checkboxIndex < matches.length) {
      const matchToUpdate = matches[checkboxIndex];
      const charIndex = matchToUpdate.index;
      const originalText = matchToUpdate[0];
      const newText = originalText === '[ ]' ? '[x]' : '[ ]';

      const newMarkdown = markdown.substring(0, charIndex) +
                          newText +
                          markdown.substring(charIndex + 3);

      markdownEditor.value = newMarkdown;

      // Trigger update and save
      const note = notes.find(n => n.id === activeNoteId);
      if (note) {
        note.content = markdownEditor.value;
        note.metadata.lastModified = Date.now();
        sortNotes();
        await saveNote(note);
        renderMarkdown(); // Re-render to show the change immediately
        renderNoteList(); // Update note list if title changes
      }
    }
  } else if (e.target.tagName === 'IMG') {
    // 이미지 클릭 시 모달 표시
    showImageModal(e.target.src);
  }
});

// 제목 더블클릭 시 편집 모드
editorTitle.addEventListener('dblclick', () => {
  const note = notes.find(n => n.id === activeNoteId);
  if (note) {
    let titleSource = note.settings.title || globalSettings.title;
    // 기본 제목일 때 커스텀 제목으로 변경
    if (titleSource === 'default') {
      note.settings.title = 'custom';
      titleSource = 'custom';
      saveNote(note);
    }

    if (titleSource === 'custom') {
      const input = document.createElement('input');
      input.type = 'text';
      input.value = note.title;
      input.classList.add('title-input');

      let editingFinished = false;

      const finishEditing = async () => {
        if (editingFinished) return;
        editingFinished = true;

        note.title = input.value;
        note.metadata.lastModified = Date.now();
        editorTitle.textContent = note.title;
        sortNotes();
        await saveNote(note);
        renderNoteList();
        input.replaceWith(editorTitle);
      };

      const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.isComposing) {
          e.preventDefault();
          finishEditing();
        } else if (e.key === 'Escape') {
          finishEditing();
        }
      };

      input.addEventListener('keydown', handleKeyDown);
      input.addEventListener('blur', finishEditing);

      editorTitle.replaceWith(input);
      input.focus();
    }
  }
});

// === 설정 관련 이벤트 ===

// 노트 설정 열기
settingsButton.addEventListener('click', () => {
  setIsGlobalSettings(false);
  const note = notes.find(n => n.id === activeNoteId);
  titleSetting.value = note.settings.title || 'default';
  fontSizeSetting.value = note.settings.fontSize || globalSettings.fontSize || 12;
  modeSetting.value = globalSettings.mode || 'system';
  autoAddSpacesCheckbox.checked = globalSettings.autoAddSpaces;
  preventUsedImageDeletionCheckbox.checked = globalSettings.preventUsedImageDeletion;
  showSettingsView();
});

globalSettingsButton.addEventListener('click', () => {
  setIsGlobalSettings(true);
  titleSetting.value = globalSettings.title || 'default';
  fontSizeSetting.value = globalSettings.fontSize || 12;
  modeSetting.value = globalSettings.mode || 'system';
  autoAddSpacesCheckbox.checked = globalSettings.autoAddSpaces;
  preventUsedImageDeletionCheckbox.checked = globalSettings.preventUsedImageDeletion;
  showSettingsView();
});



licensesButton.addEventListener('click', async () => {
  const response = await fetch('LIBRARY_LICENSES.md');
  const text = await response.text();
  const dirtyHtml = marked.parse(text);
  licenseContent.innerHTML = DOMPurify.sanitize(dirtyHtml);
  showLicenseView();
});



recycleBinButton.addEventListener('click', () => {
  showRecycleBinView();
});



imageManagementButton.addEventListener('click', () => {
  showImageManagementView();
});

emptyRecycleBinButton.addEventListener('click', (e) => {
    e.stopPropagation();

    const existingDropdown = document.querySelector('.confirmation-dropdown');
    if (existingDropdown) {
        existingDropdown.remove();
        return;
    }

    const dropdown = document.createElement('div');
    dropdown.classList.add('confirmation-dropdown');

    const eraseAction = document.createElement('div');
    eraseAction.textContent = 'Erase All Notes';
    eraseAction.classList.add('delete-action');

    const handleFirstClick = (event) => {
        event.stopPropagation();

        const confirmAction = document.createElement('div');
        confirmAction.textContent = 'Are you sure?';
        confirmAction.classList.add('delete-action', 'confirm');

        confirmAction.addEventListener('click', () => {
            emptyRecycleBin();
            dropdown.remove();
        });

        dropdown.insertBefore(confirmAction, eraseAction);
        eraseAction.removeEventListener('click', handleFirstClick);
    };

    eraseAction.addEventListener('click', handleFirstClick);

    dropdown.appendChild(eraseAction);
    document.body.appendChild(dropdown);

    setTimeout(() => {
        document.addEventListener('click', function closeDropdown(event) {
            if (!dropdown.contains(event.target)) {
                dropdown.remove();
                document.removeEventListener('click', closeDropdown);
            }
        });
    }, 0);
});

modeSetting.addEventListener('change', () => {
  const value = modeSetting.value;
  globalSettings.mode = value;
  saveGlobalSettings();
  applyMode(value);
});

titleSetting.addEventListener('change', async () => {
  const value = titleSetting.value;
  if (isGlobalSettings) {
    globalSettings.title = value;
    saveGlobalSettings();
  } else {
    const note = notes.find(n => n.id === activeNoteId);
    if (note) {
      note.settings.title = value;
      note.metadata.lastModified = Date.now();
      if (value === 'default') {
        const firstLine = note.content.trim().split('\n')[0];
        note.title = firstLine.substring(0, 30) || 'New Note';
        editorTitle.textContent = note.title;
      }
      sortNotes();
      await saveNote(note);
    }
  }
});

fontSizeSetting.addEventListener('input', async () => {
  const value = parseInt(fontSizeSetting.value, 10);
  if (isNaN(value) || value < 1) {
    return;
  }

  if (isGlobalSettings) {
    globalSettings.fontSize = value;
    saveGlobalSettings();
  } else {
    const note = notes.find(n => n.id === activeNoteId);
    if (note) {
      note.settings.fontSize = value;
      note.metadata.lastModified = Date.now();
      applyFontSize(value);
      sortNotes();
      await saveNote(note);
    }
  }
});

autoLineBreakButton.addEventListener('click', () => {
  globalSettings.autoLineBreak = !globalSettings.autoLineBreak;
  updateAutoLineBreakButton();
  saveGlobalSettings();
});

tildeReplacementButton.addEventListener('click', () => {
  globalSettings.tildeReplacement = !globalSettings.tildeReplacement;
  updateTildeReplacementButton();
  saveGlobalSettings();
});

preventUsedImageDeletionCheckbox.addEventListener('change', () => {
    globalSettings.preventUsedImageDeletion = preventUsedImageDeletionCheckbox.checked;
    saveGlobalSettings();
});

// === 가져오기/내보내기 이벤트 ===

// 전체 노트 내보내기
globalExportButton.addEventListener('click', async () => {
  const zip = new JSZip();
  const timestamp = getTimestamp();

  // 모든 노트를 ZIP으로 압축
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

globalImportButton.addEventListener('click', () => {
  globalImportInput.click();
});

importNoteButton.addEventListener('click', () => {
  importNoteInput.click();
});

// 전체 가져오기 파일 선택 시
globalImportInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) {
    return;
  }

  try {
    const zip = await JSZip.loadAsync(file);
    // 단일 노트 파일 (.snote)
    if (file.name.endsWith('.snote')) {
      const newNote = await processSnote(zip);
      newNote.metadata.lastModified = Date.now();
      notes.push(newNote);
      await saveNote(newNote);
    } else if (file.name.endsWith('.snotes')) {
      // 다중 노트 파일 (.snotes)
      const newNotes = [];
      const topLevelFolders = new Set();
      
      // 최상위 폴더 찾기 (각 폴더가 하나의 노트)
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

// === 전역 키보드 이벤트 ===

// ESC 키로 닫기/뒤로가기
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    // 이미지 모달이 열려있으면 먼저 닫기
    const imagePreviewModal = document.querySelector('.image-preview-modal');
    if (imagePreviewModal) {
      document.body.removeChild(imagePreviewModal);
      return;
    }
    // 그렇지 않으면 뒤로가기
    goBack();
  }
});

// 시스템 테마 변경 감지
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (globalSettings.mode === 'system') {
        applyMode('system');
    }
});

// 이미지 관리 화면 드롭다운 닫기
document.addEventListener('click', (e) => {
    if (imageManagementView.style.display === 'block') {
        // 사용 아이콘 외부 클릭 시 노트 드롭다운 닫기
        const openNotesDropdown = document.querySelector('.notes-dropdown');
        if (openNotesDropdown && !e.target.closest('.usage-icon')) {
            openNotesDropdown.remove();
        }
        
        // 이미지 이름 외부 클릭 시 이미지 제목 드롭다운 닫기
        const openImageTitleDropdown = document.querySelector('.image-title-dropdown');
        if (openImageTitleDropdown && !e.target.closest('.image-name')) {
            openImageTitleDropdown.remove();
        }
    }
});

// Export the utility functions (events.js contains mainly event listeners and is mostly side-effect based)
export {
  insertTextAtCursor,
  navigateToState,
  goBack,
  populateHistoryDropdown,
  showHistoryDropdown,
  refreshHistoryDropdown
};
