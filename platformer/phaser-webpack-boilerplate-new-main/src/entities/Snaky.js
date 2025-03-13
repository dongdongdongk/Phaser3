import Enemy from "./Enemy";
import initAnims from "./anims/snakyAnims";
import Pojectiles from "../attacks/Projectiles";

class Snaky extends Enemy{
    constructor(scene, x, y) {
        super(scene, x, y, "snaky");
        initAnims(scene.anims);
    }
    init() {
        super.init();
        this.speed = 80;
        this.health = 40;
        this.setSize(12, 57)
        this.setOffset(7, 7)
        this.projectiles = new Pojectiles(this.scene, 'fireball-1')
        this.timeFromLastAttack = 0;
        this.attackDelay = this.getAttackDelay();
    }

    update(time, delta) {
        super.update(time, delta)

        if ( this.body.velocity.x > 0 ) {
            this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT
        } else {
            this.lastDirection = Phaser.Physics.Arcade.FACING_LEFT
        }


        if(this.timeFromLastAttack + this.attackDelay <= time) {
            this.projectiles.fireProjectile(this, 'fireball');

            this.timeFromLastAttack = time;
            this.attackDelay = this.getAttackDelay();
            this.lastDirection = null;
        }

        if(!this.active) {
            return
        }
        if(this.isPlayingAnims('snaky-hurt')) {
            return
        }

        if(this.health <= 0) {
            this.play('snaky-die', true)
            return
        }
        this.play('snaky-walk', true)
    }

    getAttackDelay() {
        return Phaser.Math.Between(3000, 5000)
    }

    takesHit(source) {
        super.takesHit(source);
        this.play('snaky-hurt', true)
    }
}


export default Snaky ;