import {
  setBlockType,
  toggleMark,
  wrapIn,
} from 'prosemirror-commands';
import type { Command, EditorState, Transaction } from 'prosemirror-state';
import type { EditorView } from 'prosemirror-view';
import { redo, undo } from 'prosemirror-history';
import { markdownSchema } from './markdown';

export type EditorDispatch = (transaction: Transaction) => void;

export interface EditorCommandContext {
  state: EditorState;
  dispatch?: EditorDispatch;
  view?: EditorView;
}

export type EditorCommand = (context: EditorCommandContext) => boolean;

function fromProseMirrorCommand(command: Command): EditorCommand {
  return ({ state, dispatch, view }) => command(state, dispatch, view);
}

export const standardCommands: Record<string, EditorCommand> = {
  undo: fromProseMirrorCommand(undo),
  redo: fromProseMirrorCommand(redo),
  paragraph: fromProseMirrorCommand(setBlockType(markdownSchema.nodes.paragraph)),
  heading1: fromProseMirrorCommand(
    setBlockType(markdownSchema.nodes.heading, { level: 1 }),
  ),
  heading2: fromProseMirrorCommand(
    setBlockType(markdownSchema.nodes.heading, { level: 2 }),
  ),
  heading3: fromProseMirrorCommand(
    setBlockType(markdownSchema.nodes.heading, { level: 3 }),
  ),
  toggleBold: fromProseMirrorCommand(toggleMark(markdownSchema.marks.strong)),
  toggleItalic: fromProseMirrorCommand(toggleMark(markdownSchema.marks.em)),
  toggleCode: fromProseMirrorCommand(toggleMark(markdownSchema.marks.code)),
  toggleStrike: fromProseMirrorCommand(toggleMark(markdownSchema.marks.strike)),
  blockquote: fromProseMirrorCommand(wrapIn(markdownSchema.nodes.blockquote)),
};
