import { BladderBar } from 'objects/BladderBar';
import { InventoryElement } from 'objects/InventoryElement';
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

  inventoryElements: InventoryElement[] = [];

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

    let prevWidth = 0;

    for (let i = 0; i < this.player.inventory.items.length; i++) {
      const item = this.player.inventory.items[i];

      const inventoryElement = new InventoryElement(
        this,
        item,
        prevWidth + 32 + 32 * i,
        32,
        () => this.player.drink(item)
      );

      prevWidth += inventoryElement.getWidth();

      this.inventoryElements.push(inventoryElement);
    }

    emitter.on('end', () => {
      this.add
        .text(1280 / 2, 720 / 2, 'Dorwali cie... Czeka cie noc na Ibizie :(')
        .setScale(2)
        .setOrigin(0.5);
    });
  }

  public update(): void {
    this.bar.onPissAmountChange(this.peeProvider());

    this.inventoryElements.forEach((inventoryElement, i) => {
      inventoryElement.setCount(this.player.inventory.items[i].count);
    });
  }
}
