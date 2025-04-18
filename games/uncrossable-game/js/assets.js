// We'll generate assets programmatically to avoid external files
function generateAssets(scene) {
    // Create player graphic
    const playerGraphics = scene.make.graphics({ x: 0, y: 0 });
    playerGraphics.fillStyle(0x00ff00, 1);
    playerGraphics.fillRect(0, 0, 40, 80);
    playerGraphics.generateTexture('player', 40, 80);
    playerGraphics.destroy();

    // Create high obstacle (must jump over)
    const highObstacleGraphics = scene.make.graphics({ x: 0, y: 0 });
    highObstacleGraphics.fillStyle(0xff0000, 1);
    highObstacleGraphics.fillRect(0, 0, 60, 200);
    highObstacleGraphics.generateTexture('obstacle_high', 60, 200);
    highObstacleGraphics.destroy();

    // Create low obstacle (must slide under)
    const lowObstacleGraphics = scene.make.graphics({ x: 0, y: 0 });
    lowObstacleGraphics.fillStyle(0x0000ff, 1);
    lowObstacleGraphics.fillRect(0, 0, 60, 100);
    lowObstacleGraphics.generateTexture('obstacle_low', 60, 100);
    lowObstacleGraphics.destroy();

    // Background (gradient)
    const bgGraphics = scene.make.graphics({ x: 0, y: 0 });
    const gradient = bgGraphics.createGradient(0, 0, 800, 600, 0);
    gradient.addColorStop(0, '#001122');
    gradient.addColorStop(1, '#000011');
    bgGraphics.fillGradientStyle(gradient);
    bgGraphics.fillRect(0, 0, 800, 600);
    bgGraphics.generateTexture('background', 800, 600);
    bgGraphics.destroy();
}