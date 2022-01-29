import { Player } from './Player';

const ENEMY_VELOCITY = 50;
const ROTATION_SPEED = Math.PI * 0.3;

// TODO: jeśli mocz dotknie wroga to on zaczyna uciekać

export class Enemy {
  private sprite: Phaser.GameObjects.Rectangle;

  private body: Phaser.Physics.Arcade.Body;

  constructor(private scene: Phaser.Scene) {
    this.sprite = this.scene.add.rectangle(
      100 / 2,
      720 / 2,
      50,
      50,
      0x1c30d3,
      0.8
    );

    this.sprite.setOrigin(0.2);

    this.scene.physics.world.enable(this.sprite);
    this.body = this.sprite.body as Phaser.Physics.Arcade.Body;
  }

  update(delta: number, player: Player) {
    const targetRotation = Phaser.Math.Angle.BetweenPoints(
      this.body,
      player.body
    );

    this.sprite.rotation = Phaser.Math.Angle.RotateTo(
      this.sprite.rotation,
      targetRotation,
      ROTATION_SPEED * 0.001 * delta
    );

    const { x, y } = new Phaser.Math.Vector2(ENEMY_VELOCITY, 0).rotate(
      this.sprite.rotation
    );
    this.body.setVelocity(x, y);

    if (this.scene.physics.overlap(this.sprite, player.sprite)) {
      console.log('ee');
    }
  }
}
