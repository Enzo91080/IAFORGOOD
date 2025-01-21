import { useEffect } from 'react';
import Phaser from 'phaser';
import MainMenuScene from './scenes/MainMenuScene';
import FlappyBottleScene from './scenes/FlappyBottleScene';
import SpaceRecyclingScene from './scenes/SpaceReyclingScene';

// Importer les scènes


const App = () => {
  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
        },
      },
      scene: [MainMenuScene, FlappyBottleScene, SpaceRecyclingScene], // Ajouter les scènes ici
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div id="game-container" />;
};

export default App;
