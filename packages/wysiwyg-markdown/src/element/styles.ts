import { css } from 'lit';

export const editorStyles = css`
  :host {
    --editor-background: transparent;
    --editor-color: inherit;
    --editor-border: 0;
    --editor-border-radius: 0;
    --editor-border-color: currentColor;
    --editor-muted-background: transparent;
    --editor-code-background: var(--editor-muted-background);
    --editor-accent: currentColor;
    --editor-font-family: inherit;
    --editor-code-font-family: inherit;
    --editor-font-size: inherit;
    --editor-min-height: 240px;
    --editor-padding: 0;
    --editor-line-height: inherit;
    --editor-heading-line-height: inherit;
    --editor-code-padding: 0;
    --editor-code-content-padding: 5px;
    --editor-code-border-radius: 0;
    --editor-code-white-space: pre-wrap;
    --editor-code-word-break: break-word;
    --editor-code-overflow-x: hidden;

    display: block;
    min-width: 0;
    color: var(--editor-color);
    font-family: var(--editor-font-family);
    font-size: var(--editor-font-size);
  }

  * {
    box-sizing: border-box;
  }

  .surface {
    position: relative;
    min-height: var(--editor-min-height);
    overflow: auto;
    border: var(--editor-border);
    border-radius: var(--editor-border-radius);
    background: var(--editor-background);
  }

  .editor-mount,
  .source-editor {
    min-height: var(--editor-min-height);
  }

  .editor-mount[hidden],
  .source-editor[hidden] {
    display: none;
  }

  .editor-mount .ProseMirror {
    min-height: var(--editor-min-height);
    padding: var(--editor-padding);
    outline: none;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }

  .editor-mount .ProseMirror > *:first-child {
    margin-top: 0;
  }

  .editor-mount .ProseMirror > *:last-child {
    margin-bottom: 0;
  }

  .editor-mount .ProseMirror p {
    line-height: var(--editor-line-height);
  }

  .editor-mount .ProseMirror h1,
  .editor-mount .ProseMirror h2,
  .editor-mount .ProseMirror h3,
  .editor-mount .ProseMirror h4,
  .editor-mount .ProseMirror h5,
  .editor-mount .ProseMirror h6 {
    line-height: var(--editor-heading-line-height);
  }

  .editor-mount .ProseMirror blockquote {
    margin-left: 0;
    padding-left: 0;
  }

  .editor-mount .ProseMirror pre,
  .editor-mount .ProseMirror code {
    font-family: var(--editor-code-font-family);
    background: var(--editor-muted-background);
  }

  .editor-mount .ProseMirror pre {
    overflow-x: var(--editor-code-overflow-x);
    padding: var(--editor-code-padding);
    border-radius: var(--editor-code-border-radius);
    white-space: var(--editor-code-white-space);
    overflow-wrap: anywhere;
    word-break: var(--editor-code-word-break);
  }

  .editor-mount .ProseMirror code {
    border-radius: var(--editor-code-border-radius);
  }

  .editor-mount .ProseMirror pre code {
    padding: var(--editor-code-content-padding);
  }

  .editor-mount .ProseMirror .code-block-container pre {
    margin-top: 0;
  }

  .editor-mount .ProseMirror .code-block-content,
  .editor-mount .ProseMirror .code-block-content > pre,
  .editor-mount .ProseMirror .code-block-content > pre > code {
    background: var(--editor-code-background);
  }

  .code-block-content[data-line-numbers] {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    column-gap: var(--editor-code-content-padding);
  }

  .code-block-content[data-line-numbers] > pre {
    padding-block: var(--editor-code-content-padding);
  }

  .code-block-content[data-line-numbers] > pre > code {
    padding-block: 0;
  }

  .code-block-content[data-line-numbers] > pre.code-block-body > code {
    padding-inline: 0 var(--editor-code-content-padding);
  }

  .code-block-content pre {
    min-width: 0;
  }

  .code-line-numbers {
    font-family: var(--editor-code-font-family);
    line-height: var(--editor-line-height);
    vertical-align: top;
    white-space: pre;
    word-break: keep-all;
    user-select: none;
  }

  .code-line-numbers[hidden] {
    display: none;
  }

  .code-block-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    user-select: none;
  }

  .code-block-header[hidden] {
    display: none;
  }

  .code-block-language {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .code-block-language-control {
    position: relative;
    flex: 1 1 auto;
    min-width: 0;
  }

  .code-block-language-display {
    display: block;
    user-select: none;
  }

  .code-block-language-editor {
    box-sizing: border-box;
    position: absolute;
    z-index: 1;
    inset: 0;
    width: 100%;
    height: 100%;
    border: 0;
    padding: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    line-height: inherit;
    outline: none;
    opacity: 0;
    cursor: text;
    user-select: none;
  }

  .code-block-language-editor:not([readonly]):focus {
    opacity: 1;
    user-select: text;
  }

  .code-block-language-editor:not([readonly]):focus
    + .code-block-language-display {
    visibility: hidden;
  }

  .code-block-language-editor[readonly] {
    cursor: text;
    user-select: none;
  }

  .editor-mount .ProseMirror img {
    max-width: 100%;
    height: auto;
  }

  .editor-mount .ProseMirror li[data-task] {
    display: flex;
    align-items: flex-start;
    gap: 0.55em;
    list-style: none;
  }

  .editor-mount .ProseMirror li[data-task] > input {
    flex: 0 0 auto;
    width: 1em;
    height: 1em;
    margin: 0.38em 0 0;
    accent-color: var(--editor-accent);
  }

  .editor-mount .ProseMirror .task-content {
    flex: 1 1 auto;
    min-width: 0;
  }

  .editor-mount .ProseMirror .task-content > *:first-child {
    margin-top: 0;
  }

  .editor-mount .ProseMirror .task-content > *:last-child {
    margin-bottom: 0;
  }

  .editor-mount .ProseMirror li[data-checked="true"] .task-content {
    opacity: 0.7;
    text-decoration: line-through;
  }

  .editor-mount .ProseMirror table {
    width: 100%;
    margin: 1em 0;
    border-collapse: collapse;
  }

  .editor-mount .ProseMirror th,
  .editor-mount .ProseMirror td {
    min-width: 4em;
    padding: 0;
    text-align: left;
    vertical-align: top;
  }

  .editor-mount .ProseMirror th {
    background: var(--editor-muted-background);
    font-weight: 650;
  }

  .source-editor {
    display: block;
    width: 100%;
    resize: none;
    border: 0;
    padding: var(--editor-padding);
    outline: none;
    background: var(--editor-background);
    color: var(--editor-color);
    font: inherit;
    font-family: var(--editor-code-font-family);
    line-height: var(--editor-line-height);
    tab-size: 2;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }

  .block-source-panel {
    position: sticky;
    bottom: 0;
    z-index: 2;
    border-top: 1px solid var(--editor-border-color);
    padding: 12px;
    background: var(--editor-muted-background);
    box-shadow: 0 -8px 24px rgb(0 0 0 / 8%);
  }

  .block-source-panel textarea {
    display: block;
    width: 100%;
    min-height: 120px;
    resize: vertical;
    border: 1px solid var(--editor-border-color);
    border-radius: 6px;
    padding: 10px;
    background: var(--editor-background);
    color: var(--editor-color);
    font-family: var(--editor-code-font-family);
    font-size: 0.9em;
    line-height: 1.5;
  }

  .block-source-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 8px;
  }

  button {
    border: 1px solid var(--editor-border-color);
    border-radius: 6px;
    padding: 6px 10px;
    background: var(--editor-background);
    color: var(--editor-color);
    cursor: pointer;
  }

  button.primary {
    border-color: var(--editor-accent);
    background: var(--editor-accent);
    color: #ffffff;
  }

  :host([disabled]) {
    opacity: 0.65;
  }

  :host([disabled]) .surface {
    cursor: not-allowed;
  }

  .placeholder {
    pointer-events: none;
    position: absolute;
    margin: 16px;
    color: color-mix(in srgb, var(--editor-color) 45%, transparent);
  }
`;
