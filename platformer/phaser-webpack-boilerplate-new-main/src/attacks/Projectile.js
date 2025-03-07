import Phaser from "phaser";

class Projectile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, key) {
        super(scene, x, y, key);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.speed = 300;
        this.maxDistance = 200;
        this.traveledDistance = 0;

        this.cooldown = 1000;
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        this.traveledDistance += this.body.deltaAbsX();

        if (this.isOutofRange()) {
            this.body.reset(0,0)
            this.setActive(false);
            this.setVisible(false);
            this.traveledDistance = 0;
        }
    }

    fire(x, y) {
        this.setActive(true);
        this.setVisible(true);
        this.body.reset(x, y);
        this.setVelocityX(this.speed);
    }

    isOutofRange() {
        return this.traveledDistance && 
               this.traveledDistance >= this.maxDistance
    }
}

export default Projectile;