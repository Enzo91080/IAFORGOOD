import Phaser from "phaser";
import background from "../assets/background.jpg";
import flappyIcon from "../assets/turtle.png"; // Exemple d'icône pour Flappy Bottle
import spaceIcon from "../assets/trash.png"; // Exemple d'icône pour Space Recycling

export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super("MainMenuScene");
  }

  preload() {
    // Charger des ressources
    this.load.image("background", background); // Fond d'écran
    this.load.image("flappyIcon", flappyIcon); // Icône pour Flappy Bottle
    this.load.image("spaceIcon", spaceIcon); // Icône pour Space Recycling
  }

  create() {
    // Ajouter un fond
    this.add
      .image(0, 0, "background")
      .setOrigin(0, 0)
      .setDisplaySize(this.scale.width, this.scale.height);

    // Ajouter un titre
    this.add
      .text(this.scale.width / 2, 100, "Choisissez un jeu", {
        fontSize: "60px",
        color: "#000000",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Créer une card pour "Flappy Bottle"
    const flappyCard = this.add
      .rectangle(this.scale.width / 2, 250, 500, 150, 0x000000, 0.8)
      .setOrigin(0.5)
      .setInteractive();

    this.add
      .text(flappyCard.x, flappyCard.y - 30, "Flappy Bottle", {
        fontSize: "24px",
        color: "#ff6200",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(
        flappyCard.x,
        flappyCard.y + 20,
        "Un jeu amusant pour tester votre adresse !",
        {
          fontSize: "16px",
          color: "#ffffff",
        }
      )
      .setOrigin(0.5);

    this.add
    .image(flappyCard.x, flappyCard.y + 100, "flappyIcon") // Ajouter l'icône
    .setOrigin(0.5)
      .setScale(0.3); // Réduire la taille si nécessaire

    // Créer une card pour "Space Recycling"
    const spaceCard = this.add
      .rectangle(this.scale.width / 2, 550, 500, 150, 0x000000, 0.8)
      .setOrigin(0.5)
      .setInteractive();

    this.add
      .text(spaceCard.x, spaceCard.y - 30, "Space Recycling", {
        fontSize: "24px",
        color: "#ff6200",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(
        spaceCard.x,
        spaceCard.y + 20,
        "Recyclage intergalactique pour sauver l'univers !",
        {
          fontSize: "16px",
          color: "#ffffff",
        }
      )
      .setOrigin(0.5);

      this.add
      .image(spaceCard.x, spaceCard.y + 140, "spaceIcon") // Ajouter l'icône
      .setOrigin(0.5)
      .setScale(0.3); // Réduire la taille si nécessaire

    // Ajouter des événements de clic
    flappyCard.on("pointerdown", () => this.scene.start("FlappyBottleScene"));
    spaceCard.on("pointerdown", () => this.scene.start("SpaceRecyclingScene"));
  }
}
