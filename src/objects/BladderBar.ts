import { PEE_MAX_VALUE } from 'constants';

const BLADDER_BAR_X = 1280;
const BLADDER_BAR_Y = 0;

export const BlADDER_BAR_WIDTH = 160;
const BLADDER_BAR_HEIGHT = 26;

export class BladderBar {
  bar: Phaser.GameObjects.Rectangle;

  bladderShrinking: Phaser.GameObjects.Rectangle;

  constructor(private scene: Phaser.Scene) {
    this.bar = this.scene.add.rectangle(
      BLADDER_BAR_X - BlADDER_BAR_WIDTH,
      BLADDER_BAR_Y + BLADDER_BAR_HEIGHT - 10,
      BlADDER_BAR_WIDTH,
      BLADDER_BAR_HEIGHT,
      0xffff00
    );

    this.bladderShrinking = this.scene.add.rectangle(
      this.bar.x,
      this.bar.y + 13,
      this.bar.displayWidth - 8,
      this.bar.displayHeight - 8,
      0xffbb00
    );

    this.bar.setOrigin(0);
    this.onPissAmountChange(100);
  }

  onPissAmountChange = (piss: number) => {
    this.bladderShrinking.scaleX = piss / PEE_MAX_VALUE;
    this.bladderShrinking.setX(
      this.bar.x + this.bladderShrinking.displayWidth / 2 + 4
    );
  };

  update() {}
}
