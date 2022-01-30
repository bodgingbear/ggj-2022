import { Lantern } from 'objects/Lantern';
import { Lidl } from 'objects/Lidl';
import { Moon } from 'objects/Moon';
import { Player } from 'objects/Player';
import { Trees } from 'objects/Trees';
import { EnemiesSpawnController } from 'objects/EnemiesSpawnController';
import { debugMap } from 'packages/utils/shouldSkipIntro';
import { Enemy } from 'objects/Enemy';
import { EventEmitter } from 'packages/utils';
import { PissDrop } from 'objects/PissDrop';
import { PissDropsController } from 'objects/PissDropsController';
import { GameEmiter } from 'objects/GameEmiter';

export class GameScene extends Phaser.Scene {
  private player!: Player;

  enemies!: Phaser.GameObjects.Group;

  pissDrops!: Phaser.GameObjects.Group;

  private enemiesSpawnController!: EnemiesSpawnController;

  private zIndexGroup!: Phaser.GameObjects.Group;

  physics!: Phaser.Physics.Arcade.ArcadePhysics;

  public noPee: () => void = () => {
    console.log('randomize dźwięk nie ma już siku - 4 łącznie');
  };

  lidl!: Lidl;

  trees!: Trees;

  ended = false;

  hudEmitter = new GameEmiter();

  startedAt!: number;

  pissDropsController!: PissDropsController;

  public constructor() {
    super({
      key: 'GameScene',
    });
  }

  public create(): void {
    this.startedAt = this.time.now;

    const bg = this.add
      .image(0, 0, 'master', 'bg.png')
      .setOrigin(0)
      .setScale(4)
      .setPipeline('Light2D');
    this.cameras.main.setBounds(0, 0, bg.displayWidth, bg.displayHeight);

    const boundsTop = 400;
    this.physics.world.setBounds(
      0,
      boundsTop,
      bg.displayWidth,
      bg.displayHeight - boundsTop
    );
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

    this.pissDropsController = new PissDropsController(
      this,
      this.pissDrops,
      this.enemies
    );

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

    this.player = new Player(this, 200, 900, keys, false);

    const pissDropDeathEmitterManager = this.add
      .particles('master', 'piss-drop.png')
      .setPipeline('Light2D');

    this.player.on('request-piss', (rotation, position, velocity, isUp) => {
      this.pissDrops.add(
        new PissDrop(
          this,
          rotation,
          position,
          velocity,
          pissDropDeathEmitterManager
        ).sprite.setDepth(
          isUp ? this.player.sprite.depth - 0.1 : this.player.sprite.depth + 0.1
        )
      );
    });
    this.player.on('no-pee-left', () => this.noPee());
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
      this.addCameraSwing();
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

    this.trees = new Trees(this, this.player);

    this.scene.run('HUDScene', {
      peeProvider: () => this.player?.pee ?? 0,
      startedAt: this.startedAt,
      player: this.player,
      emitter: this.hudEmitter,
    });

    this.hudEmitter.on('drink', (item) => {
      this.player.drink(item);
    });
    // PODCZAS DNIA: podśpiewywanie

    // NA KONIEC DNIA: dźwięk horroru i płynne przejście do nocy w tym dźwięku

    // NA POCZATEK NOCY: dźwięk wiatru start w miarę cicho

    // PODCZAS DNIA: (do ustalenia dokładnie) randomowo co jakiś czas żeby był dźwięk "andrzejku/andrzeju" od męskiego miejskiego (sprawdzać w booleanie czy jest jakiś męski miejski i jak jest to dać na to timeout)
  }

  update(_time: number, delta: number) {
    this.player?.update(delta);
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
        this.cameras.main.setFollowOffset(value.getValue() * 50);
      },
    });
  }

  handleAndrzejCaught() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.zIndexGroup.children.entries.forEach((el: any) => el.setDepth(1));
    this.hudEmitter.emit('end');
    this.scene.pause();
  }
}
