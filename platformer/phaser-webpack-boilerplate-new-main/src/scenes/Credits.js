// import Phaser from "phaser";
import BaseScene from "./BaseScene";

class CreditsScene extends BaseScene {
  constructor(config) {
    super("CreditsScene", {...config, canGoBack: true});
    
    this.menu = [
      { scene: null, text: "플레이해 주셔서 감사합니다." },
      { scene: null, text: "-DongK-" },
    ];
  }

  create() {
    super.create();

    this.createMenu(this.menu, (menuItem) => this.setupCreditsStyle(menuItem));
  }

  setupCreditsStyle(menuItem) {
    const textGo = menuItem.textGo;
    textGo.setInteractive();
    textGo.setStyle({
      fontFamily: "CustomFont",
      fontSize: "40px",
      fill: "#000", // 흰색 텍스트
      align: "center",
    });
  }

}

export default CreditsScene;
