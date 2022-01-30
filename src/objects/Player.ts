import { debugMap } from 'packages/utils/shouldSkipIntro';

import { EventEmitter } from 'packages/utils';

import { Sound } from 'Sound';

import { PEE_DEFAULT_VALUE, PEE_MAX_VALUE } from '../constants';
import {
  Inventory,
  AlcoholInventoryItem,
  InventoryItem,
  EnergyInventoryItem,
} from './Inventory';
import { PasserBy } from './PasserBy';

const BASE_PLAYER_VELOCITY = debugMap() ? 500 : 150;
const DAY_BASE_PLAYER_VELOCITY = 200;
const ROTATION_SPEED = Math.PI * 0.5;

type Direction = 'up' | 'down' | 'left' | 'right';

export class Player extends EventEmitter<
  'request-piss' | 'no-pee-left' | 'request-talk',
  {
    'request-piss': (
      rotation: number,
      position: Phaser.Math.Vector2,
      velocity: Phaser.Math.Vector2,
      isUp: boolean
    ) => void;
    'no-pee-left': () => void;
    'request-talk': () => void;
  }
> {
  public sprite: Phaser.GameObjects.Sprite;

  public pee: number = PEE_DEFAULT_VALUE;

  public body: Phaser.Physics.Arcade.Body;

  private targetToMouseRotation: number = 0;

  private pointer: Phaser.Input.Pointer | null = null;

  private rotation = 0;

  private light?: Phaser.GameObjects.Light;

  public inventory = new Inventory();

  private isShaking = false;

  private energeticTimeEvent: Phaser.Time.TimerEvent | null = null;

  private playerVelocity: number;

  lastPasserToTalk?: PasserBy;

  get songNames(): string[] {
    return [Sound.hoboSinging1, Sound.hoboSinging2, Sound.hoboSinging3];
  }

  private songs: Phaser.Sound.BaseSound[] = [];

  get randomSong(): Phaser.Sound.BaseSound {
    return this.songs[Math.floor(Math.random() * this.songs.length)];
  }

  constructor(
    private scene: Phaser.Scene,
    x: number,
    y: number,
    private keys: Phaser.Types.Input.Keyboard.CursorKeys,
    private isDay: boolean
  ) {
    super();
    this.playerVelocity = this.getBaseVelocity();

    if (!this.isDay) {
      this.light = this.scene.lights.addLight(x, y, 160, 0xffffff, 1);
    }

    this.sprite = this.scene.add
      .sprite(x, y, 'master', 'Andrzej-Drunk-Down-0.png')
      .setScale(4)
      .setPipeline('Light2D');

    this.sprite.play(this.getDirectionAnimation('down'));

    this.sprite.setOrigin(0.5);

    scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      this.pointer = pointer;
    });

    this.scene.physics.world.enable(this.sprite);
    this.body = this.sprite.body as Phaser.Physics.Arcade.Body;
    this.body.setSize(this.sprite.width, this.sprite.height / 2);
    this.body.setOffset(0, this.sprite.height / 2);
    this.body.setCollideWorldBounds(false);

    const cursorKeys = scene.input.keyboard.createCursorKeys();
    this.startSinging();

    this.scene.input.keyboard.on('keydown-SPACE', () => {
      this.emit('request-talk');
    });

    this.scene.time.addEvent({
      delay: 40,
      loop: true,
      callback: () => {
        if (this.pee < 0) {
          this.emit('no-pee-left');
          return;
        }
        if (cursorKeys.space?.isDown || this.pointer?.isDown) {
          this.pee--;

          this.emit(
            'request-piss',
            this.rotation,
            new Phaser.Math.Vector2(
              this.sprite.x,
              this.sprite.y + this.sprite.displayHeight * 0.15
            ),
            this.body.velocity,
            this.getDirection() === 'up'
          );
        }
      },
    });
  }

  private getBaseVelocity = () => {
    return this.isDay ? DAY_BASE_PLAYER_VELOCITY : BASE_PLAYER_VELOCITY;
  };

  private getDirection = (): Direction => {
    const normalRotation = Phaser.Math.Angle.Normalize(this.rotation);

    if (normalRotation > Math.PI * 1.75 || normalRotation < Math.PI / 4) {
      return 'right';
    }

    if (normalRotation >= Math.PI / 4 && normalRotation < (Math.PI * 3) / 4) {
      return 'down';
    }

    if (
      normalRotation >= (Math.PI * 3) / 4 &&
      normalRotation < Math.PI * 1.25
    ) {
      return 'left';
    }

    if (normalRotation >= Math.PI * 1.25 && normalRotation <= 2 * Math.PI) {
      return 'up';
    }

    return 'up';
  };

  private getDirectionAnimation = (direction: Direction) => {
    if (this.isDay) {
      if (direction === 'right') {
        return 'Andrzej-Right';
      }
      if (direction === 'down') {
        return 'Andrzej-Down';
      }
      if (direction === 'left') {
        return 'Andrzej-Left';
      }
      if (direction === 'up') {
        return 'Andrzej-Up';
      }
    }

    if (direction === 'right') {
      return 'Andrzej-Drunk-Right';
    }
    if (direction === 'down') {
      return 'Andrzej-Drunk-Down';
    }
    if (direction === 'left') {
      return 'Andrzej-Drunk-Left';
    }
    if (direction === 'up') {
      return 'Andrzej-Drunk-Up';
    }

    return 'Andrzej-Drunk-Up';
  };

  // MARK: Singing logic

  /// sings a second every given interval, waits additional 3-6 seconds before each song
  startSinging = () => {
    this.songNames.forEach((song) => {
      this.songs.push(
        this.scene.sound.add(song, {
          volume: 0.3,
        })
      );
    });
    this.sing(this.randomSong);
  };

  finishSinging = () => {
    this.songs.forEach(this.scene.sound.remove);
  };

  sing = (song: Phaser.Sound.BaseSound) => {
    this.scene.time.addEvent({
      delay: Phaser.Math.Between(5000, 20000),
      callback: () => {
        song.on('complete', () => {
          this.sing(this.randomSong);
        });
        song.play();
      },
    });
  };

  update(delta: number) {
    let velocity = new Phaser.Math.Vector2(0, 0);

    if (this.keys.up?.isDown) {
      velocity.subtract(new Phaser.Math.Vector2(0, this.playerVelocity * 1.5));
    }

    if (this.keys.down?.isDown) {
      velocity.add(new Phaser.Math.Vector2(0, this.playerVelocity * 1.5));
    }

    if (this.keys.left?.isDown) {
      velocity.subtract(new Phaser.Math.Vector2(this.playerVelocity, 0));
    }

    if (this.keys.right?.isDown) {
      velocity.add(new Phaser.Math.Vector2(this.playerVelocity, 0));
    }

    if (velocity.x !== 0 && velocity.y !== 0) {
      velocity = velocity.normalize().scale(this.playerVelocity);
    }

    this.body.setVelocity(velocity.x, velocity.y);

    this.light?.setPosition(this.sprite.x, this.sprite.y);

    if (this.pointer) {
      this.targetToMouseRotation = Phaser.Math.Angle.BetweenPoints(
        this.body,
        new Phaser.Math.Vector2(
          this.scene.input.mousePointer.x + this.scene.cameras.main.scrollX,
          this.scene.input.mousePointer.y + this.scene.cameras.main.scrollY
        )
      );

      this.rotation = this.targetToMouseRotation;
      // this.rotation = Phaser.Math.Angle.RotateTo(
      //   this.rotation,
      //   this.targetToMouseRotation,
      //   ROTATION_SPEED * 0.001 * delta
      // );

      const direction = this.getDirection();

      this.playAnimation(this.getDirectionAnimation(direction));
    }
  }

  private drinkAlcohol = (item: AlcoholInventoryItem) => {
    if (this.isShaking) {
      return;
    }

    // eslint-disable-next-line no-param-reassign
    item.count--;
    this.isShaking = true;
    this.scene.cameras.main.shake(
      750,
      0.02,
      true,
      (_: Phaser.Cameras.Scene2D.Camera, progress: number) => {
        this.isShaking = progress !== 1;
      }
    );

    this.scene.cameras.main.flash(500, 0x11, 0x11, 0x11, true);

    this.pee = Math.min(this.pee + item.pee, PEE_MAX_VALUE);
  };

  private drinkEnergyDrink = (item: EnergyInventoryItem) => {
    // eslint-disable-next-line no-param-reassign
    item.count--;
    this.playerVelocity *= item.multiplier;
    this.pee = Math.min(this.pee + item.pee, PEE_MAX_VALUE);

    const timeLeft = this.energeticTimeEvent
      ? this.energeticTimeEvent.delay - this.energeticTimeEvent.elapsed
      : 0;

    this.energeticTimeEvent?.destroy();
    this.energeticTimeEvent = this.scene.time.addEvent({
      delay: timeLeft + item.duration,
      loop: true,
      callback: () => {
        this.playerVelocity = this.getBaseVelocity();
      },
    });
  };

  public drink = (item: InventoryItem) => {
    // eslint-disable-next-line no-param-reassign
    if (item.type === 'alcohol') {
      this.drinkAlcohol(item);
      console.log('dźwięk drink vodka');
      return;
    }

    if (item.type === 'energy') {
      this.drinkEnergyDrink(item);
      console.log('dźwięk drink energy drink');
    }
  };

  private playAnimation = (key: string) => {
    this.sprite.play(
      key,
      true,
      (this.sprite.anims.currentFrame.nextFrame.index + 1) % 2
    );
  };
}
