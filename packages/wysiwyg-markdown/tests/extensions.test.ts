import { describe, expect, it, vi } from 'vitest';
import { ExtensionRegistry } from '../src/extensions/registry';

describe('ExtensionRegistry', () => {
  it('orders extensions by priority', () => {
    const registry = new ExtensionRegistry();
    registry.add({ name: 'low', priority: 1 });
    registry.add({ name: 'high', priority: 10 });

    expect(registry.list().map((extension) => extension.name)).toEqual([
      'high',
      'low',
    ]);
  });

  it('rejects duplicate extension names', () => {
    const registry = new ExtensionRegistry();
    registry.add({ name: 'duplicate' });

    expect(() => registry.add({ name: 'duplicate' })).toThrow(
      'already registered',
    );
  });

  it('lets higher-priority commands replace lower-priority commands', () => {
    const registry = new ExtensionRegistry();
    const low = vi.fn(() => true);
    const high = vi.fn(() => true);
    registry.add({ name: 'low', priority: 1, commands: { custom: low } });
    registry.add({ name: 'high', priority: 10, commands: { custom: high } });

    expect(registry.commands({}).custom).toBe(high);
  });
});
