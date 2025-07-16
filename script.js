document.addEventListener('DOMContentLoaded', () => {
    const themeToggleButton = document.getElementById('theme-toggle-button');
    const body = document.body;

    themeToggleButton.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
    });
});
