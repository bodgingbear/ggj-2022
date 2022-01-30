import { BladderBar } from 'objects/BladderBar';
import { GameEmiter } from 'objects/GameEmiter';
import { InventoryElementsList } from 'objects/InventoryElementsList';
import { Player } from 'objects/Player';
import { formatTime, Timer } from 'objects/Timer';

interface HUDData {
  player: Player;
  peeProvider: () => number;
  startedAt: number;
  emitter: GameEmiter;
}

export class HUDScene extends Phaser.Scene {
  peeProvider!: () => number;

  startedAt!: number;

  bar!: BladderBar;

  player!: Player;

  inventoryElementsList!: InventoryElementsList;

  timer!: Timer;

  gameOver = false;

  gameOverTime: number | null = null;

  overlay!: Phaser.GameObjects.Rectangle;

  public constructor() {
    super({
      key: 'HUDScene',
    });
  }

  public create({ player, peeProvider, emitter }: HUDData): void {
    this.gameOver = false;
    this.gameOverTime = null;

    this.peeProvider = peeProvider;
    this.startedAt = Date.now();
    this.bar = new BladderBar(this);
    this.add.existing(this.bar.bladderShrinking);
    this.timer = new Timer(this, this.startedAt);

    this.player = player;

    this.inventoryElementsList = new InventoryElementsList(
      this,
      this.player.inventory.items,
      true,
      (item) => emitter.emit('drink', item)
    );

    this.overlay = this.add
      .rectangle(1280 / 2, 720 / 2, 1280, 720, 0, 1)
      .setDepth(2)
      .setVisible(false)
      .setAlpha(0);

    emitter.on('end', () => {
      this.gameOver = true;
      this.gameOverTime = Date.now();

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
          const delta = (this.gameOverTime ?? 0) - this.startedAt;
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

          this.time.addEvent({
            delay: 2000,
            callback: () => emitter.emit('overlayEnd'),
          });
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

    this.inventoryElementsList.elements.forEach((inventoryElement, i) => {
      inventoryElement.setCount(this.player.inventory.items[i].count);
    });
  }
}
