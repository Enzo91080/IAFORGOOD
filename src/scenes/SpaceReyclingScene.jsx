import Phaser from "phaser";
import bottle from "../assets/bottle.png";
import trash from "../assets/trash.png";
import heart from "../assets/heart.png"; // Image pour les cœurs

export default class SpaceRecyclingScene extends Phaser.Scene {
  constructor() {
    super("SpaceRecyclingScene");
    this.score = 0; // Score initial
    this.health = 5; // Points de vie
    this.trashBinSpeed = 0; // Vitesse dynamique calculée
    this.bottleFallSpeed = 100; // Réduire la vitesse de chute des bouteilles
  }

  preload() {
    // Charger les ressources
    this.load.image(
      "background",
      "https://png.pngtree.com/background/20231017/original/pngtree-free-space-computer-generated-3d-illustration-of-underwater-granite-rock-landscape-picture-image_5586277.jpg"
    ); // Fond d'écran
    this.load.image("bottle", bottle); // Déchets
    this.load.image("trashBin", trash); // Poubelle
    this.load.image("heart", heart); // Cœur
  }

  create() {
    // Calculer la vitesse de déplacement en fonction de la largeur de l'écran
    this.trashBinSpeed = this.scale.width / 2; // La poubelle peut traverser l'écran en environ 2 secondes

    // Ajouter l'arrière-plan
    this.background = this.add.image(0, 0, "background").setOrigin(0, 0);
    this.background.setDisplaySize(this.scale.width, this.scale.height);

    // Ajouter le joueur (poubelle)
    this.trashBin = this.physics.add.sprite(
      this.scale.width / 2,
      this.scale.height - 100,
      "trashBin"
    );
    this.trashBin.setCollideWorldBounds(true); // Empêcher de sortir de l'écran
    this.trashBin.setScale(0.2); // Taille ajustée

    // Groupe pour les déchets (bouteilles)
    this.trashGroup = this.physics.add.group();

    // Ajouter les cœurs pour la vie
    this.hearts = [];
    const heartSize = 40; // Taille des cœurs
    for (let i = 0; i < this.health; i++) {
      const heartImage = this.add.image(20 + i * (heartSize + 18), 100, "heart");
      heartImage.setScale(0.3); // Réduire la taille
      this.hearts.push(heartImage);
    }

    // Générer des vagues de bouteilles toutes les 1,5 secondes
    this.time.addEvent({
      delay: 1500,
      callback: this.spawnTrash,
      callbackScope: this,
      loop: true,
    });

    // Collision entre la poubelle et les bouteilles
    this.physics.add.overlap(
      this.trashBin,
      this.trashGroup,
      this.collectTrash,
      null,
      this
    );

    // Texte du score
    this.scoreText = this.add.text(20, 20, "Score: 0", {
      fontSize: "20px",
      color: "#fff",
    });

    // Contrôles du joueur
    this.cursors = this.input.keyboard.createCursorKeys();

    // Ajouter des zones interactives pour les contrôles tactiles
    this.addTouchControls();
  }

  addTouchControls() {
    // Zone pour le contrôle gauche
    const leftZone = this.add.zone(0, 0, this.scale.width / 2, this.scale.height);
    leftZone.setOrigin(0, 0).setInteractive();
    leftZone.on("pointerdown", () => {
      this.trashBin.setVelocityX(-this.trashBinSpeed);
    });
    leftZone.on("pointerup", () => {
      this.trashBin.setVelocityX(0);
    });

    // Zone pour le contrôle droit
    const rightZone = this.add.zone(
      this.scale.width / 2,
      0,
      this.scale.width / 2,
      this.scale.height
    );
    rightZone.setOrigin(0, 0).setInteractive();
    rightZone.on("pointerdown", () => {
      this.trashBin.setVelocityX(this.trashBinSpeed);
    });
    rightZone.on("pointerup", () => {
      this.trashBin.setVelocityX(0);
    });
  }

  spawnTrash() {
    // Générer une bouteille à une position horizontale aléatoire
    const x = Phaser.Math.Between(50, this.scale.width - 50);

    // Calculer la distance entre la bouteille et la poubelle
    const distanceFromTrashBin = Math.abs(x - this.trashBin.x);

    // Si la bouteille est trop éloignée de la poubelle, rapprocher sa position
    if (distanceFromTrashBin > this.scale.width / 2) {
      const direction = x > this.trashBin.x ? -1 : 1; // Déterminer la direction
      const adjustedX = this.trashBin.x + direction * (this.scale.width / 3);
      const adjustedPosition = Phaser.Math.Clamp(adjustedX, 50, this.scale.width - 50);
      const bottle = this.trashGroup.create(adjustedPosition, 0, "bottle");
      bottle.setVelocityY(this.bottleFallSpeed); // Faire descendre la bouteille
      bottle.setScale(0.10); // Taille ajustée
    } else {
      const bottle = this.trashGroup.create(x, 0, "bottle");
      bottle.setVelocityY(this.bottleFallSpeed); // Faire descendre la bouteille
      bottle.setScale(0.12); // Taille ajustée
    }
  }

  collectTrash(trashBin, bottle) {
    // Supprimer la bouteille
    bottle.destroy();

    // Augmenter le score
    this.score += 10;
    this.scoreText.setText(`Score: ${this.score}`);
  }

  update() {
    // Déplacement horizontal de la poubelle avec une vitesse ajustée
    if (this.cursors.left.isDown) {
      this.trashBin.setVelocityX(-this.trashBinSpeed); // Déplacement à gauche
    } else if (this.cursors.right.isDown) {
      this.trashBin.setVelocityX(this.trashBinSpeed); // Déplacement à droite
    } else {
      this.trashBin.setVelocityX(0); // Arrêt
    }

    // Vérifier si une bouteille atteint le bas de l'écran
    this.trashGroup.children.each((bottle) => {
      if (bottle.y > this.scale.height) {
        bottle.destroy();
        this.reduceHealth();
      }
    });
  }

  reduceHealth() {
    // Réduire la santé
    if (this.health > 0) {
      this.health--;
      const heart = this.hearts.pop(); // Supprimer un cœur
      heart.destroy(); // Retirer l'image du cœur
    }

    if (this.health <= 0) {
      this.gameOver();
    }
  }

  gameOver() {
    // Afficher un message de fin
    alert(`Game Over! Votre score : ${this.score}`);

    // Réinitialiser la scène
    this.scene.restart();

    // Réinitialiser le score et la santé
    this.score = 0;
    this.health = 5;
  }
}
