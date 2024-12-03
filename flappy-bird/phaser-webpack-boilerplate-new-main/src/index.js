import Phaser, { Physics, Scene } from "phaser";

const config = {
  //
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade'
  },
  scene: {
    preload,
    create,
  }
}

function preload() {
  this.load.image('sky', 'assets/sky.png');
  this.load.image('bird', 'assets/bird.png');
}

let bird = null;

function create() {
  // this.add.image(config.width / 2, config.height / 2, 'sky');
  this.add.image(0, 0, 'sky').setOrigin(0);

  bird = this.physics.add.sprite(config.width * 0.1, config.height / 2, 'bird').setOrigin(0);
  // bird.body.gravity.y = 200;
  bird.body.velocity.y = 200;
}

// 60fps
// 60 times 
function update(time, delta) {
  console.log(bird.body.velocity.y)

}


new Phaser.Game(config);