document.addEventListener('DOMContentLoaded', () => {
    const noteItems = document.querySelectorAll('.note-item');
    const contentSections = document.querySelectorAll('.content-section');
    const settingsButton = document.getElementById('settings-button');
    const settingsPopup = document.getElementById('settings-popup');
    const closeSettingsPopup = document.getElementById('close-settings-popup');
    const themeSelect = document.getElementById('theme-select');
    const body = document.body;

    noteItems.forEach(item => {
        item.addEventListener('click', () => {
            noteItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            const contentId = item.dataset.content;

            contentSections.forEach(section => {
                section.style.display = 'none';
            });

            const contentToShow = document.getElementById(contentId);
            if (contentToShow) {
                contentToShow.style.display = 'block';
            }
        });
    });

    settingsButton.addEventListener('click', () => {
        settingsPopup.style.display = 'flex';
    });

    closeSettingsPopup.addEventListener('click', () => {
        settingsPopup.style.display = 'none';
    });

    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode');
        }
    };

    const handleSystemTheme = () => {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        applyTheme(systemTheme);
    };

    themeSelect.addEventListener('change', () => {
        const selectedTheme = themeSelect.value;
        localStorage.setItem('theme', selectedTheme);

        if (selectedTheme === 'system') {
            handleSystemTheme();
        } else {
            applyTheme(selectedTheme);
        }
    });

    const savedTheme = localStorage.getItem('theme') || 'system';
    themeSelect.value = savedTheme;

    if (savedTheme === 'system') {
        handleSystemTheme();
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleSystemTheme);
    } else {
        applyTheme(savedTheme);
    }
});