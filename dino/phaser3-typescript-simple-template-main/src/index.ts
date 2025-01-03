
import Phaser from "phaser";
import PreloadScene from "./scenes/PreloadScen";
import PlayScene from "./scenes/PlayScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1000,
  height: 340,
  pixelArt: true,
  transparent: true,
  physics: {
    default: 'arcade',
    // arcade: {
    //   gravity: { y: 200 }
    // }
  },
  scene: [PreloadScene, PlayScene]
};

new Phaser.Game(config);

