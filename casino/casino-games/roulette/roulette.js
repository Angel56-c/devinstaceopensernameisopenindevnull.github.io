// Game configuration
const CONFIG = {
    minBet: 1,
    maxBet: 5000,
    initialBalance: 1000,
    spinDuration: 4000, // ms
    numberColors: {
        0: 'green',
        32: 'red', 15: 'black',
        19: 'red', 4: 'black',
        21: 'red', 2: 'black',
        25: 'red', 17: 'black',
        34: 'red', 6: 'black',
        27: 'red', 13: 'black',
        36: 'red', 11: 'black',
        30: 'red', 8: 'black',
        23: 'red', 10: 'black',
        5: 'red', 24: 'black',
        16: 'red', 33: 'black',
        1: 'red', 20: 'black',
        14: 'red', 31: 'black',
        9: 'red', 22: 'black',
        18: 'red', 29: 'black',
        7: 'red', 28: 'black',
        12: 'red', 35: 'black',
        3: 'red', 26: 'black'
    },
    payouts: {
        straight: 35,
        split: 17,
        street: 11,
        corner: 8,
        line: 5,
        dozen: 2,
        column: 2,
        red: 1,
        black: 1,
        even: 1,
        odd: 1,
        low: 1,
        high: 1,
        zero: 35
    }
};

// Game state
const state = {
    balance: CONFIG.initialBalance,
    currentBet: 10,
    bets: {},
    isSpinning: false,
    autoSpin: false,
    autoSpinCount: 0,
    maxAutoSpins: 10,
    history: [],
    serverSeed: generateRandomSeed(),
    clientSeed: generateRandomSeed(),
    nonce: 0
};

// DOM elements
const elements = {
    wheel: document.getElementById('wheel'),
    ball: document.getElementById('ball'),
    spinBtn: document.getElementById('spin'),
    result: document.getElementById('result'),
    history: document.getElementById('history'),
    balance: document.getElementById('balance'),
    chipSelection: document.querySelector('.chip-selection'),
    customBet: document.getElementById('custom-bet'),
    halfBet: document.getElementById('half-bet'),
    doubleBet: document.getElementById('double-bet'),
    maxBet: document.getElementById('max-bet'),
    clearBets: document.getElementById('clear-bets'),
    insideBets: document.getElementById('inside-bets'),
    startAuto: document.getElementById('start-auto'),
    stopAuto: document.getElementById('stop-auto'),
    autoSpins: document.getElementById('auto-spins')
};

// Initialize the game
function initGame() {
    createWheel();
    createBettingGrid();
    setupEventListeners();
    updateUI();
}

// Create the roulette wheel with numbers
function createWheel() {
    const numbers = Object.entries(CONFIG.numberColors);

    numbers.forEach(([number, color], index) => {
        const angle = (index / numbers.length) * 360;
        const numElement = document.createElement('div');
        numElement.className = `number ${color}`;
        numElement.textContent = number;
        numElement.style.transform = `rotate(${angle}deg) translate(120px) rotate(${-angle}deg)`;
        elements.wheel.appendChild(numElement);
    });
}

// Create the betting grid
function createBettingGrid() {
    // Create number cells (1-36)
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 12; col++) {
            const num = (row * 12) + (col + 1);
            const color = CONFIG.numberColors[num];

            const cell = document.createElement('div');
            cell.className = `number-cell ${color}`;
            cell.textContent = num;
            cell.dataset.number = num;
            cell.addEventListener('click', () => placeBet('straight', num));
            elements.insideBets.appendChild(cell);
        }
    }
}

// Set up event listeners
function setupEventListeners() {
    // Chip selection
    Array.from(elements.chipSelection.children).forEach(chip => {
        chip.addEventListener('click', () => {
            // Remove active class from all chips
            Array.from(elements.chipSelection.children).forEach(c => c.classList.remove('active'));
            // Add active class to clicked chip
            chip.classList.add('active');
            // Set current bet
            state.currentBet = parseInt(chip.dataset.value);
            elements.customBet.value = state.currentBet;
        });
    });

    // Set first chip as active by default
    if (elements.chipSelection.children.length > 0) {
        elements.chipSelection.children[2].classList.add('active');
    }

    // Custom bet input
    elements.customBet.addEventListener('change', () => {
        const betValue = parseInt(elements.customBet.value);
        if (!isNaN(betValue) {
            state.currentBet = Math.max(CONFIG.minBet, Math.min(CONFIG.maxBet, betValue));
            elements.customBet.value = state.currentBet;
            updateCurrentBetDisplay();
        }
    });

    // Quick bet buttons
    elements.halfBet.addEventListener('click', () => {
        state.currentBet = Math.max(CONFIG.minBet, Math.floor(state.currentBet / 2));
        updateCurrentBetDisplay();
    });

    elements.doubleBet.addEventListener('click', () => {
        state.currentBet = Math.min(CONFIG.maxBet, state.currentBet * 2);
        updateCurrentBetDisplay();
    });

    elements.maxBet.addEventListener('click', () => {
        state.currentBet = Math.min(CONFIG.maxBet, state.balance);
        updateCurrentBetDisplay();
    });

    elements.clearBets.addEventListener('click', clearBets);

    // Outside bets
    document.querySelectorAll('.outside-bet').forEach(bet => {
        bet.addEventListener('click', () => placeOutsideBet(bet.dataset.betType));
    });

    // Spin button
    elements.spinBtn.addEventListener('click', spin);

    // Auto bet controls
    elements.startAuto.addEventListener('click', startAutoSpin);
    elements.stopAuto.addEventListener('click', stopAutoSpin);
}

// Update current bet display
function updateCurrentBetDisplay() {
    elements.customBet.value = state.currentBet;

    // Find and select matching chip if exists
    let foundChip = false;
    Array.from(elements.chipSelection.children).forEach(chip => {
        chip.classList.remove('active');
        if (parseInt(chip.dataset.value) === state.currentBet) {
            chip.classList.add('active');
            foundChip = true;
        }
    });

    if (!foundChip && elements.chipSelection.children.length > 0) {
        elements.chipSelection.children[0].classList.add('active');
    }
}

// Place a straight bet on a number
function placeBet(type, number) {
    if (state.isSpinning) return;

    const betAmount = state.currentBet;
    if (betAmount > state.balance) {
        alert('Not enough balance');
        return;
    }

    const betKey = `${type}-${number}`;
    state.bets[betKey] = (state.bets[betKey] || 0) + betAmount;
    state.balance -= betAmount;

    // Update bet display
    updateBetDisplay(type, number, betKey);
    updateUI();
}

// Place an outside bet
function placeOutsideBet(betType) {
    if (state.isSpinning) return;

    const betAmount = state.currentBet;
    if (betAmount > state.balance) {
        alert('Not enough balance');
        return;
    }

    state.bets[betType] = (state.bets[betType] || 0) + betAmount;
    state.balance -= betAmount;

    updateUI();
}

// Update bet display on the table
function updateBetDisplay(type, number, betKey) {
    if (type === 'straight') {
        const cells = document.querySelectorAll(`[data-number="${number}"]`);
        cells.forEach(cell => {
            cell.classList.add('bet-placed');
            cell.dataset.betAmount = state.bets[betKey];
        });
    }
}

// Clear all bets
function clearBets() {
    if (state.isSpinning) return;

    // Return all bet amounts to balance
    let totalReturned = 0;
    Object.keys(state.bets).forEach(key => {
        totalReturned += state.bets[key];
    });

    state.balance += totalReturned;
    state.bets = {};

    // Clear bet displays
    document.querySelectorAll('.bet-placed').forEach(el => {
        el.classList.remove('bet-placed');
        el.removeAttribute('data-bet-amount');
    });

    updateUI();
}

// Spin the wheel
function spin() {
    if (state.isSpinning || Object.keys(state.bets).length === 0) return;

    state.isSpinning = true;
    elements.result.textContent = '';
    updateUI();

    // Generate random result (provably fair)
    const resultIndex = generateResult();
    const winningNumber = parseInt(Object.keys(CONFIG.numberColors)[resultIndex]);
    const winningColor = CONFIG.numberColors[winningNumber];

    // Calculate spin degrees (3-10 full rotations + exact stop)
    const fullRotations = Math.floor(Math.random() * 7) + 3; // 3-9 full rotations
    const exactStop = (resultIndex / Object.keys(CONFIG.numberColors).length) * 360;
    const spinDegrees = (fullRotations * 360) + exactStop;

    // Animate wheel and ball
    elements.wheel.style.transform = `rotate(${-spinDegrees}deg)`;
    elements.ball.style.transform = `rotate(${spinDegrees}deg)`;

    // Show result after spin
    setTimeout(() => {
        processResult(winningNumber, winningColor);
        state.isSpinning = false;

        if (state.autoSpin && state.autoSpinCount < state.maxAutoSpins) {
            state.autoSpinCount++;
            setTimeout(spin, 1000);
        } else if (state.autoSpin) {
            stopAutoSpin();
        }

        updateUI();
    }, CONFIG.spinDuration);
}

// Generate provably fair result
function generateResult() {
    // In a real implementation, you would use serverSeed + clientSeed + nonce
    // and hash them to get a fair result. Here we simulate it.
    state.nonce++;
    const hash = sha256(`${state.serverSeed}:${state.clientSeed}:${state.nonce}`);
    const randomValue = parseInt(hash.substring(0, 8), 16) / 0xFFFFFFFF;
    return Math.floor(randomValue * Object.keys(CONFIG.numberColors).length);
}

// Generate random seed for provably fair
function generateRandomSeed() {
    return Array.from({length: 32}, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

// Process the winning result
function processResult(winningNumber, winningColor) {
    // Add to history
    state.history.unshift({
        number: winningNumber,
        color: winningColor
    });

    if (state.history.length > 20) {
        state.history.pop();
    }

    updateHistory();

    // Calculate winnings
    let totalWon = 0;

    Object.keys(state.bets).forEach(betKey => {
        const [type, value] = betKey.split('-');
        const betAmount = state.bets[betKey];
        let won = false;
        let multiplier = 0;

        switch (type) {
            case 'straight':
                if (parseInt(value) === winningNumber) {
                    won = true;
                    multiplier = CONFIG.payouts.straight;
                }
                break;

            case 'red':
                if (winningColor === 'red') {
                    won = true;
                    multiplier = CONFIG.payouts.red;
                }
                break;

            case 'black':
                if (winningColor === 'black') {
                    won = true;
                    multiplier = CONFIG.payouts.black;
                }
                break;

            case 'even':
                if (winningNumber !== 0 && winningNumber % 2 === 0) {
                    won = true;
                    multiplier = CONFIG.payouts.even;
                }
                break;

            case 'odd':
                if (winningNumber % 2 === 1) {
                    won = true;
                    multiplier = CONFIG.payouts.odd;
                }
                break;

            case 'low':
                if (winningNumber >= 1 && winningNumber <= 18) {
                    won = true;
                    multiplier = CONFIG.payouts.low;
                }
                break;

            case 'high':
                if (winningNumber >= 19 && winningNumber <= 36) {
                    won = true;
                    multiplier = CONFIG.payouts.high;
                }
                break;

            case 'dozen1':
                if (winningNumber >= 1 && winningNumber <= 12) {
                    won = true;
                    multiplier = CONFIG.payouts.dozen;
                }
                break;

            case 'dozen2':
                if (winningNumber >= 13 && winningNumber <= 24) {
                    won = true;
                    multiplier = CONFIG.payouts.dozen;
                }
                break;

            case 'dozen3':
                if (winningNumber >= 25 && winningNumber <= 36) {
                    won = true;
                    multiplier = CONFIG.payouts.dozen;
                }
                break;

            case 'column1':
                if ([1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34].includes(winningNumber)) {
                    won = true;
                    multiplier = CONFIG.payouts.column;
                }
                break;

            case 'column2':
                if ([2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35].includes(winningNumber)) {
                    won = true;
                    multiplier = CONFIG.payouts.column;
                }
                break;

            case 'column3':
                if ([3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36].includes(winningNumber)) {
                    won = true;
                    multiplier = CONFIG.payouts.column;
                }
                break;

            case 'zero':
                if (winningNumber === 0) {
                    won = true;
                    multiplier = CONFIG.payouts.zero;
                }
                break;
        }

        if (won) {
            totalWon += betAmount * (multiplier + 1);
        }
    });

    // Update balance
    state.balance += totalWon;

    // Show result
    elements.result.textContent = `${winningNumber} ${winningColor.toUpperCase()}`;
    elements.result.style.color = winningColor === 'red' ? 'var(--red)' : 
                                winningColor === 'black' ? 'var(--black)' : 'var(--green)';

    // Clear bets unless auto-spinning
    if (!state.autoSpin) {
        state.bets = {};
        document.querySelectorAll('.bet-placed').forEach(el => {
            el.classList.remove('bet-placed');
            el.removeAttribute('data-bet-amount');
        });
    }
}

// Update history display
function updateHistory() {
    elements.history.innerHTML = '';
    state.history.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = `history-item ${item.color}`;
        historyItem.textContent = item.number;
        elements.history.appendChild(historyItem);
    });
}

// Start auto spin
function startAutoSpin() {
    if (state.isSpinning || Object.keys(state.bets).length === 0) return;

    state.autoSpin = true;
    state.maxAutoSpins = parseInt(elements.autoSpins.value) || 10;
    state.autoSpinCount = 0;
    updateUI();
    spin();
}

// Stop auto spin
function stopAutoSpin() {
    state.autoSpin = false;
    updateUI();
}

// Update UI elements
function updateUI() {
    // Format balance with commas
    elements.balance.textContent = state.balance.toLocaleString();

    // Update spin button state
    elements.spinBtn.disabled = state.isSpinning || Object.keys(state.bets).length === 0;

    if (state.isSpinning) {
        elements.spinBtn.textContent = 'SPINNING...';
    } else {
        elements.spinBtn.textContent = 'SPIN';
    }

    // Update auto bet controls
    elements.startAuto.disabled = state.isSpinning || state.autoSpin || Object.keys(state.bets).length === 0;
    elements.stopAuto.disabled = !state.autoSpin;
}

// Simple SHA-256 implementation for provably fair (in a real app, use a proper library)
function sha256(input) {
    // This is a simplified version - in a real app, use crypto.subtle.digest or a library
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        const char = input.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
}
    // Reset wheel and ball positions before spinning
    elements.wheel.style.transform = 'rotate(0deg)';
    elements.ball.style.transform = 'rotate(0deg)';

    // Force reflow to ensure reset is applied
    void elements.wheel.offsetWidth;
}
// Initialize the game when loaded
window.addEventListener('DOMContentLoaded', initGame);