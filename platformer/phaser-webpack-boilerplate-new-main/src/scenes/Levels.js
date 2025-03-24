// import Phaser from "phaser";
import BaseScene from "./BaseScene";

class LevelScene extends BaseScene {
  constructor(config) {
    super("LevelScene", {...config, canGoBack: true});
  }

  create() {
    super.create();

    this.menu = [];
    const levels = this.registry.get('unlocked-levels');

    for(let i = 1; i <= levels; i++) {
        this.menu.push({
            scene: 'PlayScene', text: `Level ${i}`, level: i
        })
    }

    this.createMenu(this.menu, (menuItem) => this.setupMenuEvents(menuItem));
  }

  setupMenuEvents(menuItem) {
    const textGo = menuItem.textGo;
    textGo.setInteractive();
    textGo.setFont("CustomFont");
    // setFontSize 대신 setStyle로 폰트 크기와 스타일을 명확히 설정
    textGo.setStyle({
      fontFamily: "CustomFont",
      fontSize: "50px", // 크기 설정
      fill: "#000", // 텍스트 색상
    });

    textGo.on("pointerover", () => {
      textGo.setStyle({ fill: "#fff" });
    });

    textGo.on("pointerout", () => {
      textGo.setStyle({ fill: "#000" });
    });

    textGo.on("pointerup", () => {
      if (menuItem.scene) {
        this.registry.set('level', menuItem.level)
        this.scene.start(menuItem.scene);
      }

      if (menuItem.text === "Exit") {
        this.game.destroy(true);
      }
    });
  }
}

export default LevelScene;
