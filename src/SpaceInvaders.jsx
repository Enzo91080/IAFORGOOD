import Phaser from 'phaser';
import bottleImage from './assets/bottle.png'; // Image des déchets plastiques
import spaceshipImage from './assets/spaceship.png'; // Image du vaisseau
import laserImage from './assets/laser.png'; // Image du tir

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.score = 0;
    this.health = 3; // Points de vie du joueur
  }

  preload() {
    // Charger les ressources visuelles
    this.load.image(
      'background',
      'https://png.pngtree.com/background/20231017/original/pngtree-free-space-computer-generated-3d-illustration-of-underwater-granite-rock-landscape-picture-image_5586277.jpg'
    ); // Fond d'écran
    this.load.image('bottle', bottleImage); // Déchet plastique
    this.load.image('spaceship', spaceshipImage); // Vaisseau du joueur
    this.load.image('laser', laserImage); // Tir du vaisseau
  }

  create() {
    // Ajouter l'arrière-plan
    this.background = this.add.image(0, 0, 'background').setOrigin(0, 0);
    this.background.setDisplaySize(this.scale.width, this.scale.height);

    // Ajouter le joueur (vaisseau)
    this.spaceship = this.physics.add.sprite(this.scale.width / 2, this.scale.height - 50, 'spaceship');
    this.spaceship.setCollideWorldBounds(true); // Limiter les déplacements aux bords de l'écran
    this.spaceship.setScale(0.2);

    // Groupe pour les tirs
    this.lasers = this.physics.add.group();

    // Groupe pour les déchets plastiques (ennemis)
    this.trashGroup = this.physics.add.group();

    // Générer des vagues de déchets toutes les 2 secondes
    this.time.addEvent({
      delay: 2000,
      callback: this.spawnTrash,
      callbackScope: this,
      loop: true,
    });

    // Collision entre les tirs et les déchets
    this.physics.add.overlap(this.lasers, this.trashGroup, this.hitTrash, null, this);

    // Texte du score
    this.scoreText = this.add.text(20, 20, 'Score: 0', {
      fontSize: '24px',
      color: '#fff',
    });

    // Texte de la santé
    this.healthText = this.add.text(20, 50, 'Health: 3', {
      fontSize: '24px',
      color: '#fff',
    });

    // Contrôle du joueur
    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on('keydown-SPACE', this.shoot, this);
  }

  shoot() {
    // Ajouter un laser à la position du vaisseau
    const laser = this.lasers.create(this.spaceship.x, this.spaceship.y - 20, 'laser');
    laser.setVelocityY(-400); // Déplacer le laser vers le haut
    laser.setScale(0.1); // Taille du laser ajustée
  }

  spawnTrash() {
    // Ajouter un déchet à une position aléatoire en haut de l'écran
    const x = Phaser.Math.Between(50, this.scale.width - 50);
    const trash = this.trashGroup.create(x, 0, 'bottle');
    trash.setVelocityY(150); // Faire descendre le déchet
    trash.setScale(0.2); // Taille du déchet ajustée
  }

  hitTrash(laser, trash) {
    // Supprimer le laser et le déchet
    laser.destroy();
    trash.destroy();

    // Augmenter le score
    this.score += 10;
    this.scoreText.setText(`Score: ${this.score}`);
  }

  update() {
    // Déplacer le vaisseau avec les touches gauche et droite
    if (this.cursors.left.isDown) {
      this.spaceship.setVelocityX(-200);
    } else if (this.cursors.right.isDown) {
      this.spaceship.setVelocityX(200);
    } else {
      this.spaceship.setVelocityX(0);
    }

    // Vérifier si un déchet atteint le bas de l'écran
    this.trashGroup.children.each((trash) => {
      if (trash.y > this.scale.height) {
        trash.destroy();
        this.health -= 1; // Réduire la santé
        this.healthText.setText(`Health: ${this.health}`);
        if (this.health <= 0) {
          this.gameOver();
        }
      }
    });
  }

  gameOver() {
    this.scene.restart(); // Redémarrer le jeu
    alert(`Game Over! Votre score : ${this.score}`);
    this.score = 0; // Réinitialiser le score
    this.health = 3; // Réinitialiser la santé
  }
}
