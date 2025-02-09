import Phaser from "phaser";

class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "player");

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.init();
        this.initEvents();
    }

    init() {
        this.gravity = 500;
        this.playerSpeed = 200;

        this.body.setGravityY(500);
        this.setCollideWorldBounds(true);
        this.cursors = this.scene.input.keyboard.createCursorKeys();

        this.scene.anims.create({
            key: 'run',
            frames: this.scene.anims.generateFrameNumbers('player', { start: 11, end: 16, frameRate: 10, repeat: -1 }),
        });
    }

    initEvents() {
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    update() {
        const { left, right, space, up } = this.cursors;
        if(left.isDown) {
            this.setVelocityX(-this.playerSpeed);
        } else if (right.isDown) {
            this.setVelocityX(this.playerSpeed);
        } else {
            this.setVelocityX(0);
        }
        //dont play it again if it is already playing
        // ignoreIfPlaying: true 
        this.play('run', true, { ignoreIfPlaying: true });
    }

}


export default Player;