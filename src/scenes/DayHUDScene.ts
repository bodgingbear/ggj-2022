import { GameEmiter } from 'objects/GameEmiter';
import { InventoryElementsList } from 'objects/InventoryElementsList';
import { Player } from 'objects/Player';

interface HUDData {
  player: Player;
  peeProvider: () => number;
  startedAt: number;
  emitter: GameEmiter;
}

export class DayHUDScene extends Phaser.Scene {
  player!: Player;

  inventoryElementsList!: InventoryElementsList;

  gameOver = false;

  gameOverTime: number | null = null;

  public constructor() {
    super({
      key: 'DayHUDScene',
    });
  }

  public create({ player }: HUDData): void {
    this.player = player;

    this.inventoryElementsList = new InventoryElementsList(
      this,
      this.player.inventory.items,
      false
    );
  }

  public update(): void {
    this.inventoryElementsList.elements.forEach((inventoryElement, i) => {
      inventoryElement.setCount(this.player.inventory.items[i].count);
    });
  }
}
