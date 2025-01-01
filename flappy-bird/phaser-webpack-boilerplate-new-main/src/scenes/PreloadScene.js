import Phaser from "phaser";
import WebFont from 'webfontloader'; // WebFontLoader 모듈을 import

class PreloadScene extends Phaser.Scene {

    constructor() {
        super('PreloadScene');
    }

    preload() {
        this.load.image("sky", "assets/sky.png");
        this.load.spritesheet("bird", "assets/birdSprite.png", {
            frameWidth: 16, frameHeight: 16
        });
        this.load.image("pipe", "assets/pipe.png");
        this.load.image("pause", "assets/pause.png");
        this.load.image("back", "assets/back.png");

        // WebFontLoader를 사용하여 Google Fonts에서 한글 폰트 로드
        WebFont.load({
            google: {
                families: ['Noto Sans KR'] // 한글을 지원하는 Google Font 로드
            },
            active: () => {

            }
        });
    }

    create() {
        this.scene.start('MenuScene');
    }
}

export default PreloadScene;