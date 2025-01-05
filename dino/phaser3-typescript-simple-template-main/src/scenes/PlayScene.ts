import Phaser from "phaser";
import { SpriteWithDynamicBody } from "../types";
import { Player } from "../entities/Player";

class PlayScene extends Phaser.Scene {

    player: Player;
    startTrigger: SpriteWithDynamicBody;
    ground: Phaser.GameObjects.TileSprite;

    get gameHeight() {
        return this.game.config.height as number;
    }

    get gameWidth() {
        return this.game.config.width as number;
    }

    constructor() {
        super("PlayScene");
    }

    create() {
        this.createEnvironment();
        this.createPlayer();
        this.startTrigger = this.physics.add.sprite(0, 10, null)
            .setAlpha(0)
            .setOrigin(0, 1)

        this.physics.add.overlap(this.startTrigger, this.player, () => {
            
            if( this.startTrigger.y === 10) {
                this.startTrigger.body.reset(0, this.gameHeight);
                console.log("Triggering upper Trigger");
                return
            }

            this.startTrigger.body.reset(9999, 9999);

            const rollOutEvent =this.time.addEvent({
                delay: 1000/60,
                loop: true,
                callback: () =>{
                    this.player.setVelocity(80);
                    this.ground.width += (17 * 2);

                    if ( this.ground.width >= this.gameWidth) {
                        rollOutEvent.remove();
                        this.player.setVelocity(0);
                    }
                }
            })

        })
    }

    createPlayer() {
        this.player = new Player(this, 0, this.gameHeight);
    }

    createEnvironment() {
        this.ground = this.add.tileSprite(0, this.gameHeight, 88, 26, "ground").setOrigin(0, 1);
    }

    update(time: number, delta: number): void {
        
    }

}

export default PlayScene;
