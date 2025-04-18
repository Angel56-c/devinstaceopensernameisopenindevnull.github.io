    function preload() {
        // Generate assets programmatically
        generateAssets(this);

        // Load audio (we'll generate placeholder sounds)
        this.load.audio('jump', ['data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU...']);
        this.load.audio('crash', ['data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU...']);
    }

    function create() {
        // Add background
        this.add.image(400, 300, 'background');

        // Create ground
        ground = this.add.rectangle(0, 550, 1600, 100, 0x333333);
        ground.setOrigin(0, 0);
        this.physics.add.existing(ground, true);

        // Create player
        player = this.physics.add.sprite(100, 450, 'player');
        player.setCollideWorldBounds(true);
        player.setOrigin(0.5, 1);
        player.body.setSize(30, 70);

        // Create obstacles group
        obstacles = this.physics.add.group();

        // Score display
        scoreText = this.add.text(20, 20, 'Score: 0', {
            fontSize: '32px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 4
        });

        // Controls
        cursors = this.input.keyboard.createCursorKeys();
        this.input.keyboard.on('keydown-SPACE', jump, this);

        // Spawn obstacles
        spawnTimer = this.time.addEvent({
            delay: 1500,
            callback: spawnObstacle,
            callbackScope: this,
            loop: true
        });

        // Collision detection
        this.physics.add.collider(player, obstacles, hitObstacle, null, this);
        this.physics.add.collider(player, ground, land, null, this);

        // Create placeholder sounds
        jumpSound = this.sound.add('jump');
        crashSound = this.sound.add('crash');
    }

    function update() {
        if (isGameOver) return;

        // Increase score
        score += 0.1;
        scoreText.setText('Score: ' + Math.floor(score));

        // Increase difficulty
        if (score % 100 === 0) {
            gameSpeed += 0.05;
            spawnTimer.delay = Math.max(500, 1500 - (score / 2));
        }

        // Movement controls
        if ((cursors.up.isDown || cursors.space.isDown) && player.body.onFloor()) {
            jump();
        }

        // Slide/Duck
        if (cursors.down.isDown) {
            player.setSize(40, 40);
            player.body.setOffset(0, 40);
        } else {
            player.setSize(30, 70);
            player.body.setOffset(5, 10);
        }
    }

    function spawnObstacle() {
        if (isGameOver) return;

        const obstacleType = Phaser.Math.Between(0, 1);
        const obstacleHeight = obstacleType === 0 ? 200 : 100;
        const obstacleY = 600 - obstacleHeight;

        const obstacle = obstacles.create(850, obstacleY, 
            obstacleType === 0 ? 'obstacle_high' : 'obstacle_low');
        obstacle.setVelocityX(-200 * gameSpeed);
        obstacle.setImmovable(true);
        obstacle.body.setAllowGravity(false);

        // Remove obstacles when they go off screen
        obstacle.setPipeline('Light2D');
        obstacle.setAlpha(0.9);

        // Add obstacle to collision group
        this.physics.add.collider(player, obstacle);
    }

    function jump() {
        if (!player.body.onFloor()) return;

        player.setVelocityY(-400);
        jumpSound.play();

        // Jump animation
        this.tweens.add({
            targets: player,
            scaleY: 0.8,
            duration: 100,
            yoyo: true
        });
    }

    function land() {
        player.setVelocityY(0);
    }

    function hitObstacle() {
        if (isGameOver) return;

        isGameOver = true;
        this.physics.pause();
        crashSound.play();

        // Death effect
        this.cameras.main.shake(300, 0.02);
        this.tweens.add({
            targets: player,
            alpha: 0.5,
            duration: 300,
            repeat: 3,
            yoyo: true
        });

        // Game over text
        const gameOverText = this.add.text(400, 250, 'GAME OVER', {
            fontSize: '64px',
            fill: '#ff0000',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        const finalScore = this.add.text(400, 320, 'Final Score: ' + Math.floor(score), {
            fontSize: '32px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        const restartText = this.add.text(400, 380, 'Click to Restart', {
            fontSize: '24px',
            fill: '#aaaaaa',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Restart on click
        this.input.on('pointerdown', () => {
            score = 0;
            gameSpeed = 1;
            isGameOver = false;
            obstacles.clear(true, true);
            this.scene.restart();
        });
    }