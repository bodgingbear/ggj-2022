import { BladderBar, BlADDER_BAR_WIDTH } from 'objects/BladderBar';
import { ClickableElement } from 'objects/ClickableElement';
import { Player } from 'objects/Player';

interface HUDData {
  player: Player;
  peeProvider: () => number;
}

export class HUDScene extends Phaser.Scene {
  peeProvider!: () => number;

  bar!: BladderBar;

  player!: Player;

  public constructor() {
    super({
      key: 'HUDScene',
    });
  }

  public create({ player, peeProvider }: HUDData): void {
    this.peeProvider = peeProvider;
    this.bar = new BladderBar(this);
    this.add.existing(this.bar.bladderShrinking);

    this.player = player;
    new ClickableElement(
      this,
      'alcohol.png',
      'Q',
      1280 - BlADDER_BAR_WIDTH - 32,
      32,
      () => this.player.addPiss(10)
    );
  }

  public update(): void {
    this.bar.onPissAmountChange(this.peeProvider());
  }
}
