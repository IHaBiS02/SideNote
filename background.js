try {
  importScripts('vendor/browser-polyfill.min.js');
} catch (e) {
  console.error(e);
}

if (browser.sidePanel) {
  browser.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));
}

browser.commands.onCommand.addListener((command, tab) => {
  if (command === '_execute_action') {
    if (browser.sidePanel) {
      browser.sidePanel.open({ windowId: tab.windowId });
    }
  } else if (command === '_execute_sidebar_action') {
    if (browser.sidebarAction) {
      browser.sidebarAction.toggle();
    }
  }
});
