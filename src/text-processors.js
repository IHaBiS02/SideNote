/**
 * Text processing utilities for markdown editing
 * Handles text transformations, spacing, and special character processing
 */

// === Text Processing Functions ===

/**
 * Escapes tilde characters to prevent markdown strikethrough formatting
 * @param {string} text - Input text
 * @returns {string} Text with tildes escaped
 */
function escapeTildes(text) {
  return text.replace(/~/g, '\\~');
}

/**
 * Adds two spaces at the end of each line for markdown line breaks
 * @param {string} text - Input text
 * @returns {string} Text with line break spaces added
 */
function addAutoLineBreaks(text) {
  const lines = text.split(/\r?\n/);
  if (lines.length <= 1) {
    return text;
  }
  
  const processedText = lines.map((line, index) => {
    // Add two spaces to non-empty lines that aren't the last line
    if (index < lines.length - 1 && line.trim().length > 0) {
      return line.trimEnd() + '  ';
    }
    return line;
  }).join('\n');
  
  return processedText;
}

/**
 * Processes pasted text according to user settings
 * @param {string} text - Raw pasted text
 * @param {Object} settings - User settings object
 * @param {boolean} settings.tildeReplacement - Whether to escape tildes
 * @param {boolean} settings.autoLineBreak - Whether to add line break spaces
 * @returns {string} Processed text
 */
function processPastedText(text, settings = {}) {
  let processedText = text;
  
  // Auto-escape tilde (~) characters
  if (settings.tildeReplacement) {
    processedText = escapeTildes(processedText);
  }
  
  // Auto line break processing (add two spaces for Markdown line breaks)
  if (settings.autoLineBreak) {
    processedText = addAutoLineBreaks(processedText);
  }
  
  return processedText;
}

/**
 * Counts trailing spaces in a text string
 * @param {string} text - Input text
 * @returns {number} Number of trailing spaces
 */
function countTrailingSpaces(text) {
  const trailingSpacesMatch = text.match(/\s*$/);
  return trailingSpacesMatch ? trailingSpacesMatch[0].length : 0;
}

/**
 * Ensures text has exactly the specified number of trailing spaces
 * @param {string} text - Input text
 * @param {number} targetSpaces - Desired number of trailing spaces (default: 2)
 * @returns {string} Text with normalized trailing spaces
 */
function normalizeTrailingSpaces(text, targetSpaces = 2) {
  const trimmed = text.trimEnd();
  return trimmed + ' '.repeat(targetSpaces);
}

/**
 * Processes Enter key input for markdown line breaks
 * @param {HTMLTextAreaElement} textarea - The textarea element
 * @param {Object} settings - User settings object
 * @param {boolean} settings.autoAddSpaces - Whether to add spaces on Enter
 * @param {Function} insertTextFunction - Function to insert text at cursor
 * @returns {Object} Processing result with action taken
 */
function handleEnterKeyInput(textarea, settings = {}, insertTextFunction) {
  if (!settings.autoAddSpaces) {
    return { handled: false, action: 'default' };
  }
  
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  
  // Find the current line boundaries
  const textUpToCursor = textarea.value.substring(0, start);
  const textFromCursor = textarea.value.substring(start);
  
  const currentLineStart = textUpToCursor.lastIndexOf('\n') + 1;
  const currentLineEnd = textFromCursor.indexOf('\n');
  const lineEndIndex = currentLineEnd === -1 ? textarea.value.length : start + currentLineEnd;
  
  // Get the full current line and split it at cursor position
  const fullCurrentLine = textarea.value.substring(currentLineStart, lineEndIndex);
  const cursorPositionInLine = start - currentLineStart;
  const beforeCursor = fullCurrentLine.substring(0, cursorPositionInLine);
  const afterCursor = fullCurrentLine.substring(cursorPositionInLine);
  
  // Check if text after cursor is only whitespace
  const isAfterCursorOnlyWhitespace = afterCursor.trim() === '';
  
  if (beforeCursor.trim().length === 0) {
    return { handled: false, action: 'empty_line' };
  }
  
  // Handle the case where after cursor is only whitespace
  if (isAfterCursorOnlyWhitespace && afterCursor.length > 0) {
    // Remove the trailing whitespace first
    textarea.setSelectionRange(start, lineEndIndex);
    textarea.setRangeText('', start, lineEndIndex);
    
    // Process the before cursor part
    const trailingSpaces = countTrailingSpaces(beforeCursor);
    
    if (trailingSpaces < 2) {
      const spacesToAdd = 2 - trailingSpaces;
      insertTextFunction(textarea, ' '.repeat(spacesToAdd) + '\n');
    } else {
      insertTextFunction(textarea, '\n');
    }
    
    return { handled: true, action: 'whitespace_cleanup' };
  }
  
  // Normal case: process the line up to cursor
  const trailingSpaces = countTrailingSpaces(beforeCursor);
  
  if (trailingSpaces < 2) {
    const spacesToAdd = 2 - trailingSpaces;
    insertTextFunction(textarea, ' '.repeat(spacesToAdd) + '\n');
  } else {
    insertTextFunction(textarea, '\n');
  }
  
  return { handled: true, action: 'normal_processing' };
}

/**
 * Analyzes text structure for cursor position and line information
 * @param {string} text - Full text content
 * @param {number} cursorPos - Cursor position
 * @returns {Object} Analysis result with line information
 */
function analyzeTextAtCursor(text, cursorPos) {
  const textUpToCursor = text.substring(0, cursorPos);
  const textFromCursor = text.substring(cursorPos);
  
  const currentLineStart = textUpToCursor.lastIndexOf('\n') + 1;
  const currentLineEnd = textFromCursor.indexOf('\n');
  const lineEndIndex = currentLineEnd === -1 ? text.length : cursorPos + currentLineEnd;
  
  const fullCurrentLine = text.substring(currentLineStart, lineEndIndex);
  const cursorPositionInLine = cursorPos - currentLineStart;
  const beforeCursor = fullCurrentLine.substring(0, cursorPositionInLine);
  const afterCursor = fullCurrentLine.substring(cursorPositionInLine);
  
  return {
    currentLineStart,
    lineEndIndex,
    fullCurrentLine,
    beforeCursor,
    afterCursor,
    cursorPositionInLine,
    isAfterCursorOnlyWhitespace: afterCursor.trim() === ''
  };
}

// Export all functions
export {
  escapeTildes,
  addAutoLineBreaks,
  processPastedText,
  countTrailingSpaces,
  normalizeTrailingSpaces,
  handleEnterKeyInput,
  analyzeTextAtCursor
};