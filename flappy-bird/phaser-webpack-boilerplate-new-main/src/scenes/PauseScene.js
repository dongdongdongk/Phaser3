// import Phaser from "phaser";
import BaseScene from "./BaseScene";

class PauseScene extends BaseScene {

    constructor(config) {
        super('PauseScene', config);
        this.menu = [
            {scene: 'PlayScene', text: 'Continue'},
            {scene: 'MenuScene', text: 'Exit'},
        ]
    }


    create() {
        super.create();

        this.createMenu(this.menu, (menuItem) => this.setupMenuEvents(menuItem));
    }

    setupMenuEvents(menuItem) {
        const textGo = menuItem.textGo;
        textGo.setInteractive();
        textGo.on('pointerover', () => {
            textGo.setStyle({fill: '#ff0'});
        })

        textGo.on('pointerout', () => {
            textGo.setStyle({fill: '#fff'})
        })

        textGo.on('pointerup', () => {
            if (menuItem.scene && menuItem.text === 'Continue') {
                this.scene.stop();
                this.scene.resume(menuItem.scene);
            }
        });
    }
}

export default PauseScene;