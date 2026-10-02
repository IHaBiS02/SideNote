/**
 * Creates and shows a dropdown element attached to the document body.
 * @param {Object} options
 * @param {string} options.className - CSS class for the dropdown.
 * @param {function(HTMLDivElement): void} options.populate - Callback to populate dropdown content.
 * @param {string[]} [options.excludeFromClose] - CSS selectors to exclude from outside-click closing.
 * @returns {HTMLDivElement} The dropdown element.
 */
interface DropdownOptions {
  className: string;
  populate: (dropdown: HTMLDivElement) => void;
  excludeFromClose?: string[];
}

function createDropdown({
  className,
  populate,
  excludeFromClose = [],
}: DropdownOptions): HTMLDivElement | null {
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
      if (target instanceof Node && dropdown.contains(target)) return;

      // Check if click is on any excluded selectors
      if (target instanceof Element) {
        for (const selector of excludeFromClose) {
          if (target.matches(selector) || target.closest(selector)) return;
        }
      }

      dropdown.remove();
      document.removeEventListener('click', closeDropdown);
    });
  }, 0);

  return dropdown;
}

function positionDropdownNearButton(
  dropdown: HTMLDivElement,
  button: HTMLButtonElement,
): void {
  const rect = button.getBoundingClientRect();
  const margin = 6;
  const left = Math.min(rect.left, window.innerWidth - dropdown.offsetWidth - margin);
  const topAbove = rect.top - dropdown.offsetHeight - margin;
  const top = topAbove >= margin ? topAbove : rect.bottom + margin;

  dropdown.style.left = `${Math.max(margin, left)}px`;
  setDropdownTop(dropdown, top);
}

function setDropdownTop(dropdown: HTMLDivElement, top: number): void {
  const margin = 6;
  const maxTop = window.innerHeight - dropdown.offsetHeight - margin;
  const boundedTop = Math.min(Math.max(margin, top), Math.max(margin, maxTop));
  dropdown.style.top = `${boundedTop}px`;
}

export { createDropdown, positionDropdownNearButton, setDropdownTop };
