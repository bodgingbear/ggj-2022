import { debugMap } from 'packages/utils/shouldSkipIntro';

import { EventEmitter } from 'packages/utils';
import { PissDrop } from './PissDrop';

import { PEE_DEFAULT_VALUE, PEE_MAX_VALUE } from '../constants';
import {
  Inventory,
  AlcoholInventoryItem,
  InventoryItem,
  EnergyInventoryItem,
} from './Inventory';

const BASE_PLAYER_VELOCITY = debugMap() ? 500 : 150;

export class Player extends EventEmitter<
  'request-piss' | 'no-pee-left',
  {
    'request-piss': (
      rotation: number,
      position: Phaser.Math.Vector2,
      velocity: Phaser.Math.Vector2,
      isUp: boolean
    ) => void;
    'no-pee-left': () => void;
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

  private playerVelocity = BASE_PLAYER_VELOCITY;

  constructor(
    private scene: Phaser.Scene,
    x: number,
    y: number,
    private keys: Phaser.Types.Input.Keyboard.CursorKeys
  ) {
    super();
    this.light = this.scene.lights.addLight(x, y, 160, 0xffffff, 0.2);

    this.sprite = this.scene.add
      .sprite(x, y, 'master', 'Andrzej-Drunk-Down-0.png')
      .setScale(4)
      .setPipeline('Light2D');

    this.sprite.play('Andrzej-Drunk-Down');

    this.sprite.setOrigin(0.5);

    scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      this.pointer = pointer;
    });

    this.scene.physics.world.enable(this.sprite);
    this.body = this.sprite.body as Phaser.Physics.Arcade.Body;
    this.body.setCollideWorldBounds(true);

    const cursorKeys = scene.input.keyboard.createCursorKeys();

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
            this.body.position.add(
              new Phaser.Math.Vector2(
                this.sprite.displayWidth / 2,
                this.sprite.displayHeight * 0.7
              )
            ),
            this.body.velocity,
            this.getDirection() === 'up'
          );
        }
      },
    });
  }

  private getDirection = (): 'up' | 'down' | 'left' | 'right' => {
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

  update() {
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

      // Phaser.Math.Angle.RotateTo(
      //   this.rotation,
      //   this.targetToMouseRotation,
      //   ROTATION_SPEED * 0.001 * delta
      // );

      const direction = this.getDirection();

      if (direction === 'right') {
        this.playAnimation('Andrzej-Drunk-Right');
      } else if (direction === 'down') {
        this.playAnimation('Andrzej-Drunk-Down');
      } else if (direction === 'left') {
        this.playAnimation('Andrzej-Drunk-Left');
      } else if (direction === 'up') {
        this.playAnimation('Andrzej-Drunk-Up');
      }
    }
  }

  private drinkAlcohol = (item: AlcoholInventoryItem) => {
    if (this.isShaking) {
      return;
    }

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
    this.playerVelocity *= item.multiplier;

    const timeLeft = this.energeticTimeEvent
      ? this.energeticTimeEvent.delay - this.energeticTimeEvent.elapsed
      : 0;

    this.energeticTimeEvent?.destroy();
    this.energeticTimeEvent = this.scene.time.addEvent({
      delay: timeLeft + item.duration,
      loop: true,
      callback: () => {
        this.playerVelocity = BASE_PLAYER_VELOCITY;
      },
    });
  };

  public drink = (item: InventoryItem) => {
    // eslint-disable-next-line no-param-reassign
    item.count--;

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
    if (key === this.sprite.anims.currentAnim.key) {
      return;
    }

    this.sprite.play(
      key,
      true,
      (this.sprite.anims.currentFrame.nextFrame.index + 1) % 2
    );
  };
}
