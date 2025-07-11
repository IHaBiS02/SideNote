try {
  importScripts('vendor/browser-polyfill.min.js');
} catch (e) {
  console.error(e);
}

browser.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

browser.commands.onCommand.addListener((command, tab) => {
  if (command === '_execute_action') {
    browser.sidePanel.open({ windowId: tab.windowId });
  }
});
