// import Phaser from "phaser";
import BaseScene from "./BaseScene";

const PIPES_TO_RENDER = 4;

class PlayScene extends BaseScene {
  constructor(config) {
    super("PlayScene", config);

    this.bird = null;
    this.pipes = null;
    this.isPaused = false;

    this.pipeHorizontalDistance = 0;
    // this.pipeVerticalDistanceRange = [150, 250];
    // this.pipeHorizontalDistanceRange = [500, 550];
    this.flapVelocity = 300;

    this.score = 0;
    this.scoreText = "";

    // this.currentDifficulty = "easy";
    this.difficulties = {
      "easy": {
        pipeHorizontalDistanceRange: [400, 350],
        pipeVerticalDistanceRange: [250, 300],
      },
      "normal": {
        pipeHorizontalDistanceRange: [280, 330],
        pipeVerticalDistanceRange: [140, 190],
      },
      "hard": {
        pipeHorizontalDistanceRange: [250, 310],
        pipeVerticalDistanceRange: [120, 150],
      },
    };
  }

  create() {
    // this.createBG();
    this.currentDifficulty = "easy";
    super.create();
    this.createBird();
    this.createPipes();
    this.handleInputs();
    this.createScore();
    this.createColliders();
    this.createPause();
    this.listenToEvents();
    this.checkFPS();

    this.anims.create({
      key: "fly",
      frames: this.anims.generateFrameNumbers("bird", { start: 8, end: 15 }),
      // 24 fps default, it will play animation consisting of 24 frames in 1 second
      // in case of framerate 2 and sprite of 8 frames animations will play in
      // 4sec; 8/2 = 4
      frameRate: 8,
      // repeat infinitely
      repeat: -1,
    });
    this.bird.play("fly");
  }

  update() {
    this.checkGameStatus();
    this.recyclePipes();
  }

  listenToEvents() {
    if (this.pauseEvent) { return; }

    this.pauseEvent = this.events.on('resume', () => {
      this.initialTime = 3;
      this.countDownText = this.add.text(...this.screenCenter, 'Fly in: ' + this.initialTime, this.fontOptions).setOrigin(0.5);
      this.timedEvent = this.time.addEvent({
        delay: 1000,
        callback: this.countDown,
        callbackScope: this,
        loop: true
      })
    })
  }

  countDown() {
    this.initialTime--;
    this.countDownText.setText("Fly in: " + this.initialTime);
    if (this.initialTime <= 0) {
      this.isPaused = false;
      this.countDownText.setText("");
      this.physics.resume();
      this.timedEvent.remove();
    }
  }

  checkFPS() {
    this.add.text(16, 16, "", { fontSize: "16px", fill: "#FFF" });
    this.fpsText = this.add.text(16, 16, "FPS: 0", {
      fontSize: "16px",
      fill: "#FFF",
    });

    this.time.addEvent({
      delay: 100,
      loop: true,
      callback: () => {
        this.fpsText.setText(`FPS: ${Math.floor(this.game.loop.actualFps)}`);
      },
    });
  }

  createBG() {
    this.add.image(0, 0, "sky").setOrigin(0);
  }

  createBird() {
    this.bird = this.physics.add
      .sprite(this.config.startPosition.x, this.config.startPosition.y, "bird")
      .setFlipX(true)
      .setScale(3)
      .setOrigin(0);
    this.bird.setBodySize(this.bird.width, this.bird.height - 8);
    this.bird.body.gravity.y = 600;
    this.bird.setCollideWorldBounds(true);
  }

  createPipes() {
    this.pipes = this.physics.add.group();

    for (let i = 0; i < PIPES_TO_RENDER; i++) {
      const upperPipe = this.pipes
        .create(0, 0, "pipe")
        .setImmovable(true)
        .setOrigin(0, 1);
      const lowerPipe = this.pipes
        .create(0, 0, "pipe")
        .setImmovable(true)
        .setOrigin(0, 0);

      this.placePipe(upperPipe, lowerPipe);
    }

    this.pipes.setVelocityX(-200);
  }

  createColliders() {
    this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
  }

  createScore() {
    this.score = 0;
    const bestScore = localStorage.getItem("bestScore");
    this.scoreText = this.add.text(16, 16, `Score:${0}`, {
      fontSize: "32px",
      fill: "#000",
    });
    this.add.text(16, 52, `Best Score: ${bestScore || 0}`, {
      fontSize: "18px",
      fill: "#000",
    });
  }

  createPause() {
    this.isPaused = false;
    const pauseButton = this.add
      .image(this.config.width - 10, this.config.height - 10, "pause")
      .setInteractive()
      .setScale(3)
      .setOrigin(1);

    pauseButton.on("pointerdown", () => {
      this.isPaused = true;
      this.physics.pause();
      this.scene.pause();
      this.scene.launch("PauseScene");
    });
  }

  handleInputs() {
    this.input.on("pointerdown", this.flap, this);
    this.spaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
  }

  checkGameStatus() {
    const birdBounds = this.bird.getBounds();
    if (birdBounds.bottom >= this.config.height || birdBounds.top <= 0) {
      this.gameOver();
    }

    if (this.spaceKey.isDown) {
      this.flap();
    }
  }

  placePipe(uPipe, lPipe) {
    const difficulty = this.difficulties[this.currentDifficulty];
    const rightMostX = this.getRightMostPipe();
    const pipeVerticalDistance = Phaser.Math.Between(
      ...difficulty.pipeVerticalDistanceRange
    );
    const pipeVerticalPosition = Phaser.Math.Between(
      0 + 20,
      this.config.height - 20 - pipeVerticalDistance
    );
    const pipeHorizontalDistance = Phaser.Math.Between(
      ...difficulty.pipeHorizontalDistanceRange
    );

    uPipe.x = rightMostX + pipeHorizontalDistance;
    uPipe.y = pipeVerticalPosition;

    lPipe.x = uPipe.x;
    lPipe.y = uPipe.y + pipeVerticalDistance;
  }

  recyclePipes() {
    const tempPipes = [];
    this.pipes.getChildren().forEach((pipe) => {
      if (pipe.getBounds().right <= 0) {
        tempPipes.push(pipe);
        if (tempPipes.length === 2) {
          this.placePipe(...tempPipes);
          this.increaseScore();
          this.saveBestScore();
          this.increaseDifficulty();
        }
      }
    });
  }

  increaseDifficulty() {
    if (this.score === 0) {
      this.currentDifficulty = "easy";
    }

    if (this.score === 5) {
      this.currentDifficulty = "normal";
    }

    if (this.score === 10) {
      this.currentDifficulty = "hard";
    }
  }

  getRightMostPipe() {
    let rightMostX = 0;

    this.pipes.getChildren().forEach(function (pipe) {
      rightMostX = Math.max(pipe.x, rightMostX);
    });

    return rightMostX;
  }

  saveBestScore() {
    const bestScoreText = localStorage.getItem("bestScore");
    const bestScore = bestScoreText && parseInt(bestScoreText, 10);

    if (!bestScore || this.score > bestScore) {
      localStorage.setItem("bestScore", this.score);
    }
  }

  gameOver() {
    // this.bird.x = this.config.startPosition.x;
    // this.bird.y = this.config.startPosition.y;
    // this.bird.body.velocity.y = 0;
    this.physics.pause();
    this.bird.setTint(0xee4824);

    this.saveBestScore();

    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.scene.restart();
      },
      loop: false,
    });
  }

  flap() {
    if (this.isPaused) {
      return;
    }
    this.bird.body.velocity.y = -this.flapVelocity;
  }

  increaseScore() {
    this.score++;
    this.scoreText.setText(`Score:${this.score}`);
  }
}

export default PlayScene;
