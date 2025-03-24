
import Phaser from "phaser";

import PlayScene from "./scenes/Play";
import PreloadScene from "./scenes/Preload";
import MenuScene from "./scenes/Menu";
import LevelScene from "./scenes/Levels";

// 1. 맵 크기 설정
const mapWidth = 1600;

// 2. 브라우저 크기에 맞춰 캔버스 크기 설정
const width = document.body.offsetWidth; 
const height = 600;
const zoomFactor = 1.5;

// 3. 오프셋 계산 (보이지 않는 영역 크기)
const mapOffset = mapWidth - width;

const SHARED_CONFIG = {
  mapOffset: mapOffset,
  width: width,
  height: height,
  zoomFactor: zoomFactor,
  debug : true,
  leftTopCorner: {
    x: (width - (width / zoomFactor)) / 2,
    y: (height - (height / zoomFactor)) / 2
  },
  rightTopCorner: {
    x: ((width / zoomFactor) + ((width - (width / zoomFactor)) / 2)),
    y: (height - (height / zoomFactor)) / 2
  },
  rightBottomCorner: {
    x: ((width / zoomFactor) + ((width - (width / zoomFactor)) / 2)),
    y: ((height / zoomFactor) + ((height - (height / zoomFactor)) / 2)),
  }
}

const Scenes = [PreloadScene,MenuScene,LevelScene,PlayScene];
const createScene = Scene => new Scene(SHARED_CONFIG);
const initScenes = () => Scenes.map(createScene);

const config = {
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: SHARED_CONFIG.debug
    }
  },
    scene: initScenes()
  }

new Phaser.Game(config);
