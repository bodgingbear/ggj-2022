import { PissDrop } from './PissDrop';

const ROTATION_SPEED = Math.PI * 0.2;
const PLAYER_VELOCITY = 150;

export class Player {
  private sprite: Phaser.GameObjects.Rectangle;

  private body: Phaser.Physics.Arcade.Body;

  private targetToMouseRotation: number = 0;

  private pointer: any;

  constructor(
    private scene: Phaser.Scene,
    private keys: Phaser.Types.Input.Keyboard.CursorKeys
  ) {
    this.sprite = this.scene.add.rectangle(
      1280 / 2,
      720 / 2,
      50,
      50,
      0xff00ff,
      0.8
    );

    this.sprite.setOrigin(0.5);

    scene.input.on('pointermove', (pointer: any) => {
      this.pointer = pointer;
    });
    this.scene.physics.world.enable(this.sprite);
    this.body = this.sprite.body as Phaser.Physics.Arcade.Body;

    const cursorKeys = scene.input.keyboard.createCursorKeys();

    const pissDropDeathEmitterManager = scene.add.particles('piss');

    this.scene.time.addEvent({
      delay: 40,
      loop: true,
      callback: () => {
        if (cursorKeys.space?.isDown)
          new PissDrop(
            this.scene,
            this.sprite.rotation,
            this.body.position.add(
              new Phaser.Math.Vector2(
                this.sprite.width / 2,
                this.sprite.height / 2
              )
            ),
            pissDropDeathEmitterManager
          );
      },
    });
  }

  update(delta: number) {
    let velocity = new Phaser.Math.Vector2(0, 0);

    if (this.keys.up?.isDown) {
      velocity.subtract(new Phaser.Math.Vector2(0, PLAYER_VELOCITY * 1.5));
    }

    if (this.keys.down?.isDown) {
      velocity.add(new Phaser.Math.Vector2(0, PLAYER_VELOCITY * 1.5));
    }

    if (this.keys.left?.isDown) {
      velocity.subtract(new Phaser.Math.Vector2(PLAYER_VELOCITY, 0));
    }

    if (this.keys.right?.isDown) {
      velocity.add(new Phaser.Math.Vector2(PLAYER_VELOCITY, 0));
    }

    if (velocity.x !== 0 && velocity.y !== 0) {
      velocity = velocity.normalize().scale(PLAYER_VELOCITY);
    }

    this.body.setVelocity(velocity.x, velocity.y);

    if (this.pointer) {
      this.targetToMouseRotation = Phaser.Math.Angle.BetweenPoints(
        this.sprite,
        this.pointer
      );

      this.sprite.setRotation(
        Phaser.Math.Angle.RotateTo(
          this.sprite.rotation,
          this.targetToMouseRotation,
          ROTATION_SPEED * 0.001 * delta
        )
      );
    }
  }
}
