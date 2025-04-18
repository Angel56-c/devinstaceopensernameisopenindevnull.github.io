// Game state
const gameState = {
    board: [],
    mines: 3,
    revealed: 0,
    gameActive: false,
    currentMultiplier: 1.0,
    currentBet: 0,
    balance: 50000.00 // Default balance if no user is logged in
};

// DOM elements
const playButton = document.getElementById('playButton');
const gameBoard = document.getElementById('gameBoard');
const gameInfo = document.getElementById('gameInfo');
const cashoutButton = document.getElementById('cashoutButton');
const currentMultiplierDisplay = document.querySelector('.current-multiplier');
const betAmount = document.getElementById('betAmount');
const balanceDisplay = document.getElementById('balanceDisplay');
const usernameDisplay = document.getElementById('usernameDisplay');
const userPanel = document.getElementById('userPanel');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const MAX_BALLS = 30; // Maximum number of balls allowed at once

// Initialize user session
function initializeUserSession() {
    const loggedInUser = localStorage.getItem('currentUser');

    if (loggedInUser) {
        const user = JSON.parse(loggedInUser);

        // Display user info
        usernameDisplay.textContent = user.username;
        gameState.balance = user.balance || 50000.00;
        updateBalanceDisplay();

        // Show user panel, hide auth buttons
        userPanel.style.display = 'flex';
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';
    } else {
        // Show auth buttons, hide user panel
        userPanel.style.display = 'none';
        loginBtn.style.display = 'block';
        registerBtn.style.display = 'block';
    }
}

// Update balance display and localStorage
function updateBalanceDisplay() {
    balanceDisplay.textContent = `$${gameState.balance.toFixed(2)}`;

    // Update in localStorage if user is logged in
    const loggedInUser = localStorage.getItem('currentUser');
    if (loggedInUser) {
        const user = JSON.parse(loggedInUser);
        user.balance = gameState.balance;
        localStorage.setItem('currentUser', JSON.stringify(user));
    }
}

// Navigation handlers
loginBtn.addEventListener('click', () => {
    window.location.href = '../auth/login.html';
});

registerBtn.addEventListener('click', () => {
    window.location.href = '../auth/register.html';
});

// Initialize game board
function initializeBoard() {
    gameBoard.innerHTML = '';
    gameBoard.style.display = 'grid';
    gameInfo.style.display = 'flex';

    // Create 5x5 board
    for (let i = 0; i < 25; i++) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.dataset.index = i;
        tile.addEventListener('click', () => revealTile(i));
        gameBoard.appendChild(tile);
    }

    // Reset game state
    gameState.board = Array(25).fill(0);
    gameState.revealed = 0;
    gameState.gameActive = true;
    gameState.currentMultiplier = 1.0;
    currentMultiplierDisplay.textContent = '1.00×';

    // Place mines randomly
    let minesPlaced = 0;
    while (minesPlaced < gameState.mines) {
        const randomIndex = Math.floor(Math.random() * 25);
        if (gameState.board[randomIndex] === 0) {
            gameState.board[randomIndex] = 1;
            minesPlaced++;
        }
    }
}

// Start game
function startGame() {
    const bet = parseFloat(betAmount.value);

    // Validate bet amount
    if (isNaN(bet) || bet <= 0) {
        alert("Please enter a valid bet amount");
        return;
    }

    if (bet > gameState.balance) {
        alert("You don't have enough balance");
        return;
    }

    gameState.currentBet = bet;
    gameState.balance -= bet;
    updateBalanceDisplay();
    initializeBoard();
}

// Reveal tile
function revealTile(index) {
    if (!gameState.gameActive) return;

    const tile = gameBoard.children[index];
    tile.classList.add('revealed');

    if (gameState.board[index] === 1) {
        // Mine hit - game over
        tile.classList.add('mine');
        tile.textContent = '💣';
        endGame(false);
    } else {
        // Safe tile
        tile.classList.add('diamond');
        tile.textContent = '💎';
        gameState.revealed++;
        gameState.currentMultiplier += 0.25;
        currentMultiplierDisplay.textContent = gameState.currentMultiplier.toFixed(2) + '×';

        if (gameState.revealed === (25 - gameState.mines)) {
            // Win - add winnings
            const winnings = gameState.currentBet * gameState.currentMultiplier;
            gameState.balance += winnings;
            updateBalanceDisplay();
            endGame(true);
            alert(`You won! Multiplier: ${gameState.currentMultiplier.toFixed(2)}× Payout: $${winnings.toFixed(2)}`);
        }
    }
}

// End game
function endGame(win) {
    gameState.gameActive = false;

    if (!win) {
        alert("You hit a mine! Lost your bet.");
    }
}

// Cashout
function cashout() {
    if (gameState.gameActive) {
        const winnings = gameState.currentBet * gameState.currentMultiplier;
        gameState.balance += winnings;
        updateBalanceDisplay();
        endGame(true);
        alert(`Cashed out at ${gameState.currentMultiplier.toFixed(2)}×! Won $${winnings.toFixed(2)}`);
    }
}

// Mode selection
document.querySelectorAll('.mode-option').forEach(option => {
    option.addEventListener('click', function() {
        document.querySelectorAll('.mode-option').forEach(opt => opt.classList.remove('active'));
        this.classList.add('active');
    });
});

// Multiplier selection
document.querySelectorAll('.multiplier-option').forEach(option => {
    option.addEventListener('click', function() {
        document.querySelectorAll('.multiplier-option').forEach(opt => opt.classList.remove('active'));
        this.classList.add('active');
        gameState.mines = parseInt(this.textContent.replace('×', ''));
        document.querySelector('.mines-value').textContent = gameState.mines;
    });
});

// Event listeners
playButton.addEventListener('click', startGame);
cashoutButton.addEventListener('click', cashout);

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    initializeUserSession();
    updateBalanceDisplay();

// Add Funds button functionality
addFundsBtn.addEventListener('click', function() {
    const newBalance = gameState.balance + 500;
    updateBalance(newBalance);
    
});