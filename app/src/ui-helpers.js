function createDropdown({ className, populate, excludeFromClose = [], }) {
    // Remove any existing dropdown of the same class
    const existing = document.querySelector(`.${className}`);
    if (existing) {
        existing.remove();
        return null;
    }
    const dropdown = document.createElement('div');
    dropdown.classList.add(className);
    populate(dropdown);
    document.body.appendChild(dropdown);
    // Close when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeDropdown(event) {
            const target = event.target;
            // Check if click is on the dropdown itself
            if (target instanceof Node && dropdown.contains(target))
                return;
            // Check if click is on any excluded selectors
            if (target instanceof Element) {
                for (const selector of excludeFromClose) {
                    if (target.matches(selector) || target.closest(selector))
                        return;
                }
            }
            dropdown.remove();
            document.removeEventListener('click', closeDropdown);
        });
    }, 0);
    return dropdown;
}
export { createDropdown };
