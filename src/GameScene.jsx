import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.score = 0; // Score initial
  }

  preload() {
    // Charger les ressources visuelles
    this.load.image(
      'background',
      'https://png.pngtree.com/background/20230401/original/pngtree-blue-sky-white-clouds-sea-level-sea-waves-cartoon-advertising-background-picture-image_2249616.jpg'
    ); // Image de l'arrière-plan
    this.load.image('robot', 'https://cdn.pixabay.com/photo/2017/08/13/21/17/fish-2638627_1280.png'); // Robot nettoyeur
    this.load.image('pipe', 'https://via.placeholder.com/80x400/00aa00'); // Obstacles
    this.load.image('bottle', 'https://static.vecteezy.com/ti/vecteur-libre/p1/26782261-dessin-de-une-plastique-l-eau-bouteille-vectoriel.jpg'); // Déchets
  }

  create() {
    // Ajouter l'arrière-plan
    this.background = this.add.image(0, 0, 'background').setOrigin(0, 0);
    this.background.setDisplaySize(this.scale.width, this.scale.height);

    // Ajouter le joueur
    this.robot = this.physics.add.sprite(100, this.scale.height / 2, 'robot');
    this.robot.setScale(0.1 * (this.scale.width / 800)); // Ajuster la taille
    this.robot.setCollideWorldBounds(true); // Empêcher de sortir de l'écran

    // Appliquer une gravité
    this.robot.body.gravity.y = 600;

    // Groupe pour les obstacles
    this.pipesGroup = this.physics.add.group();

    // Groupe pour les déchets
    this.trashGroup = this.physics.add.group();

    // Générer des obstacles toutes les 2 secondes
    this.time.addEvent({
      delay: 2000,
      callback: this.spawnPipes,
      callbackScope: this,
      loop: true,
    });

    // Collision avec les obstacles
    this.physics.add.collider(this.robot, this.pipesGroup, this.gameOver, null, this);

    // Collision avec les déchets
    this.physics.add.overlap(this.robot, this.trashGroup, this.collectTrash, null, this);

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
    const pipeGap = 150; // Écart entre les tuyaux
    const pipeY = Phaser.Math.Between(100, this.scale.height - 100 - pipeGap);

    // Ajouter le tuyau du haut
    const upperPipe = this.pipesGroup.create(this.scale.width, pipeY, 'pipe');
    upperPipe.setOrigin(0, 1); // Aligné en bas
    upperPipe.setDisplaySize(80, 400); // Ajuster la taille
    upperPipe.setVelocityX(-200); // Déplacer vers la gauche

    // Ajouter le tuyau du bas
    const lowerPipe = this.pipesGroup.create(this.scale.width, pipeY + pipeGap, 'pipe');
    lowerPipe.setOrigin(0, 0); // Aligné en haut
    lowerPipe.setDisplaySize(80, 400); // Ajuster la taille
    lowerPipe.setVelocityX(-200); // Déplacer vers la gauche

    // Ajouter un déchet entre les tuyaux
    const trash = this.trashGroup.create(this.scale.width, pipeY + pipeGap / 2, 'bottle');
    trash.setScale(0.1 * (this.scale.width / 800));
    trash.setVelocityX(-200); // Déplacer avec les tuyaux

    // Supprimer les objets lorsqu'ils sortent de l'écran
    this.pipesGroup.children.each((pipe) => {
      if (pipe.x < -pipe.width) {
        pipe.destroy();
      }
    });
    this.trashGroup.children.each((trash) => {
      if (trash.x < -trash.width) {
        trash.destroy();
      }
    });
  }

  collectTrash(robot, trash) {
    trash.destroy(); // Supprimer le déchet
    this.score += 10; // Ajouter des points
    this.scoreText.setText(`Score: ${this.score}`);
  }

  gameOver() {
    this.scene.restart(); // Redémarrer la scène
    alert(`Game Over! Votre score : ${this.score}`);
    this.score = 0; // Réinitialiser le score
  }

  update() {
    // Si le robot tombe en bas de l'écran, le jeu se termine
    if (this.robot.y > this.scale.height || this.robot.y < 0) {
      this.gameOver();
    }
  }
}
