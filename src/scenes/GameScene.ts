import { Enemy } from 'objects/Enemy';
import { PissDropsController } from 'objects/PissDropsController';
import { Player } from 'objects/Player';

export class GameScene extends Phaser.Scene {
  private player?: Player;

  // TODO: DO Wyjebania
  private enemy?: Enemy;

  enemies!: Phaser.GameObjects.Group;

  pissDrops!: Phaser.GameObjects.Group;

  private pissDropsController!: PissDropsController;

  public constructor() {
    super({
      key: 'GameScene',
    });
  }

  public create(): void {
    this.add.text(50, 50, 'Here is the game', {
      fontSize: '12px',
      fill: '#fff',
      align: 'center',
      lineSpacing: 10,
    });

    const keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    this.pissDrops = this.add.group();

    this.player = new Player(this, keys, this.pissDrops);
    // this.enemy = new Enemy(this);

    this.enemies = this.add.group();

    this.enemies.add(new Enemy(this).sprite);

    this.pissDropsController = new PissDropsController(
      this,
      this.pissDrops,
      this.enemies
    );
  }

  update(_time: number, delta: number) {
    this.player?.update(delta);
    this.enemy?.update(delta, this.player!);
  }
}
