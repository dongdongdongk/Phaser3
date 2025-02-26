
import Phaser from "phaser";

import PlayScene from "./scenes/Play";
import PreloadScene from "./scenes/Preload";

// 1. 맵 크기 설정
const mapWidth = 1600;

// 2. 브라우저 크기에 맞춰 캔버스 크기 설정
const width = document.body.offsetWidth; 
const height = 600;

// 3. 오프셋 계산 (보이지 않는 영역 크기)
const mapOffset = mapWidth - width;

const SHARED_CONFIG = {
  mapOffset: mapOffset,
  width: width,
  height: height,
  zoomFactor: 1.0
}

const Scenes = [PreloadScene, PlayScene];
const createScene = Scene => new Scene(SHARED_CONFIG);
const initScenes = () => Scenes.map(createScene);

const config = {
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      // debug: true
    }
  },
    scene: initScenes()
  }

new Phaser.Game(config);
