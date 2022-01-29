import { Player } from './Player';

const ENEMY_VELOCITY = 50;
const ROTATION_SPEED = Math.PI * 0.3;

export class Enemy {
  private sprite: Phaser.GameObjects.Sprite;

  private body: Phaser.Physics.Arcade.Body;

  private rotation: number = 0

  constructor(private scene: Phaser.Scene) {
    this.sprite = this.scene.add.sprite(
      100 / 2,
      720 / 2,
      'master',
      'Straznik-FHV.png'
    ).setScale(3)

    this.sprite.setOrigin(0.2);

    this.scene.physics.world.enable(this.sprite);
    this.body = this.sprite.body as Phaser.Physics.Arcade.Body;
  }

  update(delta: number, player: Player) {
    const targetRotation = Phaser.Math.Angle.BetweenPoints(
      this.body,
      player.body
    );

    this.rotation = Phaser.Math.Angle.RotateTo(
      this.rotation,
      targetRotation,
      ROTATION_SPEED * 0.001 * delta
    );

    const { x, y } = new Phaser.Math.Vector2(ENEMY_VELOCITY, 0).rotate(
      this.rotation
    );
    this.body.setVelocity(x, y);

    const normalRotation = Phaser.Math.Angle.Normalize(this.rotation)
      this.sprite.setFlipX(!(normalRotation > Math.PI / 2 && normalRotation < Math.PI * 1.75))
  }
}
