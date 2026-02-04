// Game states
const STATE = {
    READY: 'ready',
    WAITING: 'waiting',
    CHANGED: 'changed',
    RESULT: 'result'
};

// Game colors
const COLORS = {
    START: '#202124',
    CHANGED: '#D4AF37'  // Less bright yellow (goldenrod)
};

// Game variables
let gameState = STATE.READY;
let startTime;
let timeoutId;
let bestTime = localStorage.getItem('bestTime') ? parseFloat(localStorage.getItem('bestTime')) : null;

// DOM elements
const gameArea = document.getElementById('game-area');
const instructions = document.getElementById('instructions');
const result = document.getElementById('result');
const bestTimeElement = document.getElementById('best-time');

// Update best time display
function updateBestTimeDisplay() {
    if (bestTime !== null) {
        bestTimeElement.textContent = `Best time: ${bestTime.toFixed(1)} ms`;
    } else {
        bestTimeElement.textContent = '';
    }
}

// Initialize the game
function init() {
    updateBestTimeDisplay();
    gameArea.addEventListener('click', handleClick);
}

// Handle click events
function handleClick() {
    switch (gameState) {
        case STATE.READY:
            // Start the game
            startGame();
            break;
        case STATE.WAITING:
            // Clicked too early
            tooEarly();
            break;
        case STATE.CHANGED:
            // Calculate reaction time
            calculateReactionTime();
            break;
        case STATE.RESULT:
            // Reset the game
            resetGame();
            break;
    }
}

// Start the game
function startGame() {
    gameState = STATE.WAITING;
    instructions.textContent = 'Wait for yellow...';
    result.textContent = '';
    gameArea.style.backgroundColor = COLORS.START;
    
    // Random delay between 1-5 seconds
    const delay = Math.floor(Math.random() * 4000) + 1000;
    timeoutId = setTimeout(changeColor, delay);
}

// Change color to signal reaction
function changeColor() {
    gameState = STATE.CHANGED;
    gameArea.style.backgroundColor = COLORS.CHANGED;
    startTime = Date.now();
}

// Handle early clicks
function tooEarly() {
    gameState = STATE.RESULT;
    clearTimeout(timeoutId);
    instructions.textContent = 'Too early! Click to try again.';
    result.textContent = '';
    gameArea.style.backgroundColor = COLORS.START;
}

// Calculate and display reaction time
function calculateReactionTime() {
    const endTime = Date.now();
    const reactionTime = endTime - startTime;
    
    gameState = STATE.RESULT;
    instructions.textContent = 'Click to try again';
    result.textContent = `${reactionTime} ms`;
    
    // Update best time if needed
    if (bestTime === null || reactionTime < bestTime) {
        bestTime = reactionTime;
        localStorage.setItem('bestTime', bestTime);
        updateBestTimeDisplay();
    }
}

// Reset the game
function resetGame() {
    gameState = STATE.READY;
    instructions.textContent = 'Click to start. Click again when the color changes to yellow.';
    result.textContent = '';
    gameArea.style.backgroundColor = COLORS.START;
}

// Initialize the game when the page loads
window.addEventListener('load', init);
