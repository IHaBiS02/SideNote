import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const originalBrowser = globalThis.browser;
const originalImportScripts = globalThis.importScripts;

function createBrowserMock({
  commandName = '_execute_action',
  shortcut = '',
} = {}) {
  let installedListener;
  const browserMock = {
    commands: {
      getAll: vi.fn(async () => [{ name: commandName, shortcut }]),
      onCommand: {
        addListener: vi.fn(),
      },
    },
    runtime: {
      getURL: vi.fn((path) => `moz-extension://sidenote/${path}`),
      onInstalled: {
        addListener: vi.fn((listener) => {
          installedListener = listener;
        }),
      },
    },
    windows: {
      create: vi.fn(async () => ({})),
    },
  };

  return {
    browserMock,
    getInstalledListener: () => installedListener,
  };
}

async function loadBackground(options) {
  const mock = createBrowserMock(options);
  globalThis.browser = mock.browserMock;
  globalThis.importScripts = vi.fn();

  await import('../../background.js');

  return mock;
}

describe('background shortcut setup check', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  afterEach(() => {
    globalThis.browser = originalBrowser;
    if (originalImportScripts) {
      globalThis.importScripts = originalImportScripts;
    } else {
      delete globalThis.importScripts;
    }
  });

  it('opens the setup popup after installation when the Chrome action shortcut is empty', async () => {
    const { browserMock, getInstalledListener } = await loadBackground();

    getInstalledListener()({ reason: 'install' });

    await vi.waitFor(() => {
      expect(browserMock.windows.create).toHaveBeenCalledWith({
        url: 'moz-extension://sidenote/shortcut-setup.html',
        type: 'popup',
        width: 420,
        height: 300,
      });
    });
  });

  it('recognizes the Firefox sidebar shortcut and does not prompt when assigned', async () => {
    const { browserMock, getInstalledListener } = await loadBackground({
      commandName: '_execute_sidebar_action',
      shortcut: 'Alt+Shift+W',
    });

    getInstalledListener()({ reason: 'install' });

    await vi.waitFor(() => expect(browserMock.commands.getAll).toHaveBeenCalled());
    expect(browserMock.windows.create).not.toHaveBeenCalled();
  });

  it('does not check or prompt when the extension is updated', async () => {
    const { browserMock, getInstalledListener } = await loadBackground();

    getInstalledListener()({ reason: 'update' });

    expect(browserMock.commands.getAll).not.toHaveBeenCalled();
    expect(browserMock.windows.create).not.toHaveBeenCalled();
  });
});
