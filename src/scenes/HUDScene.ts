import { BladderBar } from 'objects/BladderBar';

export class HUDScene extends Phaser.Scene {
  peeProvider!: () => number;

  bar!: BladderBar;

  public constructor() {
    super({
      key: 'HUDScene',
    });
  }

  public create({ peeProvider }: { peeProvider: () => number }): void {
    this.peeProvider = peeProvider;
    this.bar = new BladderBar(this);
    this.add.existing(this.bar.bladderShrinking);
  }

  public update(): void {
    this.bar.onPissAmountChange(this.peeProvider());
  }
}
