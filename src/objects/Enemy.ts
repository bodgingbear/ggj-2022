import { EventEmitter } from 'packages/utils';
import { Sound } from 'Sound';
import { Player } from './Player';

const ENEMY_VELOCITY = 50;
const ENEMY_SPIERDALING_VELOCITY = 150;
const ROTATION_SPEED = Math.PI * 0.3;

function getRandomEnemyAnimation() {
  const textures = ['Straznik-FHV', 'Straznik-MHV', 'Straznik-M', 'Straznik-F'];

  return textures[Math.floor(Math.random() * textures.length)];
}

export class Enemy extends EventEmitter<'destroy'> {
  public sprite: Phaser.GameObjects.Sprite;

  private body: Phaser.Physics.Arcade.Body;

  private rotation: number = 0;

  private spierdalingTarget: Phaser.Math.Vector2 | null = null;

  private isDisgusted: boolean = false;

  private shouldPee: boolean = true;

  constructor(private scene: Phaser.Scene, position: Phaser.Math.Vector2) {
    super();
    this.sprite = this.scene.add
      .sprite(position.x, position.y, 'master', 'Straznik-FHV-0.png')
      .setScale(4)
      .setPipeline('Light2D')
      .play(getRandomEnemyAnimation());

    this.sprite.setOrigin(0.2);

    this.scene.physics.world.enable(this.sprite);
    this.body = this.sprite.body as Phaser.Physics.Arcade.Body;
    this.body.setSize(this.sprite.width, (this.sprite.height * 2) / 3);
    this.body.setOffset(0, this.sprite.height / 3);
    this.sprite.setData('ref', this);
    this.body.setImmovable(true);
  }

  public onHit(hitPos: Phaser.Math.Vector2) {
    const spierdalingAngle = Phaser.Math.Angle.Normalize(
      Phaser.Math.Angle.BetweenPoints(this.body.position, hitPos) + Math.PI
    );

    const camCoords = this.scene.cameras.main.worldView;

    if (
      spierdalingAngle >= Math.PI * 1.25 &&
      spierdalingAngle < Math.PI * 1.75
    ) {
      this.spierdalingTarget = new Phaser.Math.Vector2(
        this.body.x,
        camCoords.top
      );
    } else if (
      spierdalingAngle >= Math.PI * 1.75 ||
      spierdalingAngle < Math.PI * 0.25
    ) {
      this.spierdalingTarget = new Phaser.Math.Vector2(
        camCoords.right,
        this.body.y
      );
    } else if (
      spierdalingAngle >= Math.PI * 0.25 &&
      spierdalingAngle < Math.PI * 0.75
    ) {
      this.spierdalingTarget = new Phaser.Math.Vector2(
        this.body.x,
        camCoords.bottom
      );
    } else if (
      spierdalingAngle >= Math.PI * 0.75 &&
      spierdalingAngle < Math.PI * 1.25
    ) {
      this.spierdalingTarget = new Phaser.Math.Vector2(
        camCoords.left,
        this.body.y
      );
    }

    const siki = [Sound.peeHitSound1, Sound.peeHitSound2];
    const okrzykiLasek = [Sound.womanHit1, Sound.womanHit2];
    const okrzykiFacetow = [Sound.manHit1, Sound.manHit2];

    if (this.shouldPee) {
      this.scene.sound
        .add(siki[Math.floor(Math.random() * siki.length)])
        .play();

      this.shouldPee = false;

      this.scene.time.addEvent({
        delay: 400,
        callback: () => {
          this.shouldPee = true;
        },
      });
    }

    const isMan = this.sprite.anims.currentAnim.key.includes('M');

    const disgustedMiejskie = isMan ? okrzykiFacetow : okrzykiLasek;

    // TODO: wyważyć volume
    if (!this.isDisgusted) {
      this.isDisgusted = true;
      this.scene.time.addEvent({
        delay: 100,
        callback: () => {
          this.isDisgusted = true;
          this.scene.sound
            .add(
              disgustedMiejskie[
                Math.floor(Math.random() * okrzykiFacetow.length)
              ]
            )
            .play();
        },
      });
    }
  }

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
