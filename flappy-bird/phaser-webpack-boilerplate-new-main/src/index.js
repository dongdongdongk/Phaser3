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
  this.load.image('sky', 'assets/sky.png');
}

function create() {
  // this.add.image(config.width / 2, config.height / 2, 'sky');
  this.add.image(0, 0, 'sky').setOrigin(0, 0.5)
}


new Phaser.Game(config);