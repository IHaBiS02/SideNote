// src/history.js
// 네비게이션 히스토리를 관리하는 모듈
let navigationHistory = [];  // 네비게이션 히스토리 스택
let historyIndex = -1; // 현재 히스토리 상태를 가리키는 인덱스
const HISTORY_STACK_LIMIT = 512;  // 히스토리 최대 크기 제한

/**
 * Pushes a new state to the navigation history.
 * If we are not at the end of the history, future states are cleared.
 * @param {object} state The state object to push.
 */
function pushToHistory(state) {
    const currentState = getCurrentHistoryState();
    // 동일한 상태가 연속적으로 추가되는 것 방지
    if (currentState && currentState.view === state.view && JSON.stringify(currentState.params || {}) === JSON.stringify(state.params || {})) {
        return;
    }

    // 뒤로 간 상태에서 새로운 경로를 만들면 미래 히스토리 삭제
    if (historyIndex < navigationHistory.length - 1) {
        navigationHistory = navigationHistory.slice(0, historyIndex + 1);
        // 히스토리가 잘렸음을 알리는 이벤트 발생
        document.dispatchEvent(new CustomEvent('historytruncated'));
    }

    // 새 상태를 히스토리에 추가
    navigationHistory.push(state);
    historyIndex++;

    // 히스토리 크기 제한 초과 시 가장 오래된 항목 제거
    if (navigationHistory.length > HISTORY_STACK_LIMIT) {
        navigationHistory.shift();
        historyIndex--; // 배열 shift로 인한 인덱스 조정
    }
}

/**
 * Moves back in the history.
 * @returns {object | undefined} The previous state or undefined if at the beginning.
 */
function moveBack() {
    if (canMoveBack()) {
        historyIndex--;  // 인덱스를 하나 감소
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
    // 유효한 인덱스 범위 확인 후 이동
    if (index >= 0 && index < navigationHistory.length) {
        historyIndex = index;
    }
}