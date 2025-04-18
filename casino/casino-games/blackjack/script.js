// Game variables
let deck = [];
let dealerCards = [];
let playerCards = [];
let dealerScore = 0;
let playerScore = 0;
let gameOver = false;

// DOM elements
const dealerCardsEl = document.getElementById('dealer-cards');
const playerCardsEl = document.getElementById('player-cards');
const dealerScoreEl = document.getElementById('dealer-score');
const playerScoreEl = document.getElementById('player-score');
const messageEl = document.getElementById('message');
const hitBtn = document.getElementById('hit-btn');
const standBtn = document.getElementById('stand-btn');
const newGameBtn = document.getElementById('new-game-btn');

// Initialize game
function initGame() {
    // Create deck
    deck = [];
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }

    // Shuffle deck
    deck = shuffleDeck(deck);

    // Reset hands
    dealerCards = [];
    playerCards = [];
    gameOver = false;

    // Deal initial cards
    dealerCards.push(drawCard());
    dealerCards.push(drawCard());
    playerCards.push(drawCard());
    playerCards.push(drawCard());

    // Update UI
    updateGame();

    // Check for blackjack
    if (calculateScore(playerCards) === 21) {
        gameOver = true;
        dealerScore = calculateScore(dealerCards);
        playerScore = 21;
        updateGame();
        messageEl.textContent = "Blackjack! You win!";
    }
}

// Shuffle deck
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

// Draw a card from the deck
function drawCard() {
    return deck.pop();
}

// Calculate score of a hand
function calculateScore(hand) {
    let score = 0;
    let hasAce = false;

    for (let card of hand) {
        if (card.value === 'A') {
            hasAce = true;
            score += 11;
        } else if (['K', 'Q', 'J'].includes(card.value)) {
            score += 10;
        } else {
            score += parseInt(card.value);
        }
    }

    // Handle aces
    if (hasAce && score > 21) {
        score -= 10;
    }

    return score;
}

// Update game UI
function updateGame() {
    // Clear card displays
    dealerCardsEl.innerHTML = '';
    playerCardsEl.innerHTML = '';

    // Show dealer cards (hide first card if game isn't over)
    dealerCards.forEach((card, index) => {
        const cardEl = document.createElement('div');
        cardEl.className = 'card';

        if (index === 0 && !gameOver) {
            cardEl.textContent = '?';
            cardEl.classList.add('hidden-card');
        } else {
            cardEl.textContent = getCardSymbol(card);
        }

        dealerCardsEl.appendChild(cardEl);
    });

    // Show player cards
    playerCards.forEach(card => {
        const cardEl = document.createElement('div');
        cardEl.className = 'card';
        cardEl.textContent = getCardSymbol(card);
        playerCardsEl.appendChild(cardEl);
    });

    // Update scores
    dealerScore = calculateScore(dealerCards);
    playerScore = calculateScore(playerCards);

    if (gameOver) {
        dealerScoreEl.textContent = dealerScore;
    } else {
        dealerScoreEl.textContent = '?';
    }

    playerScoreEl.textContent = playerScore;
}

// Get card symbol for display
function getCardSymbol(card) {
    const symbols = {
        'hearts': '♥',
        'diamonds': '♦',
        'clubs': '♣',
        'spades': '♠'
    };

    return `${card.value}${symbols[card.suit]}`;
}

// Player hits
function hit() {
    if (gameOver) return;

    playerCards.push(drawCard());
    playerScore = calculateScore(playerCards);

    // Check if player busts
    if (playerScore > 21) {
        gameOver = true;
        messageEl.textContent = "You bust! Dealer wins.";
    }

    updateGame();
}

// Player stands
function stand() {
    if (gameOver) return;

    gameOver = true;

    // Dealer draws until score >= 17
    while (calculateScore(dealerCards) < 17) {
        dealerCards.push(drawCard());
    }

    dealerScore = calculateScore(dealerCards);
    playerScore = calculateScore(playerCards);

    // Determine winner
    if (dealerScore > 21) {
        messageEl.textContent = "Dealer busts! You win!";
    } else if (dealerScore > playerScore) {
        messageEl.textContent = "Dealer wins!";
    } else if (playerScore > dealerScore) {
        messageEl.textContent = "You win!";
    } else {
        messageEl.textContent = "It's a tie!";
    }

    updateGame();
}

// Event listeners
hitBtn.addEventListener('click', hit);
standBtn.addEventListener('click', stand);
newGameBtn.addEventListener('click', initGame);

// Start the game
initGame();