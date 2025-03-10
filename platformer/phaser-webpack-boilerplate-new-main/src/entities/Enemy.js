import Phaser from "phaser";

import collidable from "../mixins/collidable";
import anims from "../mixins/anims";

class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, key) {
        super(scene, x, y, key);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.config = scene.config; // 설정 값 가져오기

        Object.assign(this, collidable);
        Object.assign(this, anims);

        this.init();
        this.initEvents();
    }

    init() {
        this.gravity = 800;
        this.speed = 50;
        this.timeFromLastTrun = 250;
        this.maxPatrolDistance = 600;
        this.currentPatrolDistance = 0;

        this.health = 40;
        this.damage = 20;

        this.body.setGravityY(500);
        this.setCollideWorldBounds(true);
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.setOrigin(0.5, 1);
        this.setImmovable(true);
        this.setSize(20, 45)
        this.setOffset(7, 20)
        this.setVelocityX(this.speed)
        this.platformCollidersLayer = null;
        this.rayGraphics = this.scene.add.graphics({
            lineStyle: {
                width: 2,
                color: 0xaa00aa
            }
        })

    }

    initEvents() {
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    update(time, delta) {
        if (this.getBounds().bottom > 600) {
            this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
            this.setActive(false);
            this.rayGraphics.clear();
            this.destroy();
            return;
        }

        this.patrol(time);
    }

    patrol(time) {
        if(!this.body || !this.body.onFloor()) {
            return
        }
        this.currentPatrolDistance += Math.abs(this.body.deltaX());
        const { ray, hasHit } = this.raycast(this.body, this.platformCollidersLayer, { 
            raylength : 55, precision : 0, steepnes : 0.7 });
        // console.log("hasHit", hasHit)
        if ((!hasHit || this.currentPatrolDistance >= this.maxPatrolDistance) && this.timeFromLastTrun + 100 < time) {
            this.setFlipX(!this.flipX);
            this.setVelocityX(this.speed = -this.speed)
            this.timeFromLastTrun = time
            this.currentPatrolDistance = 0;
            // console.log("방향 전환")
        }
        // 디버거 모드일 때만 Raycast 표시
        if (this.config.debug) {
            this.rayGraphics.clear();
            this.rayGraphics.strokeLineShape(ray);
        }
    }


    setPlatformColliders(platformCollidersLayer) {
        this.platformCollidersLayer = platformCollidersLayer
    }

    takesHit(source) {
        source.deliversHit(this);
        this.health -= source.damage;
        console.log("Enemy health: ", this.health)

        if(this.health <= 0) {
            this.setTint(0xff0000)
            this.setVelocity(0, -200)
            this.body.checkCollision.none = true;
            this.setCollideWorldBounds(false);
        }
    }
}


export default Enemy;