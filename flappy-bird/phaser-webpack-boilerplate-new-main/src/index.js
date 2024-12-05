import Phaser, { Physics, Scene } from "phaser";

const config = {
  //
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      // gravity: { y: 200 }
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
}

const VELOCITY = 200;

let bird = null;
let totalDelta = null;

function create() {
  this.add.image(0, 0, 'sky').setOrigin(0);

  bird = this.physics.add.sprite(config.width * 0.1, config.height / 2, 'bird').setOrigin(0);
  bird.body.velocity.x = VELOCITY;
}

// 60fps
// 60 times 
function update(time, delta) {
  // 새의 위치 X가 캔버스의 너비와 같거나 더 크다면,왼쪽으로 돌아간다.
  // 그리고 새의 위치 x가 0보다 작거나 같으면 오른쪽으로 다시 이동한다.
  if( bird.x >= config.width - bird.width) { // - bird.width 를 해주는건 스프라이트가 마지막에 화면 밖으로 나가기 떄문 
    bird.body.velocity.x = -VELOCITY;
  } else if ( bird.x <=0 ) {
    bird.body.velocity.x = VELOCITY;
  }

}


new Phaser.Game(config);