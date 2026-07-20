import { InputRule, inputRules } from 'prosemirror-inputrules';
import { keymap } from 'prosemirror-keymap';
import type { Plugin } from 'prosemirror-state';
import type { EditorCommand } from '../core/commands';
import type { EditorExtension } from './types';

export class ExtensionRegistry {
  readonly #extensions = new Map<string, EditorExtension>();

  add(extension: EditorExtension): void {
    if (!extension.name.trim()) {
      throw new Error('Extension name must not be empty.');
    }
    if (this.#extensions.has(extension.name)) {
      throw new Error(`Extension "${extension.name}" is already registered.`);
    }
    this.#extensions.set(extension.name, extension);
  }

  remove(name: string): boolean {
    return this.#extensions.delete(name);
  }

  has(name: string): boolean {
    return this.#extensions.has(name);
  }

  list(): readonly EditorExtension[] {
    return [...this.#extensions.values()].sort(
      (left, right) => (right.priority ?? 0) - (left.priority ?? 0),
    );
  }

  commands(base: Record<string, EditorCommand>): Record<string, EditorCommand> {
    const commands = { ...base };
    for (const extension of [...this.list()].reverse()) {
      Object.assign(commands, extension.commands);
    }
    return commands;
  }

  plugins(): Plugin[] {
    const plugins: Plugin[] = [];
    for (const extension of this.list()) {
      if (extension.shortcuts) {
        plugins.push(
          keymap(
            Object.fromEntries(
              Object.entries(extension.shortcuts).map(([shortcut, command]) => [
                shortcut,
                (state, dispatch, view) => command({ state, dispatch, view }),
              ]),
            ),
          ),
        );
      }

      if (extension.inputRules?.length) {
        plugins.push(
          inputRules({
            rules: extension.inputRules.map(
              (rule) =>
                new InputRule(rule.match, (state, match, start, end) =>
                  rule.run({
                    state,
                    match,
                    range: { from: start, to: end },
                  }),
                ),
            ),
          }),
        );
      }
    }
    return plugins;
  }
}
