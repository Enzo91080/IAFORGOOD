import Phaser from 'phaser';
import pipe from './assets/pipe.png';
import tortue from './assets/tortue.png';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.score = 0; // Score initial
  }

  preload() {
    // Charger les ressources visuelles
    this.load.image(
      'background',
      'https://png.pngtree.com/background/20231017/original/pngtree-free-space-computer-generated-3d-illustration-of-underwater-granite-rock-landscape-picture-image_5586277.jpg'
    ); // Image de l'arrière-plan
    this.load.image('robot', tortue); // Robot nettoyeur
    this.load.image('pipe', pipe); // Tuyaux
  }

  create() {
    // Ajouter l'arrière-plan
    this.background = this.add.image(0, 0, 'background').setOrigin(0, 0);
    this.background.setDisplaySize(this.scale.width, this.scale.height);

    // Ajouter le joueur
    this.robot = this.physics.add.sprite(100, this.scale.height / 2, 'robot');
    this.robot.setScale(0.2); // Taille ajustée pour mieux correspondre
    this.robot.setCollideWorldBounds(true); // Empêcher de sortir de l'écran

    // Appliquer une gravité
    this.robot.body.gravity.y = 600;

    // Groupe pour les tuyaux
    this.pipesGroup = this.physics.add.group();

    // Générer des tuyaux toutes les 1,5 secondes
    this.time.addEvent({
      delay: 1500,
      callback: this.spawnPipes,
      callbackScope: this,
      loop: true,
    });

    // Collision avec les tuyaux
    this.physics.add.collider(this.robot, this.pipesGroup, this.gameOver, null, this);

    // Texte du score
    this.scoreText = this.add.text(20, 20, 'Score: 0', {
      fontSize: `${0.03 * this.scale.width}px`,
      color: '#fff',
    });

    // Contrôle du joueur : clic ou espace pour "sauter"
    this.input.on('pointerdown', this.flap, this);
    this.input.keyboard.on('keydown-SPACE', this.flap, this);
  }

  flap() {
    this.robot.setVelocityY(-300); // Le robot saute vers le haut
  }

  spawnPipes() {
    const pipeGap = 200; // Écart vertical entre les tuyaux
    const pipeY = Phaser.Math.Between(pipeGap, this.scale.height - pipeGap); // Position aléatoire

    // Calcul de la hauteur pour que les tuyaux touchent les bords
    const upperPipeHeight = pipeY - pipeGap / 2;
    const lowerPipeHeight = this.scale.height - pipeY - pipeGap / 2;

    // Ajouter le tuyau du haut
    const upperPipe = this.pipesGroup.create(this.scale.width, 0, 'pipe');
    upperPipe.setOrigin(0, 0); // Aligner en haut à gauche
    upperPipe.setDisplaySize(80, upperPipeHeight); // Ajuster la hauteur dynamique
    upperPipe.setFlipY(false); // Retourner verticalement le tuyau

    upperPipe.setVelocityX(-200); // Déplacement horizontal vers la gauche

    // Ajouter le tuyau du bas
    const lowerPipe = this.pipesGroup.create(this.scale.width, pipeY + pipeGap / 2, 'pipe');
    lowerPipe.setOrigin(0, 0); // Aligner en haut à gauche
    lowerPipe.setDisplaySize(80, lowerPipeHeight); // Ajuster la hauteur dynamique
    lowerPipe.setFlipY(true); // Retourner verticalement le tuyau

    lowerPipe.setVelocityX(-200); // Déplacement horizontal vers la gauche

    // Supprimer les tuyaux lorsqu'ils sortent de l'écran
    this.pipesGroup.children.each((pipe) => {
      if (pipe.x < -pipe.width) {
        pipe.destroy();
        // Ajouter 1 point à chaque fois que le robot dépasse un tuyau
        this.score += 1;
        this.scoreText.setText(`Score: ${this.score}`);
      }
    });
  }

  gameOver() {
    this.scene.restart(); // Redémarrer la scène
    alert(`Game Over! Votre score : ${this.score}`);
    this.score = 0; // Réinitialiser le score
  }

  update() {
    // Si le robot tombe en bas ou sort de l'écran, le jeu se termine
    if (this.robot.y > this.scale.height || this.robot.y < 0) {
      this.gameOver();
    }
  }
}
