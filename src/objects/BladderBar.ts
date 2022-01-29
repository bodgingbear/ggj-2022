const BLADDER_BAR_X = 865;
const BLADDER_BAR_Y = 105;

export class BladderBar {
  bladderShrinking: Phaser.GameObjects.Rectangle;

  constructor(private scene: Phaser.Scene) {
    const bar = this.scene.add.rectangle(
      BLADDER_BAR_X,
      BLADDER_BAR_Y,
      160,
      26,
      0xffff00
    );

    this.bladderShrinking = this.scene.add.rectangle(
      bar.x - bar.displayWidth / 2,
      bar.y,
      bar.displayWidth - 8,
      bar.displayHeight - 8,
      0xffbb00
    );

    this.bladderShrinking.setOrigin(-0.03, 0.5);
  }

  onPissAmountChange = (piss: number) => {
    this.bladderShrinking.scaleX = piss / 100;
  };

  update() {}
}
