import Phaser from 'phaser';
import turtle from '../assets/turtle.png';
import gourde from '../assets/gourde.png';
import obstacle from '../assets/obstacle.png';
import background from '../assets/background.jpg';

export default class FlappyBottleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'FlappyBottleScene' }); // Le key doit correspondre à celui référencé
    this.bottle = null;
    this.obstacles = null;
    this.collectibles = null;
    this.score = 90;
    this.gourdesCollected = 0;
    this.scoreText = null;
    this.gourdeText = null;
    this.gameOver = false;
  }

  preload() {
    this.load.image('background', background);
    this.load.image('bottle', turtle);
    this.load.image('obstacle', obstacle);
    this.load.image('gourde', gourde);
  }

  create() {
    this.gameOver = false;
    this.score = 0;

    const gameScale = this.scale.width / 1280;

     // Ajouter l'arrière-plan
     this.background = this.add.image(0, 0, "background").setOrigin(0, 0);
     this.background.setDisplaySize(this.scale.width, this.scale.height);

    // Ajouter le joueur (bouteille)
    this.bottle = this.physics.add.sprite(100, this.cameras.main.height / 2, 'bottle');
    this.bottle.setScale(0.2 * gameScale);
    this.bottle.setCollideWorldBounds(true);

    const bottleBody = this.bottle.body;
    bottleBody.setSize(this.bottle.width * 0.8, this.bottle.height * 0.8);
    bottleBody.setOffset(this.bottle.width * 0.1, this.bottle.height * 0.1);

    // Groupe pour les obstacles
    this.obstacles = this.physics.add.group();

    // Texte du score
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: `${32 * gameScale}px`,
      color: '#fff',
      stroke: '#000',
      strokeThickness: 4 * gameScale,
    });

    // Texte pour les gourdes collectées
    this.gourdeText = this.add.text(16, 56, 'Gourdes: 0', {
      fontSize: `${32 * gameScale}px`,
      color: '#fff',
      stroke: '#000',
      strokeThickness: 4 * gameScale,
    });

    // Groupe pour les gourdes
    this.collectibles = this.physics.add.group();

    // Ajouter les collisions
    this.physics.add.collider(this.bottle, this.obstacles, this.gameOverHandler, null, this);
    this.physics.add.overlap(this.bottle, this.collectibles, this.collectGourde, null, this);

    // Contrôles
    this.input.on('pointerdown', this.jump, this);
    this.input.keyboard.on('keydown-SPACE', this.jump, this);

    // Génération d'obstacles
    this.time.addEvent({
      delay: 1500,
      callback: this.spawnObstacle,
      callbackScope: this,
      loop: true,
    });

    // Génération de gourdes
    this.time.addEvent({
      delay: 3000,
      callback: this.spawnGourde,
      callbackScope: this,
      loop: true,
    });
  }

  update() {
    if (this.gameOver) return;

    // Appliquer la gravité
    this.bottle.setVelocityY(this.bottle.body.velocity.y + 20);
    this.bottle.angle = Phaser.Math.Clamp(this.bottle.body.velocity.y / 10, -30, 30);

    // Supprimer les obstacles hors écran
    this.obstacles.getChildren().forEach((obstacle) => {
      if (obstacle.x < -obstacle.width) {
        obstacle.destroy();
        this.score += 1;
        this.scoreText.setText(`Score: ${this.score}`);
      }
    });

    // Supprimer les gourdes hors écran
    this.collectibles.getChildren().forEach((gourde) => {
      if (gourde.x < -gourde.width) {
        gourde.destroy();
      }
    });
  }

  jump() {
    if (this.gameOver) return;
    this.bottle.setVelocityY(-450);
  }

  spawnObstacle() {
    if (this.gameOver) return;

    const gameScale = this.scale.width / 1280;
    const gapHeight = 250 * gameScale;
    const minY = 50 * gameScale;
    const maxY = this.cameras.main.height - minY - gapHeight;
    const obstacleY = Phaser.Math.Between(minY, maxY);

    // Obstacle supérieur
    const obstacleTop = this.obstacles.create(this.cameras.main.width + 100, obstacleY, 'obstacle');
    obstacleTop.setOrigin(0.5, 1);
    obstacleTop.setScale(0.6 * gameScale);
    obstacleTop.setVelocityX(-400 * gameScale);
    obstacleTop.body.allowGravity = false;

    // Obstacle inférieur
    const obstacleBottom = this.obstacles.create(this.cameras.main.width + 100, obstacleY + gapHeight, 'obstacle');
    obstacleBottom.setOrigin(0.5, 0);
    obstacleBottom.setScale(0.6 * gameScale);
    obstacleBottom.setVelocityX(-400 * gameScale);
    obstacleBottom.body.allowGravity = false;
  }

  collectGourde(bottle, gourde) {
    gourde.destroy();
    this.gourdesCollected++;
    this.gourdeText.setText(`Gourdes: ${this.gourdesCollected}`);
  }

  spawnGourde() {
    if (this.gameOver) return;

    const gameScale = this.scale.width / 1280;
    const gourde = this.collectibles.create(
      this.cameras.main.width + 100,
      Phaser.Math.Between(100, this.cameras.main.height - 100),
      'gourde'
    );
    gourde.setScale(0.3 * gameScale);
    gourde.setVelocityX(-400 * gameScale);
    gourde.body.allowGravity = false;
  }

  gameOverHandler() {
    if (this.gameOver) return;
    this.gameOver = true;
    this.physics.pause();
    alert(`Game Over! Votre score: ${this.score}`);
    this.scene.restart();
    this.score = 0;
    this.gourdesCollected = 0;
  }
}
