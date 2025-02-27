import Phaser from "phaser";

import collidable from "../mixins/collidable";

class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, key) {
        super(scene, x, y, key);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        Object.assign(this, collidable);

        this.init();
        this.initEvents();
    }

    init() {
        this.gravity = 800;
        this.body.setGravityY(500);
        this.setCollideWorldBounds(true);
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.setOrigin(0.5, 1);
        this.setImmovable(true);
        this.setSize(20, 45)
        this.setOffset(7, 20)

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
        this.setVelocityX(30);
        // this.setFlipX(true)

        this.rayGraphics.clear();
        const { ray } = this.raycast(this.body);
        this.rayGraphics.strokeLineShape(ray);
    }

    raycast(body, raylength=30) {
        const { x, y, width, halfHeight } = body;
        const line = new Phaser.Geom.Line();

        line.x1 = x + width;
        line.y1 = y + halfHeight;
        line.x2 = line.x1 + raylength;
        line.y2 = line.y1 + raylength;

        return { ray: line }
    }
}


export default Enemy;