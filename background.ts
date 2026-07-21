try {
  importScripts('vendor/browser-polyfill.min.js');
} catch (e) {
  console.error(e);
}

interface ChromeSidePanelApi {
  setPanelBehavior(options: { openPanelOnActionClick: boolean }): Promise<void>;
  open(options: { windowId?: number }): Promise<void>;
}

const activationCommandNames = new Set([
  '_execute_action',
  '_execute_sidebar_action',
]);
const shortcutSetupPopup = {
  url: 'shortcut-setup.html',
  type: 'popup' as const,
  width: 420,
  height: 300,
};

const extensionBrowser = browser as typeof browser & {
  sidePanel?: ChromeSidePanelApi;
};

if (extensionBrowser.sidePanel) {
  extensionBrowser.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));
}

browser.runtime.onInstalled.addListener((details) => {
  if (details.reason !== 'install') {
    return;
  }

  browser.commands
    .getAll()
    .then((commands) => {
      const activationCommand = commands.find((command) =>
        command.name ? activationCommandNames.has(command.name) : false,
      );

      if (activationCommand?.shortcut?.trim()) {
        return undefined;
      }

      return browser.windows.create({
        ...shortcutSetupPopup,
        url: browser.runtime.getURL(shortcutSetupPopup.url),
      });
    })
    .catch((error) => console.error('Failed to check the SideNote shortcut.', error));
});

browser.commands.onCommand.addListener((command, tab) => {
  if (command === '_execute_action') {
    if (extensionBrowser.sidePanel) {
      extensionBrowser.sidePanel.open({ windowId: tab?.windowId });
    }
  } else if (command === '_execute_sidebar_action') {
    if (browser.sidebarAction) {
      browser.sidebarAction.toggle();
    }
  }
});
