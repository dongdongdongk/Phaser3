import Phaser, { Physics, Scene } from "phaser";

const config = {
  //
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  Physics: {
    default: 'arcade'
  },
  scene: {
    preload,
    create,
  }
}

function preload() {
  debugger
}

function create() {
  debugger
}


new Phaser.Game(config);