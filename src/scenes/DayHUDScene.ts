import { DayTimer } from 'objects/DayTimer';
import { GameEmiter } from 'objects/GameEmiter';
import { InventoryElementsList } from 'objects/InventoryElementsList';
import { Player } from 'objects/Player';

interface HUDData {
  player: Player;
  peeProvider: () => number;
  startedAt: number;
  emiter: GameEmiter;
}

export class DayHUDScene extends Phaser.Scene {
  player!: Player;

  inventoryElementsList!: InventoryElementsList;

  gameOver = false;

  gameOverTime: number | null = null;

  timer!: DayTimer;

  overlay!: Phaser.GameObjects.Rectangle;

  public constructor() {
    super({
      key: 'DayHUDScene',
    });
  }

  public create({ player, emiter }: HUDData): void {
    this.player = player;

    this.timer = new DayTimer(this, Date.now());

    this.inventoryElementsList = new InventoryElementsList(
      this,
      this.player.inventory.items,
      false
    );

    this.overlay = this.add
      .rectangle(1280 / 2, 720 / 2, 1280, 720, 0, 1)
      .setDepth(2)
      .setVisible(true)
      .setAlpha(0);

    this.timer.addListener('end', () => {
      emiter.emit('end');

      this.tweens.add({
        targets: [this.overlay],
        alpha: 1,
        duration: 750,
        onComplete: () => {
          emiter.emit('overlayEnd');
        },
      });
    });
  }

  public update(): void {
    this.timer.update();

    this.inventoryElementsList.elements.forEach((inventoryElement, i) => {
      inventoryElement.setCount(this.player.inventory.items[i].count);
    });
  }
}
