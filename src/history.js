// src/history.js
let navigationHistory = [];
const HISTORY_STACK_LIMIT = 20;

/**
 * Pushes a new state to the navigation history.
 * @param {object} state The state object to push.
 */
function pushToHistory(state) {
    const currentState = navigationHistory[navigationHistory.length - 1];
    // Avoid pushing identical consecutive states
    if (currentState && currentState.view === state.view && JSON.stringify(currentState.params || {}) === JSON.stringify(state.params || {})) {
        return;
    }

    navigationHistory.push(state);
    if (navigationHistory.length > HISTORY_STACK_LIMIT) {
        navigationHistory.shift();
    }
}

/**
 * Pops the last state from the navigation history.
 * @returns {object | undefined} The last state or undefined if history is empty.
 */
function popFromHistory() {
    return navigationHistory.pop();
}

/**
 * Gets the current state from the navigation history without removing it.
 * @returns {object | undefined} The current state or undefined if history is empty.
 */
function getCurrentHistoryState() {
    return navigationHistory[navigationHistory.length - 1];
}

/**
 * Clears the navigation history.
 */
function clearHistory() {
    navigationHistory = [];
}
