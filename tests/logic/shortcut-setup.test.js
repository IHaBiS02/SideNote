import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const originalBrowser = globalThis.browser;

describe('shortcut setup popup', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.restoreAllMocks();
    globalThis.browser = originalBrowser;
  });

  it('uses the browser shortcut-settings API when it is available', async () => {
    const openShortcutSettings = vi.fn(async () => undefined);
    const createTab = vi.fn(async () => ({}));
    globalThis.browser = {
      commands: { openShortcutSettings },
      tabs: { create: createTab },
    };
    const { openBrowserShortcutSettings } = await import('../../src/shortcut-setup.js');

    await openBrowserShortcutSettings();

    expect(openShortcutSettings).toHaveBeenCalledOnce();
    expect(createTab).not.toHaveBeenCalled();
  });

  it('opens Chrome shortcut settings from the popup button when the API is unavailable', async () => {
    document.body.innerHTML = `
      <button id="open-shortcut-settings-button" type="button">Open</button>
      <button id="dismiss-button" type="button">Dismiss</button>
      <p id="shortcut-error" hidden>Error</p>
    `;
    const createTab = vi.fn(async () => ({}));
    const closeWindow = vi.spyOn(window, 'close').mockImplementation(() => undefined);
    globalThis.browser = {
      commands: {},
      tabs: { create: createTab },
    };
    await import('../../src/shortcut-setup.js');

    document.getElementById('open-shortcut-settings-button').click();

    await vi.waitFor(() => {
      expect(createTab).toHaveBeenCalledWith({
        url: 'chrome://extensions/shortcuts',
      });
      expect(closeWindow).toHaveBeenCalledOnce();
    });
  });
});
