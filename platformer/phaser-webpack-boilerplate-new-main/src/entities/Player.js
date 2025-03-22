import Phaser from "phaser";
import initAnimations from "./anims/PlayerAnims";

import collidable from "../mixins/collidable";
import anims from "../mixins/anims";
import HealthBar from "../hud/HealthBar";
import Projectile from "../attacks/Projectile";
import Projectiles from "../attacks/Projectiles";
import MeleeWeapon from "../attacks/MeleeWeapon";
import { getTimestamp } from "../utils/function";

class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "player");

        scene.add.existing(this);
        scene.physics.add.existing(this);

        Object.assign(this, collidable);
        Object.assign(this, anims);

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
        this.isSliding = false;
        this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;

        this.projectiles = new Projectiles(this.scene, "iceball-1");
        this.meleeWeapon = new MeleeWeapon(this.scene, 0, 0, "sword-default");
        this.timeFromLastSwing = null;

        this.body.setGravityY(500);
        this.setCollideWorldBounds(true);
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.setOrigin(0.5, 1);
        this.health = 100;

        this.hp = new HealthBar(
            this.scene,
            this.scene.config.leftTopCorner.x + 5,
            this.scene.config.leftTopCorner.y + 5,
            2,
            this.health
        );
        initAnimations(this.scene.anims);

        this.handleAttacks();
        this.handleMovement();
    }

    initEvents() {
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    update() {
        if (this.hasBeenHit || this.isSliding) {
            return;
        }
        const { left, right, space } = this.cursors;
        const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(space);
        // const isUpJustDown = Phaser.Input.Keyboard.JustDown(up);
        const onFloor = this.body.onFloor();

        if (left.isDown) {
            this.lastDirection = Phaser.Physics.Arcade.FACING_LEFT;
            this.setVelocityX(-this.playerSpeed);
            this.setFlipX(true);
        } else if (right.isDown) {
            this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
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

        if (this.isPlayingAnims("throw") || this.isPlayingAnims("slide")) {
            return;
        }

        onFloor
            ? this.body.velocity.x !== 0
                ? this.play("run", true)
                : this.play("idle", true)
            : this.play("jump", true);
    }

    handleMovement() {
        this.scene.input.keyboard.on("keydown-DOWN", () => {
            // if(!this.body.onFloor()) {
            //     return;
            // }
            this.body.setSize(this.width, this.height / 2);
            this.setOffset(0, this.height / 2);
            this.setVelocityX(0);
            this.play("slide", true);
            this.isSliding = true;
        });

        this.scene.input.keyboard.on("keyup-DOWN", () => {
            this.body.setSize(this.width, 38);
            this.setOffset(0, 0);
            this.isSliding = false;
        });
    }

    handleAttacks() {
        this.scene.input.keyboard.on("keydown-Q", () => {
            console.log("Q key was pressed");
            this.play("throw", true);
            this.projectiles.fireProjectile(this, "iceball");
        });

        this.scene.input.keyboard.on("keydown-E", () => {
            if (
                this.timeFromLastSwing &&
                this.timeFromLastSwing + this.meleeWeapon.attackSpeed > getTimestamp()
            ) {
                return;
            }

            console.log("E key was pressed");
            this.play("throw", true);
            this.meleeWeapon.swing(this);
            this.timeFromLastSwing = getTimestamp();
        });
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

    takesHit(source) {
        if (this.hasBeenHit) {
            return;
        }
        console.log("player got hit");
        this.hasBeenHit = true;
        this.bounceOff();
        const hitAim = this.playDamageTween();

        debugger;
        this.health -= source.damage || source.properties.damage || 0;
        this.hp.decrease(this.health);
        debugger;
        source.deliversHit && source.deliversHit(this);

        // 일정 시간(1초) 후 다시 피격 가능하도록 설정
        this.scene.time.delayedCall(800, () => {
            this.hasBeenHit = false;
            hitAim.stop();
            this.clearTint();
        });
    }
}

export default Player;
