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
        this.gravity = 800;
        this.playerSpeed = 200;
        this.jumpCount = 0;
        this.consecutiveJumps = 1;
        
        this.jumpSpeed = -250;

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
        const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(space);
        // const isUpJustDown = Phaser.Input.Keyboard.JustDown(up);
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

        if ((isSpaceJustDown) && (onFloor || this.jumpCount < this.consecutiveJumps)) {
            this.setVelocityY(this.jumpSpeed);
            this.jumpCount++;
            this.play('jump', true);
        }

        if (onFloor) {
            this.jumpCount = 0;
        }
        //dont play it again if it is already playing
        // ignoreIfPlaying: true 
        // this.play('idle', true, { ignoreIfPlaying: true });
    }

}


export default Player;