import { describe, expect, it } from 'vitest';
import { createNoteContentStyles } from '../../src/editor/note-content-styles.js';

describe('shared note content styles', () => {
  it('aligns Preview checkboxes to the first line and preserves inline export layout', () => {
    const previewCss = createNoteContentStyles({
      rootSelector: '.editor-mount .ProseMirror',
      variableNamespace: 'editor',
      taskItemSelector: 'li[data-task]',
      taskContentSelector: '.task-content',
      checkedTaskSelector: 'li[data-checked="true"]',
      tableAlignmentSource: 'style',
    });
    const exportCss = createNoteContentStyles({
      rootSelector: '.sidenote-export .note-content',
      variableNamespace: 'export',
      taskItemSelector: 'li.task-list-item',
      tableAlignmentSource: 'align',
    });

    for (const css of [previewCss, exportCss]) {
      expect(css).toContain('display: inline-block');
      expect(css).toContain('vertical-align: middle');
      expect(css).toContain('margin-block: 0.67em');
      expect(css).toContain('border-collapse: collapse');
    }

    expect(previewCss).toContain('align-items: flex-start; gap: 5px');
    expect(previewCss).toContain('font: inherit; flex: 0 0 auto');
    expect(previewCss).toContain('width: 1em');
    expect(previewCss).toContain('height: 1em');
    expect(previewCss).toContain('margin: calc((var(--editor-line-height) - 1) * 0.5em) 0 0');
    expect(exportCss).toContain('width: auto');
    expect(exportCss).toContain('height: auto');
    expect(exportCss).toContain('margin: 0 5px 0 0');

    expect(previewCss).toContain('accent-color: var(--editor-checkbox-accent)');
    expect(exportCss).toContain('accent-color: var(--export-checkbox-accent)');
  });

  it('adapts renderer-specific task and table selectors', () => {
    const previewCss = createNoteContentStyles({
      rootSelector: '.preview',
      variableNamespace: 'editor',
      taskItemSelector: 'li[data-task]',
      taskContentSelector: '.task-content',
      checkedTaskSelector: 'li[data-checked="true"]',
      tableAlignmentSource: 'style',
    });
    const exportCss = createNoteContentStyles({
      rootSelector: '.export',
      variableNamespace: 'export',
      taskItemSelector: 'li.task-list-item',
      tableAlignmentSource: 'align',
    });

    expect(previewCss).toContain("th[style*='text-align: left']");
    expect(previewCss).toContain('.preview li[data-task] > .task-content');
    expect(exportCss).toContain('th[align="left"]');
    expect(exportCss).toContain('.export li.task-list-item');
    expect(exportCss).not.toContain('.task-content');
  });
});
