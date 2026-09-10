const openShortcutSettingsButton = document.querySelector('#open-shortcut-settings-button');
const dismissButton = document.querySelector('#dismiss-button');
const shortcutError = document.querySelector('#shortcut-error');
export async function openBrowserShortcutSettings() {
    if (typeof browser.commands.openShortcutSettings === 'function') {
        await browser.commands.openShortcutSettings();
        return;
    }
    await browser.tabs.create({ url: 'chrome://extensions/shortcuts' });
}
async function handleOpenShortcutSettings() {
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
    }
    catch (error) {
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
