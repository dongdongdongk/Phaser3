import Phaser from "phaser";
import { SpriteWithDynamicBody } from "../types";
import { Player } from "../entities/Player";
import { GameScene } from "../GameScene";
import { PRELOAD_CONFIG } from "..";

class PlayScene extends GameScene {
    player: Player;
    startTrigger: SpriteWithDynamicBody;
    ground: Phaser.GameObjects.TileSprite;
    obstacles: Phaser.Physics.Arcade.Group;
    clouds: Phaser.GameObjects.Group;

    gameOverContainer: Phaser.GameObjects.Container;
    gameOverText: Phaser.GameObjects.Image;
    restartText: Phaser.GameObjects.Image;

    spawnInterval: number = 1500;
    spawnTime: number = 0;
    gameSpeed: number = 10;

    constructor() {
        super("PlayScene");
    }

    create() {
        this.createEnvironment();
        this.createPlayer();
        this.createObstacles();
        this.createGameoverContainer();
        this.createAnimations();

        this.handleGameStart();
        this.handleObstacleCollisions();
        this.handleGameRestart();
    }

    update(time: number, delta: number): void {
        if (!this.isGameRunning) {
            return;
        }

        this.spawnTime += delta;

        if (this.spawnTime > this.spawnInterval) {
            this.spawnObstacle();
            this.spawnTime = 0;
        }

        Phaser.Actions.IncX(this.obstacles.getChildren(), -this.gameSpeed);
        Phaser.Actions.IncX(this.clouds.getChildren(), -0.5);

        this.obstacles.getChildren().forEach((obstacles: SpriteWithDynamicBody) => {
            if (obstacles.getBounds().right < 0) {
                this.obstacles.remove(obstacles);
            }
        });

        this.clouds.getChildren().forEach((cloud: SpriteWithDynamicBody) => {
            if (cloud.getBounds().right < 0) {
                cloud.x = this.gameWidth + 30;
            }
        });

        this.ground.tilePositionX += this.gameSpeed;
    }

    createObstacles() {
        this.obstacles = this.physics.add.group();
    }

    createGameoverContainer() {
        this.gameOverText = this.add.image(0, 0, "game-over");
        this.restartText = this.add.image(0, 80, "restart").setInteractive();

        this.gameOverContainer = this.add
            .container(this.gameWidth / 2, this.gameHeight / 2 - 50)
            .add([this.gameOverText, this.restartText])
            .setAlpha(0);
    }

    createAnimations() {
        this.anims.create({
            key: "enemy-bird-fly",
            frames: this.anims.generateFrameNumbers("enemy-bird"),
            frameRate: 6,
            repeat: -1,
        });
    }

    createPlayer() {
        this.player = new Player(this, 0, this.gameHeight);
    }

    createEnvironment() {
        this.ground = this.add
            .tileSprite(0, this.gameHeight, 88, 26, "ground")
            .setOrigin(0, 1);

        this.clouds = this.add.group();
        this.clouds = this.clouds.addMultiple([
            this.add.image(this.gameWidth / 2, 170, "cloud"),
            this.add.image(this.gameWidth -80, 80, "cloud"),
            this.add.image(this.gameWidth / 1.3, 100, "cloud"),
        ]);

        this.clouds.setAlpha(0);
    }

    spawnObstacle() {
        const obstaclesCount =
            PRELOAD_CONFIG.cactusesCount + PRELOAD_CONFIG.birdsCount;
        const obstacleNum = Math.floor(Math.random() * obstaclesCount) + 1;
        const distance = Phaser.Math.Between(150, 300);
        let obstacle;

        if (obstacleNum > PRELOAD_CONFIG.cactusesCount) {
            const enemyPossibleHeight = [20, 70];
            const enemyHeight = enemyPossibleHeight[Math.floor(Math.random() * 2)];

            obstacle = this.obstacles.create(
                this.gameWidth + distance,
                this.gameHeight - enemyHeight,
                "enemy-bird"
            );
            obstacle.play("enemy-bird-fly", true);
        } else {
            obstacle = this.obstacles.create(
                this.gameWidth + distance,
                this.gameHeight,
                `obstacle-${obstacleNum}`
            );
        }

        obstacle.setOrigin(0, 1).setImmovable();
    }

    handleGameStart() {
        this.startTrigger = this.physics.add
            .sprite(0, 10, null)
            .setAlpha(0)
            .setOrigin(0, 1);

        this.physics.add.overlap(this.startTrigger, this.player, () => {
            if (this.startTrigger.y === 10) {
                this.startTrigger.body.reset(0, this.gameHeight);
                return;
            }

            this.startTrigger.body.reset(9999, 9999);

            const rollOutEvent = this.time.addEvent({
                delay: 1000 / 60,
                loop: true,
                callback: () => {
                    this.player.playRunAnimation();
                    this.player.setVelocityX(80);
                    this.ground.width += 17 * 2;

                    if (this.ground.width >= this.gameWidth) {
                        rollOutEvent.remove();
                        this.ground.width = this.gameWidth;
                        this.player.setVelocityX(0);
                        this.clouds.setAlpha(1);
                        this.isGameRunning = true;
                    }
                },
            });
        });
    }

    handleObstacleCollisions() {
        this.physics.add.collider(this.obstacles, this.player, () => {
            this.isGameRunning = false;
            this.physics.pause();
            this.anims.pauseAll();

            this.player.die();
            this.gameOverContainer.setAlpha(1);

            this.spawnTime = 0;
            this.gameSpeed = 10;
        });
    }

    handleGameRestart() {
        this.restartText.on("pointerdown", () => {
            this.physics.resume();
            this.player.setVelocityY(0);
            this.obstacles.clear(true, true);
            this.gameOverContainer.setAlpha(0);
            this.anims.resumeAll();

            this.isGameRunning = true;
        });
    }
}

export default PlayScene;
