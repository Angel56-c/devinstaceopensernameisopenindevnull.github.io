const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

// Global variables
let player;
let obstacles;
let score = 0;
let scoreText;
let gameSpeed = 1;
let isGameOver = false;
let spawnTimer;
let ground;
let cursors;
let jumpSound;
let crashSound;