import Phaser, { Physics, Scene } from "phaser";

const config = {
  //
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      // gravity: { y: 400 },
      debug: true
    }
  },
  scene: {
    preload,
    create,
    update
  }
}

function preload() {
  this.load.image('sky', 'assets/sky.png');
  this.load.image('bird', 'assets/bird.png');
  this.load.image('pipe', 'assets/pipe.png');
}

const VELOCITY = 200;
const flapVelocity = 250;
const initialBirdPosition = { x: config.width * 0.1, y: config.height /2 }

let bird = null;
let upperPipe = null;
let lowerPipe = null;



function create() {
  this.add.image(0, 0, 'sky').setOrigin(0);

  bird = this.physics.add.sprite(initialBirdPosition.x, initialBirdPosition.y, 'bird').setOrigin(0);
  bird.body.gravity.y = 400;
  
  upperPipe = this.physics.add.sprite(400, 100, 'pipe').setOrigin(0, 1);
  lowerPipe = this.physics.add.sprite(400, upperPipe.y + 100 , 'pipe').setOrigin(0, 0);
  
  
  this.input.on('pointerdown', flap);

  this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
}



// 60fps
// 60 times 
function update() {
  
    // 스페이스바가 눌렸는지 확인
  if (this.spaceKey.isDown) {
    flap();
  }

  if(bird.y > config.height || bird.y < -bird.height) {
    restartBirdPosition();
  }
}

function restartBirdPosition() {
  bird.x = initialBirdPosition.x;
  bird.y = initialBirdPosition.y;
  bird.body.velocity.y = 0;
  alert("패배");
}

function flap() {
  bird.body.velocity.y = -flapVelocity;
}


new Phaser.Game(config);