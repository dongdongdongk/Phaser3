import Phaser from "phaser";
import initAnimations from './PlayerAnims';

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
        this.jumpSpeed = -350;

        this.body.setGravityY(500);
        this.setCollideWorldBounds(true);
        this.cursors = this.scene.input.keyboard.createCursorKeys();

        initAnimations(this.scene.anims);

    }

    initEvents() {
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    update() {
        const { left, right, space, up } = this.cursors;
        const onFloor = this.body.onFloor();

        if(left.isDown) {
            this.setVelocityX(-this.playerSpeed);
            this.play('run', true);
            this.setFlipX(true);
        } else if (right.isDown) {
            this.setVelocityX(this.playerSpeed);
            this.play('run', true);
            this.setFlipX(false);
        } else {
            this.setVelocityX(0);
            this.play('idle', true);
        }

        if ((space.isDown || up.isDown) && onFloor) {
            this.setVelocityY(this.jumpSpeed);
            this.play('jump', true);
        }
        //dont play it again if it is already playing
        // ignoreIfPlaying: true 
        // this.play('idle', true, { ignoreIfPlaying: true });
    }

}


export default Player;