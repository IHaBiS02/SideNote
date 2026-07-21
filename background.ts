try {
  importScripts('vendor/browser-polyfill.min.js');
} catch (e) {
  console.error(e);
}

interface ChromeSidePanelApi {
  setPanelBehavior(options: { openPanelOnActionClick: boolean }): Promise<void>;
  open(options: { windowId?: number }): Promise<void>;
}

const extensionBrowser = browser as typeof browser & {
  sidePanel?: ChromeSidePanelApi;
};

if (extensionBrowser.sidePanel) {
  extensionBrowser.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));
}

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
