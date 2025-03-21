import Phaser from "phaser";
import Projectile from "./Projectile";
import { getTimestamp } from "../utils/function";

class Projectiles extends Phaser.Physics.Arcade.Group {
    constructor(scene , key) {
        super(scene.physics.world, scene);

        this.createMultiple({
            frameQuantity: 5,
            active: false,
            visible: false,
            key,
            classType: Projectile
        });
        this.timeFromLastProjectile = null
    }

    fireProjectile(initiator, anim) {
        const projectile = this.getFirstDead(false);
        let centerX
        if (!projectile) {
            return;
        }
        if (this.timeFromLastProjectile &&
            this.timeFromLastProjectile + projectile.cooldown > getTimestamp()) {
                return
            }

        const center = initiator.getCenter();

        if (initiator.lastDirection === Phaser.Physics.Arcade.FACING_RIGHT) {
            projectile.speed = Math.abs(projectile.speed);
            projectile.flipX = false;
            centerX = center.x + 10
        } else {
            projectile.speed = -Math.abs(projectile.speed);
            projectile.flipX = true;
            centerX = center.x - 10
        }

        projectile.fire(center.x, center.y, anim);
        this.timeFromLastProjectile = getTimestamp();
    }
}

export default Projectiles;