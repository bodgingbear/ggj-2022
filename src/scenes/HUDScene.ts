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
  }
}
