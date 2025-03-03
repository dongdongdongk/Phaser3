import Phaser from "phaser";
import initAnimations from "./anims/PlayerAnims";

import collidable from "../mixins/collidable";
import HealthBar from "../hud/HealthBar";

class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "player");

        scene.add.existing(this);
        scene.physics.add.existing(this);

        Object.assign(this, collidable);

        this.init();
        this.initEvents();
    }

    init() {
        this.hasBeenHit = false;
        this.bounceVelocity = 200;
        this.gravity = 800;
        this.playerSpeed = 200;
        this.jumpCount = 0;
        this.consecutiveJumps = 1;
        this.body.setSize(20, 36);
        this.jumpSpeed = -250;

        this.body.setGravityY(500);
        this.setCollideWorldBounds(true);
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.setOrigin(0.5, 1);
        this.health = 100;

        this.hp = new HealthBar(
            this.scene,
            this.scene.config.leftTopCorner.x + 5, 
            this.scene.config.leftTopCorner.y + 5,
            this.health
        )
        initAnimations(this.scene.anims);
    }

    initEvents() {
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    update() {
        if (this.hasBeenHit) {
            return;
        }
        const { left, right, space, up } = this.cursors;
        const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(space);
        // const isUpJustDown = Phaser.Input.Keyboard.JustDown(up);
        const onFloor = this.body.onFloor();

        if (left.isDown) {
            this.setVelocityX(-this.playerSpeed);
            this.setFlipX(true);
        } else if (right.isDown) {
            this.setVelocityX(this.playerSpeed);
            this.setFlipX(false);
        } else {
            this.setVelocityX(0);
        }

        if (
            isSpaceJustDown &&
            (onFloor || this.jumpCount < this.consecutiveJumps)
        ) {
            this.setVelocityY(this.jumpSpeed);
            this.jumpCount++;
        }

        if (onFloor) {
            this.jumpCount = 0;
        }

        onFloor
            ? this.body.velocity.x !== 0
                ? this.play("run", true)
                : this.play("idle", true)
            : this.play("jump", true);

        //dont play it again if it is already playing
        // ignoreIfPlaying: true
        // this.play('idle', true, { ignoreIfPlaying: true });
    }

    playDamageTween() {
        return this.scene.tweens.add({
            targets: this,
            duration: 50,
            repeat: -1,
            tint: 0xff0000,
            yoyo: true,
        });
    }

    bounceOff() {
        this.body.touching.right
            ? this.setVelocity(-this.bounceVelocity, -this.bounceVelocity)
            : this.setVelocity(this.bounceVelocity, -this.bounceVelocity);

        setTimeout(() => this.setVelocityY(-this.bounceVelocity), 0);
    }

    takesHit(initiator) {
        if (this.hasBeenHit) {
            return;
        }
        console.log("player got hit");
        this.hasBeenHit = true;
        this.bounceOff();
        const hitAim = this.playDamageTween();

        // 일정 시간(1초) 후 다시 피격 가능하도록 설정
        this.scene.time.delayedCall(800, () => {
            this.hasBeenHit = false;
            hitAim.stop();
            this.clearTint();
        });
    }
}

export default Player;
