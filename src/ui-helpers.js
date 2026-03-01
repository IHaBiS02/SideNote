/**
 * Creates and shows a dropdown element attached to the document body.
 * @param {Object} options
 * @param {string} options.className - CSS class for the dropdown.
 * @param {function(HTMLDivElement): void} options.populate - Callback to populate dropdown content.
 * @param {string[]} [options.excludeFromClose] - CSS selectors to exclude from outside-click closing.
 * @returns {HTMLDivElement} The dropdown element.
 */
function createDropdown({ className, populate, excludeFromClose = [] }) {
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
      // Check if click is on the dropdown itself
      if (dropdown.contains(event.target)) return;

      // Check if click is on any excluded selectors
      for (const selector of excludeFromClose) {
        if (event.target.matches(selector) || event.target.closest(selector)) return;
      }

      dropdown.remove();
      document.removeEventListener('click', closeDropdown);
    });
  }, 0);

  return dropdown;
}

export { createDropdown };
