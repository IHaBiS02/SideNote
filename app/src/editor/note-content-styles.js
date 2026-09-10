/**
 * Creates the semantic Markdown body styles used by both SideNote Preview and
 * standalone document exports. Renderer-specific chrome (such as editable
 * code-block node views) remains with the renderer that owns its DOM.
 */
function createNoteContentStyles({ rootSelector: root, variableNamespace: namespace, taskItemSelector, taskContentSelector, checkedTaskSelector, tableAlignmentSource, }) {
    const variable = (name) => `var(--${namespace}-${name})`;
    const taskItem = `${root} ${taskItemSelector}`;
    const taskContent = taskContentSelector
        ? `${taskItem} > ${taskContentSelector}`
        : null;
    const checkedTaskContent = checkedTaskSelector && taskContentSelector
        ? `${root} ${checkedTaskSelector} ${taskContentSelector}`
        : null;
    const leftAlignment = tableAlignmentSource === 'style'
        ? "[style*='text-align: left']"
        : '[align="left"]';
    const rightAlignment = tableAlignmentSource === 'style'
        ? "[style*='text-align: right']"
        : '[align="right"]';
    return `
  ${root} {
    font-family: ${variable('font-family')};
    line-height: ${variable('line-height')};
    overflow-wrap: anywhere;
    word-break: break-word;
  }

  ${root} > *:first-child {
    margin-top: 0;
  }

  ${root} > *:last-child {
    margin-bottom: 0;
  }

  ${root} p {
    margin-block: 1em;
    line-height: ${variable('line-height')};
  }

  ${root} h1,
  ${root} h2,
  ${root} h3,
  ${root} h4,
  ${root} h5,
  ${root} h6 {
    font-weight: 700;
    line-height: ${variable('heading-line-height')};
  }

  ${root} h1 { margin-block: 0.67em; font-size: 2em; }
  ${root} h2 { margin-block: 0.83em; font-size: 1.5em; }
  ${root} h3 { margin-block: 1em; font-size: 1.17em; }
  ${root} h4 { margin-block: 1.33em; font-size: 1em; }
  ${root} h5 { margin-block: 1.67em; font-size: 0.83em; }
  ${root} h6 { margin-block: 2.33em; font-size: 0.67em; }

  ${root} strong { font-weight: 700; }
  ${root} em { font-style: italic; }

  ${root} ul,
  ${root} ol {
    margin-block: 1em;
    padding-left: 15px;
  }

  ${root} li::marker {
    color: ${variable('list-marker-color')};
  }

  ${root} blockquote {
    margin: 1em 40px 1em 0;
    border-left: 4px solid ${variable('border-color')};
    padding-left: 10px;
  }

  ${root} a {
    color: ${variable('link-color')};
    text-decoration: none;
  }

  ${root} a:visited {
    color: ${variable('link-visited-color')};
  }

  ${root} a:hover {
    color: ${variable('link-hover-color')};
    text-decoration: underline;
  }

  ${root} a:active {
    color: ${variable('link-active-color')};
  }

  ${root} :not(pre) > code {
    border: 1px solid ${variable('inline-code-border')};
    border-radius: 4px;
    padding: 2px 4px;
    background: ${variable('inline-code-background')};
  }

  ${root} code {
    font-family: ${variable('code-font-family')};
  }

  ${taskItem} {
    display: ${taskContent ? 'flex' : 'list-item'};
    ${taskContent ? 'align-items: flex-start; gap: 5px;' : ''}
    list-style: none;
  }

  ${taskItem} > input[type="checkbox"] {
    display: inline-block;
    width: ${taskContent ? '1em' : 'auto'};
    height: ${taskContent ? '1em' : 'auto'};
    ${taskContent ? 'font: inherit; flex: 0 0 auto;' : ''}
    margin: ${taskContent ? `calc((${variable('line-height')} - 1) * 0.5em) 0 0` : '0 5px 0 0'};
    accent-color: ${variable('checkbox-accent')};
    vertical-align: middle;
  }

  ${taskContent ? `${taskContent} {
    display: block;
    flex: 1 1 auto;
    min-width: 0;
  }

  ${taskContent} > p {
    display: block;
  }

  ${taskContent} > :first-child {
    margin-top: 0;
  }

  ${taskContent} > :last-child {
    margin-bottom: 0;
  }` : ''}

  ${checkedTaskContent ? `${checkedTaskContent} {
    opacity: 1;
    text-decoration: none;
  }` : ''}

  ${root} img {
    max-width: 100%;
    height: auto;
  }

  ${root} table {
    width: auto;
    margin: 0;
    border-collapse: collapse;
    border-spacing: 0;
    table-layout: auto;
  }

  ${root} th,
  ${root} td {
    min-width: 0;
    border: 1px solid ${variable('table-border-color')};
    padding: 1px;
    overflow-wrap: anywhere;
    text-align: center;
    vertical-align: top;
  }

  ${root} th${leftAlignment},
  ${root} td${leftAlignment} {
    padding-left: ${variable('table-aligned-cell-padding')};
    text-align: left;
  }

  ${root} th${rightAlignment},
  ${root} td${rightAlignment} {
    padding-right: ${variable('table-aligned-cell-padding')};
    text-align: right;
  }

  ${root} th {
    background: transparent;
    font-weight: 650;
  }

  ${root} .hljs-comment,
  ${root} .hljs-quote {
    color: ${variable('hl-comment')};
    font-style: italic;
  }

  ${root} .hljs-doctag,
  ${root} .hljs-keyword,
  ${root} .hljs-formula {
    color: ${variable('hl-keyword')};
  }

  ${root} .hljs-section,
  ${root} .hljs-name,
  ${root} .hljs-selector-tag,
  ${root} .hljs-deletion,
  ${root} .hljs-subst {
    color: ${variable('hl-name')};
  }

  ${root} .hljs-literal {
    color: ${variable('hl-literal')};
  }

  ${root} .hljs-string,
  ${root} .hljs-regexp,
  ${root} .hljs-addition,
  ${root} .hljs-attribute,
  ${root} .hljs-meta .hljs-string {
    color: ${variable('hl-string')};
  }

  ${root} .hljs-attr,
  ${root} .hljs-variable,
  ${root} .hljs-template-variable,
  ${root} .hljs-type,
  ${root} .hljs-selector-class,
  ${root} .hljs-selector-attr,
  ${root} .hljs-selector-pseudo,
  ${root} .hljs-number {
    color: ${variable('hl-number')};
  }

  ${root} .hljs-symbol,
  ${root} .hljs-bullet,
  ${root} .hljs-link,
  ${root} .hljs-meta,
  ${root} .hljs-selector-id,
  ${root} .hljs-title {
    color: ${variable('hl-title')};
  }

  ${root} .hljs-built_in,
  ${root} .hljs-title.class_,
  ${root} .hljs-class .hljs-title {
    color: ${variable('hl-built-in')};
  }

  ${root} .hljs-emphasis { font-style: italic; }
  ${root} .hljs-strong { font-weight: bold; }
  ${root} .hljs-link { text-decoration: underline; }
`;
}
export { createNoteContentStyles };
