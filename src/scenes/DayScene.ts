import { Lantern } from 'objects/Lantern';
import { Lidl } from 'objects/Lidl';
import { Player } from 'objects/Player';
import { Trees } from 'objects/Trees';
import { debugMap } from 'packages/utils/shouldSkipIntro';
import { Trolley } from 'objects/Trolley';
import { GameEmiter } from 'objects/GameEmiter';

export class DayScene extends Phaser.Scene {
  private player!: Player;

  private zIndexGroup!: Phaser.GameObjects.Group;

  physics!: Phaser.Physics.Arcade.ArcadePhysics;

  lidl!: Lidl;

  trees!: Trees;

  overlay!: Phaser.GameObjects.Rectangle;

  ended = false;

  hudEmitter = new GameEmiter();

  trolleys: Trolley[] = [];

  public constructor() {
    super({
      key: 'DayScene',
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

    this.player = new Player(this, 1500, 1100, keys, true);
    this.zIndexGroup.add(this.player.sprite);

    this.cameras.main.startFollow(this.player.sprite, false, 0.1, 0.1);
    this.lights.enable();

    this.lights.setAmbientColor(0xffffff);
    if (debugMap()) {
      this.cameras.main.setZoom(0.5);
    }
    this.lidl = new Lidl(this, this.player, false);
    this.zIndexGroup.add(this.lidl.sprite);

    const lanterns = [
      new Lantern(this, 260 - 33, 800, true, false),
      new Lantern(this, 890 - 33, 600, true, false),
      new Lantern(this, 260 - 33, 1200, true, false),
      new Lantern(this, 890 - 33, 1000, true, false),
      new Lantern(this, 1500, 500, false, false),
      new Lantern(this, 1500, 1200, false, false),
    ];
    lanterns.forEach((lantern) => this.zIndexGroup.add(lantern.sprite));

    this.trees = new Trees(this, this.player);

    this.scene.run('DayHUDScene', {
      player: this.player,
    });

    this.overlay = this.add
      .rectangle(0, 0, bg.displayWidth, bg.displayHeight, 0, 1)
      .setOrigin(0)
      .setPosition(-10000000)
      .setAlpha(0);

    this.trolleys.push(new Trolley(this, this.player, this.lidl));

    this.trolleys.forEach((t) => this.zIndexGroup.add(t.sprite));

    // NA KONIEC DNIA: dźwięk horroru i płynne przejście do nocy w tym dźwięku
    // NA POCZATEK NOCY:
    // 1. dźwięk wiatru start
    // 2. (do ustalenia dokładnie) randomowo co jakiś czas żeby był dźwięk "andrzejku/andrzeju" od męskiego miejskiego (sprawdzać w booleanie czy jest jakiś męski miejski i jak jest to dać na to timeout)

    // SOUNDS DO USTALENIA: szczekanie na wchodzenie (imo chyba nie xd)
  }

  update(_time: number, delta: number) {
    this.player?.update();

    if (this.ended) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.zIndexGroup.children.entries.forEach((el: any) =>
      el.setDepth(el.y + el.displayHeight)
    );

    this.trolleys.forEach((t) => t.update());
    this.lidl.update();
  }
}
