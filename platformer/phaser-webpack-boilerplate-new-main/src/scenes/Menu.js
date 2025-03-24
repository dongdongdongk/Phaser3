// import Phaser from "phaser";
import BaseScene from "./BaseScene";

class MenuScene extends BaseScene {
  constructor(config) {
    super("MenuScene", config);
    this.menu = [
      { scene: "PlayScene", text: "Play" },
      { scene: "LevelScene", text: "Levels" },
      { scene: null, text: "Exit" },
    ];
  }

  create() {
    super.create();

    this.createMenu(this.menu, (menuItem) => this.setupMenuEvents(menuItem));
  }

  setupMenuEvents(menuItem) {
    const textGo = menuItem.textGo;
    textGo.setInteractive();
    textGo.setFont("Noto Sans");
    // setFontSize 대신 setStyle로 폰트 크기와 스타일을 명확히 설정
    textGo.setStyle({
      fontFamily: "Noto Sans",
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
        this.scene.start(menuItem.scene);
      }

      if (menuItem.text === "Exit") {
        this.game.destroy(true);
      }
    });
  }
}

export default MenuScene;
