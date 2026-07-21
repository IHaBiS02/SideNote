const openShortcutSettingsButton = document.querySelector<HTMLButtonElement>(
  '#open-shortcut-settings-button',
);
const dismissButton = document.querySelector<HTMLButtonElement>('#dismiss-button');
const shortcutError = document.querySelector<HTMLElement>('#shortcut-error');

export async function openBrowserShortcutSettings(): Promise<void> {
  if (typeof browser.commands.openShortcutSettings === 'function') {
    await browser.commands.openShortcutSettings();
    return;
  }

  await browser.tabs.create({ url: 'chrome://extensions/shortcuts' });
}

async function handleOpenShortcutSettings(): Promise<void> {
  if (!openShortcutSettingsButton) {
    return;
  }

  openShortcutSettingsButton.disabled = true;
  if (shortcutError) {
    shortcutError.hidden = true;
  }

  try {
    await openBrowserShortcutSettings();
    window.close();
  } catch (error) {
    console.error('Failed to open extension shortcut settings.', error);
    openShortcutSettingsButton.disabled = false;
    if (shortcutError) {
      shortcutError.hidden = false;
    }
  }
}

openShortcutSettingsButton?.addEventListener('click', () => {
  void handleOpenShortcutSettings();
});

dismissButton?.addEventListener('click', () => window.close());
