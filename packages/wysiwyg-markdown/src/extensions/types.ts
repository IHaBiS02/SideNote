import type { NodeType } from 'prosemirror-model';
import type { EditorState, Transaction } from 'prosemirror-state';
import type { EditorCommand } from '../core/commands';

export interface EditorInputRuleContext {
  state: EditorState;
  match: RegExpMatchArray;
  range: {
    from: number;
    to: number;
  };
}

export interface EditorInputRule {
  match: RegExp;
  run: (context: EditorInputRuleContext) => Transaction | null;
}

export interface EditorExtension {
  name: string;
  priority?: number;
  commands?: Record<string, EditorCommand>;
  shortcuts?: Record<string, EditorCommand>;
  inputRules?: EditorInputRule[];
}

export interface StructuralExtension {
  name: string;
  nodes?: Record<string, NodeType>;
}
