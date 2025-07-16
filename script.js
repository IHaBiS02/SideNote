document.addEventListener('DOMContentLoaded', () => {
    const noteItems = document.querySelectorAll('.note-item');
    const contentSections = document.querySelectorAll('.content-section');
    const settingsButton = document.getElementById('settings-button');
    const themeSelect = document.getElementById('theme-select');
    const body = document.body;

    const setActiveItem = (item) => {
        noteItems.forEach(i => i.classList.remove('active'));
        if (item) {
            item.classList.add('active');
        }
    };

    const showContent = (contentId) => {
        contentSections.forEach(section => {
            section.style.display = 'none';
        });
        const contentToShow = document.getElementById(contentId);
        if (contentToShow) {
            contentToShow.style.display = 'block';
        }
    };

    noteItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if (e.target.classList.contains('pin-button') || e.target.classList.contains('delete-button')) {
                return;
            }
            setActiveItem(item);
            showContent(item.dataset.content);
        });
    });

    settingsButton.addEventListener('click', () => {
        setActiveItem(null);
        showContent('settings');
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