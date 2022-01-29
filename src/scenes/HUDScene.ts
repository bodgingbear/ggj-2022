import { BladderBar } from 'objects/BladderBar';

export class HUDScene extends Phaser.Scene {
  public constructor() {
    super({
      key: 'HUDScene',
    });
  }

  public create(): void {
    const bar = new BladderBar(this);
    this.add.existing(bar.bladderShrinking);

    this.add.rectangle(1280, 720 - 50, 100, 100, 0xff0000);
  }
}
