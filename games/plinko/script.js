// Physics constants
const GRAVITY = 0.6;
const BOUNCE_FACTOR = 0.7;
const FRICTION = 0.99;
const PEG_BOUNCE = 0.75;
const SOUND_VOLUME = 0.5;
const CENTER_BIAS = 0.8;

// Fixed multiplier sequence (16 rows = 17 buckets)
const FIXED_MULTIPLIERS = [16, 9, 2, 1.4, 1.4, 1.2, 1.1, 1, 0.5, 1, 1.1, 1.2, 1.4, 1.4, 2, 9, 16];

// Game elements
const board = document.getElementById('plinkoBoard');
const dropBtn = document.getElementById('dropBall');
const drop3Btn = document.getElementById('drop3Balls');
const drop5Btn = document.getElementById('drop5Balls');
const drop10Btn = document.getElementById('drop10Balls');
const betInput = document.getElementById('betAmount');
const rowInput = document.getElementById('rowCount');
const profitValue = document.getElementById('profitValue');
const winsValue = document.getElementById('winsValue');
const lossesValue = document.getElementById('lossesValue');
const ballsLeftValue = document.getElementById('ballsLeftValue');
const multiplierRange = document.getElementById('multiplierRange');
const destinationsCount = document.getElementById('destinationsCount');
const balanceDisplay = document.getElementById('balanceDisplay');
const quickBtns = document.querySelectorAll('.quick-btn');

// Game state
let gameState = {
    rows: 16,
    betAmount: 1.00,
    profit: 0,
    wins: 0,
    losses: 0,
    pegs: [],
    buckets: [],
    activeBalls: 0,
    ballCounter: 0,
    currentMultipliers: [...FIXED_MULTIPLIERS],
    balance: 50000.00,
    ballsDropped: 0,
    maxBalls: 30
};

// Format currency
function formatCurrency(amount) {
    return '$' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

// Update balance with animation
function updateBalance(amount) {
    const wasIncrease = amount > gameState.balance;
    gameState.balance = amount;
    balanceDisplay.textContent = formatCurrency(amount);

    // Trigger animation
    balanceDisplay.classList.remove('balance-up', 'balance-down');
    void balanceDisplay.offsetWidth; // Trigger reflow
    balanceDisplay.classList.add(wasIncrease ? 'balance-up' : 'balance-down');

    // Remove animation class after it completes
    setTimeout(() => {
        balanceDisplay.classList.remove('balance-up', 'balance-down');
    }, 500);
}

// Update balls left counter
function updateBallsLeft() {
    const ballsLeft = gameState.maxBalls - gameState.ballsDropped;
    ballsLeftValue.textContent = ballsLeft;
}

// Sound functions
function playDropSound() {
    const sound = document.getElementById('dropSound');
    sound.volume = SOUND_VOLUME;
    sound.currentTime = 0;
    sound.play().catch(e => console.log("Audio play failed:", e));
}

function playHitSound() {
    const sound = document.getElementById('hitSound');
    sound.volume = SOUND_VOLUME;
    sound.currentTime = 0;
    sound.play().catch(e => console.log("Audio play failed:", e));
}

function playWinSound() {
    const sound = document.getElementById('winSound');
    sound.volume = SOUND_VOLUME;
    sound.currentTime = 0;
    sound.play().catch(e => console.log("Audio play failed:", e));
}

// Initialize the board
function initBoard() {
    board.innerHTML = '';
    gameState.pegs = [];
    gameState.buckets = [];

    const rows = parseInt(rowInput.value);
    gameState.rows = rows;
    const boardWidth = board.clientWidth;
    const boardHeight = board.clientHeight;
    const pegSpacing = boardWidth / (rows + 1);
    const rowSpacing = (boardHeight - 80) / rows;

    // Create pegs
    for (let row = 0; row < rows; row++) {
        const pegsInRow = row + 1;
        for (let peg = 0; peg < pegsInRow; peg++) {
            const pegEl = document.createElement('div');
            pegEl.className = 'peg';
            const x = (boardWidth/2) - (pegsInRow * pegSpacing)/2 + peg * pegSpacing;
            const y = 40 + row * rowSpacing;
            pegEl.style.left = `${x}px`;
            pegEl.style.top = `${y}px`;
            board.appendChild(pegEl);

            gameState.pegs.push({
                x: x,
                y: y,
                radius: 6,
                element: pegEl
            });
        }
    }

    // Create buckets
    const bucketCount = FIXED_MULTIPLIERS.length;
    const bucketWidth = boardWidth / bucketCount;
    for (let i = 0; i < bucketCount; i++) {
        const bucketEl = document.createElement('div');
        bucketEl.className = 'bucket';
        const x = i * bucketWidth;
        bucketEl.style.left = `${x}px`;
        bucketEl.style.width = `${bucketWidth}px`;

        const multiplier = FIXED_MULTIPLIERS[i];
        bucketEl.textContent = `${multiplier}x`;
        bucketEl.dataset.multiplier = multiplier;
        board.appendChild(bucketEl);

        gameState.buckets.push({
            x: x,
            width: bucketWidth,
            multiplier: multiplier,
            element: bucketEl
        });
    }

    updateMultiplierInfo();
}

// Update multiplier info
function updateMultiplierInfo() {
    const minMult = Math.min(...FIXED_MULTIPLIERS);
    const maxMult = Math.max(...FIXED_MULTIPLIERS);
    multiplierRange.textContent = `${minMult}x - ${maxMult}x`;
    destinationsCount.textContent = FIXED_MULTIPLIERS.length;
}

// Create a new ball
function createBall() {
    const ball = document.createElement('div');
    ball.className = 'ball';
    ball.id = `ball-${gameState.ballCounter++}`;
    board.appendChild(ball);
    return ball;
}

// Reset ball state with center bias
function resetBall(ball) {
    let randomX = (Math.random() - 0.5) * 2;
    randomX = randomX * (1 - CENTER_BIAS);

    return {
        x: board.clientWidth / 2,
        y: 30,
        vx: randomX,
        vy: 0,
        radius: 9,
        element: ball,
        id: ball.id
    };
}

// Check collision between ball and pegs
function checkPegCollision(ballState) {
    for (const peg of gameState.pegs) {
        const dx = ballState.x - peg.x;
        const dy = ballState.y - peg.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < ballState.radius + peg.radius) {
            const angle = Math.atan2(dy, dx);
            const speed = Math.sqrt(ballState.vx * ballState.vx + ballState.vy * ballState.vy);

            let centerPull = 0;
            if (ballState.x < board.clientWidth / 2) {
                centerPull = CENTER_BIAS * 0.1;
            } else {
                centerPull = -CENTER_BIAS * 0.1;
            }

            ballState.vx = Math.cos(angle) * speed * PEG_BOUNCE + centerPull;
            ballState.vy = Math.sin(angle) * speed * PEG_BOUNCE;

            const overlap = ballState.radius + peg.radius - distance;
            ballState.x += Math.cos(angle) * overlap * 1.1;
            ballState.y += Math.sin(angle) * overlap * 1.1;

            return true;
        }
    }
    return false;
}

// Check if ball landed in a bucket
function checkBucketCollision(ballState) {
    if (ballState.y + ballState.radius < board.clientHeight - 50) {
        return false;
    }

    for (const bucket of gameState.buckets) {
        if (ballState.x >= bucket.x && ballState.x <= bucket.x + bucket.width) {
            playHitSound();

            const winAmount = gameState.betAmount * bucket.multiplier;
            const netChange = winAmount - gameState.betAmount;
            gameState.profit += netChange;

            // Update the balance
            const newBalance = gameState.balance + netChange;
            updateBalance(newBalance);

            if (winAmount > gameState.betAmount) {
                gameState.wins++;
                playWinSound();
            } else {
                gameState.losses++;
            }

            profitValue.textContent = formatCurrency(gameState.profit);
            winsValue.textContent = gameState.wins;
            lossesValue.textContent = gameState.losses;

            return true;
        }
    }
    return false;
}

// Active balls map
const activeBalls = new Map();

// Physics update
function updateBallPhysics(ballState) {
    ballState.vy += GRAVITY;

    const centerDist = (ballState.x - board.clientWidth / 2) / (board.clientWidth / 2);
    ballState.vx -= centerDist * CENTER_BIAS * 0.05;

    ballState.x += ballState.vx;
    ballState.y += ballState.vy;

    checkPegCollision(ballState);

    if (ballState.x - ballState.radius < 0) {
        ballState.x = ballState.radius;
        ballState.vx *= -BOUNCE_FACTOR;
    }
    if (ballState.x + ballState.radius > board.clientWidth) {
        ballState.x = board.clientWidth - ballState.radius;
        ballState.vx *= -BOUNCE_FACTOR;
    }

    ballState.vx *= FRICTION;
    ballState.vy *= FRICTION;

    ballState.element.style.left = `${ballState.x - ballState.radius}px`;
    ballState.element.style.top = `${ballState.y - ballState.radius}px`;

    if (checkBucketCollision(ballState)) {
        setTimeout(() => {
            ballState.element.remove();
            activeBalls.delete(ballState.id);
        }, 500);
        return false;
    }

    return true;
}

// Animation loop
function animate() {
    activeBalls.forEach((ballState, id) => {
        if (!updateBallPhysics(ballState)) {
            activeBalls.delete(id);
        }
    });

    if (activeBalls.size > 0) {
        requestAnimationFrame(animate);
    }
}

// Reset ball counter
function resetBallCounter() {
    gameState.ballsDropped = 0;
    updateBallsLeft();
}

// Drop a single ball
function dropBall() {
    if (gameState.ballsDropped >= gameState.maxBalls) {
        alert(`Maximum of ${gameState.maxBalls} balls reached!`);
        return;
    }

    if (gameState.balance < gameState.betAmount) {
        alert("Insufficient balance!");
        return;
    }

    // Deduct bet amount immediately
    const newBalance = gameState.balance - gameState.betAmount;
    updateBalance(newBalance);

    const ball = createBall();
    const ballState = resetBall(ball);
    activeBalls.set(ballState.id, ballState);
    gameState.ballsDropped++;
    updateBallsLeft();

    playDropSound();

    if (activeBalls.size === 1) {
        animate();
    }
}

// Drop multiple balls
function dropBalls(count) {
    if (gameState.ballsDropped + count > gameState.maxBalls) {
        alert(`You can only drop ${gameState.maxBalls - gameState.ballsDropped} more balls!`);
        return;
    }

    const totalBet = gameState.betAmount * count;

    if (gameState.balance < totalBet) {
        alert("Insufficient balance!");
        return;
    }

    // Deduct total bet amount immediately
    const newBalance = gameState.balance - totalBet;
    updateBalance(newBalance);

    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const ball = createBall();
            const ballState = resetBall(ball);
            activeBalls.set(ballState.id, ballState);
            gameState.ballsDropped++;
            updateBallsLeft();

            playDropSound();

            if (activeBalls.size === 1) {
                animate();
            }
        }, i * 200);
    }
}

// Event listeners
dropBtn.addEventListener('click', dropBall);
drop3Btn.addEventListener('click', () => dropBalls(3));
drop5Btn.addEventListener('click', () => dropBalls(5));
drop10Btn.addEventListener('click', () => dropBalls(10));

// Quick bet buttons
quickBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        let currentBet = parseFloat(betInput.value);
        const action = this.dataset.action;
        const amount = parseFloat(this.dataset.amount);

        if (action === 'add') {
            currentBet += amount;
        } else if (action === 'multiply') {
            currentBet *= amount;
        } else if (action === 'max') {
            currentBet = 100;
        }

        // Ensure bet is within limits
        currentBet = Math.max(0.1, Math.min(currentBet, 100));
        betInput.value = currentBet.toFixed(2);
        gameState.betAmount = currentBet;
    });
});

// Bet amount input
betInput.addEventListener('change', function() {
    let value = parseFloat(this.value);
    value = Math.max(0.1, Math.min(value, 100));
    this.value = value.toFixed(2);
    gameState.betAmount = value;
});

// Initialize on load
window.addEventListener('load', function() {
    initBoard();
    balanceDisplay.textContent = formatCurrency(gameState.balance);
    updateBallsLeft();
});

window.addEventListener('resize', initBoard);