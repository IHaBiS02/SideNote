/**
 * Plain-text paste transformations shared by WYSIWYG and source modes.
 */

/**
 * Escapes tilde characters to prevent markdown strikethrough formatting
 * @param {string} text - Input text
 * @returns {string} Text with tildes escaped
 */
interface PastedTextSettings {
  tildeReplacement?: boolean;
  autoLineBreak?: boolean;
}

function escapeTildes(text: string): string {
  return text.replace(/~/g, '\\~');
}

/**
 * Adds two spaces at the end of each line for markdown line breaks
 * @param {string} text - Input text
 * @returns {string} Text with line break spaces added
 */
function addAutoLineBreaks(text: string): string {
  const lines = text.split(/\r?\n/);
  if (lines.length <= 1) {
    return text;
  }
  
  const processedText = lines.map((line, index) => {
    // Apply auto line break spaces to non-empty lines that aren't the last line
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
function processPastedText(text: string, settings: PastedTextSettings = {}): string {
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

export {
  escapeTildes,
  addAutoLineBreaks,
  processPastedText
};
