import { Lantern } from 'objects/Lantern';
import { Lidl } from 'objects/Lidl';
import { Moon } from 'objects/Moon';
import { PissDropsController } from 'objects/PissDropsController';
import { Player } from 'objects/Player';
import { Trees } from 'objects/Trees';
import { EnemiesSpawnController } from 'objects/EnemiesSpawnController';
import { debugMap } from 'packages/utils/shouldSkipIntro';
import { Enemy } from 'objects/Enemy';
import { EventEmitter } from 'packages/utils';

export class GameScene extends Phaser.Scene {
  private player!: Player;

  enemies!: Phaser.GameObjects.Group;

  pissDrops!: Phaser.GameObjects.Group;

  private pissDropsController!: PissDropsController;

  private enemiesSpawnController!: EnemiesSpawnController;

  private zIndexGroup!: Phaser.GameObjects.Group;

  physics!: Phaser.Physics.Arcade.ArcadePhysics;

  lidl!: Lidl;

  trees!: Trees;

  overlay!: Phaser.GameObjects.Rectangle;

  ended = false;

  hudEmitter = new EventEmitter<'end'>();

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
    this.enemiesSpawnController = new EnemiesSpawnController(this);

    this.enemiesSpawnController.on('request-emit', (position) => {
      const enemy = new Enemy(this, position);
      this.enemies.add(enemy.sprite);
      this.zIndexGroup.add(enemy.sprite);
      enemy.on('destroy', () => {
        if (this.enemies.children.entries.length === 0) {
          this.enemiesSpawnController.onRoundEnd();
        }
      });
    });

    this.enemiesSpawnController.on('end-of-levels', () => {
      alert('END OF LEVELS');
    });

    this.pissDropsController = new PissDropsController(
      this,
      this.pissDrops,
      this.enemies
    );
    this.player = new Player(this, 200, 900, keys, this.pissDrops, () => {
      console.log('TODO: Play dzwięki bólu zula, ze juz go pecherz boli XD');
    });
    this.zIndexGroup.add(this.player.sprite);

    this.physics.add.collider(this.enemies, this.player.sprite, () => {
      if (this.ended) return;

      this.ended = true;
      this.handleAndrzejCaught();
    });

    this.cameras.main.startFollow(this.player.sprite, false, 0.1, 0.1);
    this.lights.enable();

    if (debugMap()) {
      this.lights.setAmbientColor(0xffffff);
      this.cameras.main.setZoom(0.5);
    } else {
      this.lights.setAmbientColor(0);
    }

    new Moon(this, 200, 200);
    this.lidl = new Lidl(this, this.player);

    const lanterns = [
      new Lantern(this, 260 - 33, 800, true),
      new Lantern(this, 890 - 33, 600, true),
      new Lantern(this, 260 - 33, 1200, true),
      new Lantern(this, 890 - 33, 1000, true),
      new Lantern(this, 1500, 500, false),
      new Lantern(this, 1500, 1200, false),
    ];
    lanterns.forEach((lantern) => this.zIndexGroup.add(lantern.sprite));

    this.addCameraSwing();
    this.trees = new Trees(this, this.player);

    this.scene.run('HUDScene', {
      peeProvider: () => this.player?.pee ?? 0,
      player: this.player,
      emitter: this.hudEmitter,
    });

    this.overlay = this.add
      .rectangle(0, 0, bg.displayWidth, bg.displayHeight, 0, 1)
      .setOrigin(0)
      .setPosition(-10000000)
      .setAlpha(0);
  }

  update(_time: number, delta: number) {
    this.player?.update();
    this.enemies.children.entries.forEach((enemy) =>
      enemy.getData('ref').update(delta, this.player)
    );

    if (this.ended) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.zIndexGroup.children.entries.forEach((el: any) =>
      el.setDepth(el.y + el.displayHeight)
    );
  }

  addCameraSwing() {
    this.tweens.addCounter({
      duration: 1000,
      yoyo: true,
      ease: 'sine.inout',
      loop: -1,
      from: 0,
      to: 1,

      onUpdate: (value) => {
        this.cameras.main.setFollowOffset(value.getValue() * 100);
      },
    });
  }

  handleAndrzejCaught() {
    this.zIndexGroup.children.entries.forEach((el: any) => el.setDepth(1));
    this.children.bringToTop(this.overlay.setPosition(0, 0).setDepth(2));

    this.tweens.addCounter({
      from: 0,
      to: 0.9,
      duration: 1000,
      yoyo: false,
      loop: 0,
      onUpdate: (val) => {
        this.overlay.setAlpha(val.getValue());
      },
      onComplete: () => {
        this.hudEmitter.emit('end');
      },
    });
  }
}
