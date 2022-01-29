import { Enemy } from 'objects/Enemy';
import { Lantern } from 'objects/Lantern';
import { PissDropsController } from 'objects/PissDropsController';
import { Player } from 'objects/Player';

export class GameScene extends Phaser.Scene {
  private player?: Player;

  // TODO: DO Wyjebania
  private enemy?: Enemy;

  enemies!: Phaser.GameObjects.Group;

  pissDrops!: Phaser.GameObjects.Group;

  private pissDropsController!: PissDropsController;

  private zIndexGroup!: Phaser.GameObjects.Group;

  physics!: Phaser.Physics.Arcade.ArcadePhysics;

  public constructor() {
    super({
      key: 'GameScene',
    });
  }

  public create(): void {
    const bg = this.add.image(0, 0, 'master', 'bg.png').setOrigin(0).setScale(4).setPipeline('Light2D');
    this.cameras.main.setBounds(0, 0, bg.displayWidth, bg.displayHeight);

    this.physics.world.setBounds(0, 100, bg.displayWidth, bg.displayHeight)
    this.physics.world.setBoundsCollision()

    const keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    this.zIndexGroup = this.add.group()

    this.pissDrops = this.add.group();

    this.enemies = this.add.group();
    this.enemies.add(new Enemy(this).sprite);

    this.enemies.children.entries.forEach(enemy => {
      this.zIndexGroup.add(enemy)
    })

    this.pissDropsController = new PissDropsController(
      this,
      this.pissDrops,
      this.enemies
    );
    this.player = new Player(this, 600, 600, keys, this.pissDrops);
    this.zIndexGroup.add(this.player.sprite)

    this.cameras.main.startFollow(this.player.sprite, false, 0.1, 0.1)

    this.lights.enable();
    this.lights.setAmbientColor(0x111111)

    const lanterns = [
    new Lantern(this, 600, 600),
    new Lantern(this, 900, 900),
    new Lantern(this, 200, 700),
    ]
    lanterns.forEach(lantern => this.zIndexGroup.add(lantern.sprite))
  }

  update(_time: number, delta: number) {
    this.player?.update(delta);
    this.enemies.children.entries.forEach(enemy => enemy.getData('ref').update(delta, this.player))
 
    this.zIndexGroup.children.entries.forEach(el => el.setDepth(el.y + el.displayHeight))
  }
}
