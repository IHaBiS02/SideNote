chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

chrome.commands.onCommand.addListener((command, tab) => {
  if (command === '_execute_action') {
    chrome.sidePanel.open({ windowId: tab.windowId });
  }
});
