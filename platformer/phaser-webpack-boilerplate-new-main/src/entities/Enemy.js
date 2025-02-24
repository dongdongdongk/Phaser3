import Phaser from "phaser";

import collidable from "../mixins/collidable";

class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, key) {
        super(scene, x, y, key);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        Object.assign(this, collidable);

        this.init();
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

    }
   

}


export default Enemy;