// src/history.js
let navigationHistory = [];
let historyIndex = -1; // Points to the current state in the history
const HISTORY_STACK_LIMIT = 20;

/**
 * Pushes a new state to the navigation history.
 * If we are not at the end of the history, future states are cleared.
 * @param {object} state The state object to push.
 */
function pushToHistory(state) {
    const currentState = getCurrentHistoryState();
    // Avoid pushing identical consecutive states
    if (currentState && currentState.view === state.view && JSON.stringify(currentState.params || {}) === JSON.stringify(state.params || {})) {
        return;
    }

    // If we've gone back and are now creating a new path, truncate the future history
    if (historyIndex < navigationHistory.length - 1) {
        navigationHistory = navigationHistory.slice(0, historyIndex + 1);
    }

    navigationHistory.push(state);
    historyIndex++;

    if (navigationHistory.length > HISTORY_STACK_LIMIT) {
        navigationHistory.shift();
        historyIndex--; // Adjust index because we shifted the array
    }
}

/**
 * Moves back in the history.
 * @returns {object | undefined} The previous state or undefined if at the beginning.
 */
function moveBack() {
    if (canMoveBack()) {
        historyIndex--;
        return getCurrentHistoryState();
    }
    return undefined;
}

/**
 * Moves forward in the history.
 * @returns {object | undefined} The next state or undefined if at the end.
 */
function moveForward() {
    if (canMoveForward()) {
        historyIndex++;
        return getCurrentHistoryState();
    }
    return undefined;
}

/**
 * Checks if it's possible to go back.
 * @returns {boolean}
 */
function canMoveBack() {
    return historyIndex > 0;
}

/**
 * Checks if it's possible to go forward.
 * @returns {boolean}
 */
function canMoveForward() {
    return historyIndex < navigationHistory.length - 1;
}


/**
 * Gets the current state from the navigation history without moving the pointer.
 * @returns {object | undefined} The current state or undefined if history is empty.
 */
function getCurrentHistoryState() {
    if (historyIndex >= 0 && historyIndex < navigationHistory.length) {
        return navigationHistory[historyIndex];
    }
    return undefined;
}

/**
 * Clears the navigation history.
 */
function clearHistory() {
    navigationHistory = [];
    historyIndex = -1;
}

/**
 * Returns the entire navigation history stack.
 * @returns {Array} The navigation history.
 */
function getHistory() {
    return [...navigationHistory];
}

/**
 * Returns the current index in the history.
 * @returns {number}
 */
function getHistoryIndex() {
    return historyIndex;
}

/**
 * Navigates to a specific index in the history.
 * @param {number} index The index to navigate to.
 */
function goToHistoryState(index) {
    if (index >= 0 && index < navigationHistory.length) {
        historyIndex = index;
    }
}