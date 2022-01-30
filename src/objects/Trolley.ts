import { Lidl } from './Lidl';
import { Player } from './Player';

const DESTINATION_X = 2022;
const DESTINATION_Y = 1024;

export class Trolley {
  sprite: Phaser.GameObjects.Sprite;

  body: Phaser.Physics.Arcade.Body;

  constructor(
    private readonly scene: Phaser.Scene,
    private player: Player,
    lidl: Lidl
  ) {
    this.sprite = this.scene.add
      .sprite(1300, 1100, 'master', 'wozek.png')
      .setScale(4)
      .setDepth(999999);

    this.scene.physics.world.enable(this.sprite);
    this.body = this.sprite.body as Phaser.Physics.Arcade.Body;
    this.scene.physics.add.collider(this.sprite, player.sprite);
    this.body.setCollideWorldBounds(true);

    this.scene.physics.add.overlap(
      this.sprite,
      lidl.trolleyCollider,
      this.onLidlCollide
    );
  }

  onLidlCollide = () => {
    this.body.destroy();
    this.player.inventory.addItem('Wódka');

    this.scene.tweens.add({
      targets: this.sprite,
      y: DESTINATION_Y,
      duration: 500,
      ease: Phaser.Math.Easing.Quadratic.Out,
      onComplete: () => {
        this.sprite.destroy();
      },
    });

    this.scene.tweens.add({
      targets: this.sprite,
      x: DESTINATION_X,
      duration: 750,
      alpha: 0,
      ease: Phaser.Math.Easing.Quadratic.Out,
      onComplete: () => {
        this.sprite.destroy();
      },
    });
  };

  update() {
    this.body.setAcceleration(
      -this.body.velocity.x * 1.2,
      -this.body.velocity.y * 2.5
    );
  }
}
