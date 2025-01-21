import Phaser from 'phaser';

export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
  }

  preload() {
    // Charger des ressources si nécessaire (par exemple un logo ou fond d'écran)
    this.load.image('background', 'https://png.pngtree.com/background/20231017/original/pngtree-free-space-computer-generated-3d-illustration-of-underwater-granite-rock-landscape-picture-image_5586277.jpg'); // Exemple de fond
  }

  create() {
    // Ajouter un fond
    this.add.image(0, 0, 'background').setOrigin(0, 0).setDisplaySize(this.scale.width, this.scale.height);

    // Ajouter un titre
    this.add.text(this.scale.width / 2, 100, 'Choisissez un jeu', {
      fontSize: '32px',
      color: '#ffffff',
    }).setOrigin(0.5);

    // Bouton pour le jeu Flappy Bottle
    const flappyButton = this.add.text(this.scale.width / 2, 200, 'Flappy Bottle', {
      fontSize: '24px',
      color: '#00ff00',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 },
    }).setOrigin(0.5).setInteractive();

    // Bouton pour le jeu Space Recycling
    const spaceButton = this.add.text(this.scale.width / 2, 300, 'Space Recycling', {
      fontSize: '24px',
      color: '#00ff00',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 },
    }).setOrigin(0.5).setInteractive();

    // Ajouter des événements de clic
    flappyButton.on('pointerdown', () => this.scene.start('FlappyBottleScene'));
    spaceButton.on('pointerdown', () => this.scene.start('SpaceRecyclingScene'));
  }
}
