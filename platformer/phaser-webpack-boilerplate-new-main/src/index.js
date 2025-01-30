
import Phaser from "phaser";

import Play from "./scenes/Play";

const WIDTH = 1280;
const HEIGHT = 600;

const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT
}

const Scenes = [Play];
const createScene = Scene => new Scene(SHARED_CONFIG);
const initScenes = () => Scenes.map(createScene);

const config = {
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      // gravity: { y: 200 }
    }
  },
    scene: initScenes()
  }

new Phaser.Game(config);
