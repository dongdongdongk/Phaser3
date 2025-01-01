import Phaser from "phaser";

class PlayScene extends Phaser.Scene {
    constructor() {
        super("PlayScene");
    }

    create() {
        this.add
        .tileSprite(0, this.game.config.height as number, 88, 26, 'ground')
        .setOrigin(0, 1);
    }
}


export default PlayScene;