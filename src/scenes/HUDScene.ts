import { BladderBar } from 'objects/BladderBar';
import { InventoryElement } from 'objects/InventoryElement';
import { Player } from 'objects/Player';
import { formatTime, Timer } from 'objects/Timer';
import { EventEmitter } from 'packages/utils';

interface HUDData {
  player: Player;
  peeProvider: () => number;
  startedAt: number;
  emitter: EventEmitter<'end'>;
}

export class HUDScene extends Phaser.Scene {
  peeProvider!: () => number;

  startedAt!: number;

  bar!: BladderBar;

  player!: Player;

  inventoryElements: InventoryElement[] = [];

  timer!: Timer;

  gameOver = false;

  gameOverTime: number | null = null;

  overlay!: Phaser.GameObjects.Rectangle;

  public constructor() {
    super({
      key: 'HUDScene',
    });
  }

  public create({ player, peeProvider, startedAt, emitter }: HUDData): void {
    this.peeProvider = peeProvider;
    this.startedAt = startedAt;
    this.bar = new BladderBar(this);
    this.add.existing(this.bar.bladderShrinking);
    this.timer = new Timer(this, this.startedAt);

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

      this.overlay = this.add
        .rectangle(1280 / 2, 720 / 2, 1280, 720, 0, 1)
        .setDepth(2)
        .setVisible(false)
        .setAlpha(0);
    }

    emitter.on('end', () => {
      this.gameOver = true;
      this.gameOverTime = this.time.now;

      this.overlay.setVisible(true);
      this.tweens.addCounter({
        from: 0,
        to: 1,
        duration: 750,
        yoyo: false,
        loop: 0,
        onUpdate: (val) => {
          this.overlay.setAlpha(val.getValue());
        },
        onComplete: () => {
          const delta = this.gameOverTime ?? 0 - this.startedAt;
          const formattedTime = formatTime(delta);

          this.add
            .text(
              1280 / 2,
              720 / 2,
              `Dorwali cie... Czeka cie noc na Kolskiej 😩\nWytrwałeś aż ${formattedTime} minut`,
              { fontSize: '32px', align: 'center', lineSpacing: 16 }
            )
            .setDepth(3)
            .setOrigin(0.5);
        },
      });
    });
  }

  public update(): void {
    if (this.gameOver) {
      return;
    }

    this.bar.onPissAmountChange(this.peeProvider());
    this.timer.update();

    this.inventoryElements.forEach((inventoryElement, i) => {
      inventoryElement.setCount(this.player.inventory.items[i].count);
    });
  }
}
