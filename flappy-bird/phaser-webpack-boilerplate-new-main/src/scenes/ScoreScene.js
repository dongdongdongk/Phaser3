// import Phaser from "phaser";
import BaseScene from "./BaseScene";

class ScoreScene extends BaseScene {

    constructor(config) {
        super('ScoreScene', config);
    }


    create() {
        super.create();

        const bestScore = localStorage.getItem('bestScore');
        this.add.text(...this.screenCenter, `BestScore: ${bestScore || 0 }`, this.fontOptions).setOrigin(0.5)
    }

}

export default ScoreScene;