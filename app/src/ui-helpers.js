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
function positionDropdownNearButton(dropdown, button) {
    const rect = button.getBoundingClientRect();
    const margin = 6;
    const left = Math.min(rect.left, window.innerWidth - dropdown.offsetWidth - margin);
    const topAbove = rect.top - dropdown.offsetHeight - margin;
    const top = topAbove >= margin ? topAbove : rect.bottom + margin;
    dropdown.style.left = `${Math.max(margin, left)}px`;
    setDropdownTop(dropdown, top);
}
function setDropdownTop(dropdown, top) {
    const margin = 6;
    const maxTop = window.innerHeight - dropdown.offsetHeight - margin;
    const boundedTop = Math.min(Math.max(margin, top), Math.max(margin, maxTop));
    dropdown.style.top = `${boundedTop}px`;
}
export { createDropdown, positionDropdownNearButton, setDropdownTop };
