document.addEventListener('DOMContentLoaded', () => {
    const noteItems = document.querySelectorAll('.note-item');
    const contentSections = document.querySelectorAll('.content-section');

    noteItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all items
            noteItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            item.classList.add('active');

            const contentId = item.dataset.content;

            // Hide all content sections
            contentSections.forEach(section => {
                section.style.display = 'none';
            });

            // Show the corresponding content section
            const contentToShow = document.getElementById(contentId);
            if (contentToShow) {
                contentToShow.style.display = 'block';
            }
        });
    });

    // Theme toggle functionality
    const themeToggleButton = document.getElementById('settings-button');
    const body = document.body;

    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
        });
    }
});