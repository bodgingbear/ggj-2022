import { EventEmitter } from 'packages/utils';
import { Player } from './Player';

const ENEMY_VELOCITY = 50;
const ENEMY_SPIERDALING_VELOCITY = 150;
const ROTATION_SPEED = Math.PI * 0.3;

function getRandomEnemyTexture() {
  const textures = [
    'Straznik-FHV.png',
    'Straznik-MHV.png',
    'Straznik-M.png',
    'Straznik-F.png',
  ];

  return textures[Math.floor(Math.random() * textures.length)];
}

export class Enemy extends EventEmitter<'destroy'> {
  public sprite: Phaser.GameObjects.Sprite;

  private body: Phaser.Physics.Arcade.Body;

  private rotation: number = 0;

  private spierdalingTarget: Phaser.Math.Vector2 | null = null;

  constructor(private scene: Phaser.Scene, position: Phaser.Math.Vector2) {
    super();
    this.sprite = this.scene.add
      .sprite(position.x, position.y, 'master', getRandomEnemyTexture())
      .setScale(4)
      .setPipeline('Light2D');

    this.sprite.setOrigin(0.2);

    this.scene.physics.world.enable(this.sprite);
    this.body = this.sprite.body as Phaser.Physics.Arcade.Body;
    this.sprite.setData('ref', this);
    this.body.setImmovable(true);
  }

  public onHit() {
    const shouldKeepX = Math.random() > 0.5;

    if (shouldKeepX) {
      this.spierdalingTarget = new Phaser.Math.Vector2(
        this.body.x,
        this.getNearestEdgeY()
      );
    } else {
      this.spierdalingTarget = new Phaser.Math.Vector2(
        this.getNearestEdgeX(),
        this.body.y
      );
    }
  }

  private getNearestEdgeX = () => {
    if (this.body.x < 1280 / 2) {
      return 0 - 100;
    }

    return 1280 + 100;
  };

  private getNearestEdgeY = () => {
    if (this.body.y < 720 / 2) {
      return 0 - 100;
    }

    return 720 + 100;
  };

  private goToPoint = (
    target: Phaser.Types.Math.Vector2Like,
    delta: number
  ) => {
    const targetRotation = Phaser.Math.Angle.BetweenPoints(this.body, target);
    const isSpierdaling = this.spierdalingTarget !== null;

    if (isSpierdaling) {
      this.rotation = targetRotation;
    } else {
      this.rotation = Phaser.Math.Angle.RotateTo(
        this.rotation,
        targetRotation,
        ROTATION_SPEED * 0.001 * delta
      );
    }

    const { x, y } = new Phaser.Math.Vector2(
      isSpierdaling ? ENEMY_SPIERDALING_VELOCITY : ENEMY_VELOCITY,
      0
    ).rotate(this.rotation);
    this.body.setVelocity(x, y);

    const normalRotation = Phaser.Math.Angle.Normalize(this.rotation);
    this.sprite.setFlipX(
      !(normalRotation > Math.PI / 2 && normalRotation < Math.PI * 1.75)
    );
  };

  update(delta: number, player: Player) {
    if (this.spierdalingTarget !== null) {
      const distanceFromSpierdalingTarget = Phaser.Math.Distance.BetweenPoints(
        this.spierdalingTarget,
        this.body
      );

      if (distanceFromSpierdalingTarget < 50) {
        this.sprite.destroy();
        this.emit('destroy');
        return;
      }

      this.goToPoint(this.spierdalingTarget, delta);
      return;
    }

    this.goToPoint(player.body, delta);
  }
}
