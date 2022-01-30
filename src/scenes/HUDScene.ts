import { BladderBar, BlADDER_BAR_WIDTH } from 'objects/BladderBar';
import { ClickableElement } from 'objects/ClickableElement';
import { Player } from 'objects/Player';
import { EventEmitter } from 'packages/utils';

interface HUDData {
  player: Player;
  peeProvider: () => number;
  emitter: EventEmitter<'end'>;
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

  public create({ player, peeProvider, emitter }: HUDData): void {
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

    emitter.on('end', () => {
      this.add
        .text(1280 / 2, 720 / 2, 'Dorwali cie... Czeka cie noc na Ibizie :(')
        .setScale(2)
        .setOrigin(0.5);
    });
  }

  public update(): void {
    this.bar.onPissAmountChange(this.peeProvider());
  }
}
