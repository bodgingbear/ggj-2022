import { BladderBar } from 'objects/BladderBar';
import { Enemy } from 'objects/Enemy';
import { Lantern } from 'objects/Lantern';
import { Lidl } from 'objects/Lidl';
import { PissDropsController } from 'objects/PissDropsController';
import { Player } from 'objects/Player';
import { Trees } from 'objects/Trees';

export class GameScene extends Phaser.Scene {
  private player?: Player;

  enemies!: Phaser.GameObjects.Group;

  pissDrops!: Phaser.GameObjects.Group;

  private pissDropsController!: PissDropsController;

  private zIndexGroup!: Phaser.GameObjects.Group;

  physics!: Phaser.Physics.Arcade.ArcadePhysics;

  lidl!: Lidl;

  trees!: Trees;

  public constructor() {
    super({
      key: 'GameScene',
    });
  }

  public create(): void {
    const bg = this.add
      .image(0, 0, 'master', 'bg.png')
      .setOrigin(0)
      .setScale(4)
      .setPipeline('Light2D');
    this.cameras.main.setBounds(0, 0, bg.displayWidth, bg.displayHeight);

    this.physics.world.setBounds(0, 100, bg.displayWidth, bg.displayHeight);
    this.physics.world.setBoundsCollision();

    const keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    this.zIndexGroup = this.add.group();

    this.pissDrops = this.add.group();

    this.enemies = this.add.group();
    this.enemies.add(new Enemy(this).sprite);

    this.enemies.children.entries.forEach((enemy) => {
      this.zIndexGroup.add(enemy);
    });

    this.pissDropsController = new PissDropsController(
      this,
      this.pissDrops,
      this.enemies
    );
    this.player = new Player(this, 1200, 900, keys, this.pissDrops);
    this.zIndexGroup.add(this.player.sprite);

    this.cameras.main.startFollow(this.player.sprite, false, 0.1, 0.1);

    this.lights.enable();
    this.lights.setAmbientColor(0xffffff);

    const lanterns = [
      new Lantern(this, 260 - 33, 800, true),
      new Lantern(this, 890 - 33, 700, true),
      new Lantern(this, 260 - 33, 1200, true),
      new Lantern(this, 890 - 33, 1100, true),
      new Lantern(this, 1500, 700, false),
      new Lantern(this, 1500, 1200, false),
    ];
    lanterns.forEach((lantern) => this.zIndexGroup.add(lantern.sprite));

    this.lidl = new Lidl(this, this.player);
    this.trees = new Trees(this, this.player);

    this.scene.run('HUDScene');
  }

  update(_time: number, delta: number) {
    this.player?.update(delta);
    this.enemies.children.entries.forEach((enemy) =>
      enemy.getData('ref').update(delta, this.player)
    );

    this.zIndexGroup.children.entries.forEach((el) =>
      el.setDepth(el.y + el.displayHeight)
    );
  }
}
