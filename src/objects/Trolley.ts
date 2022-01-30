import { EventEmitter } from 'packages/utils';
import { Lidl } from './Lidl';
import { Player } from './Player';

const DESTINATION_X = 2022;
const DESTINATION_Y = 1024;

export class Trolley extends EventEmitter<'collide'> {
  sprite: Phaser.GameObjects.Sprite;

  body: Phaser.Physics.Arcade.Body;

  constructor(
    private readonly scene: Phaser.Scene,
    x: number,
    y: number,
    private player: Player,
    lidl: Lidl
  ) {
    super();
    this.sprite = this.scene.add
      .sprite(x, y, 'master', 'wozek.png')
      .setScale(4);
    this.sprite.setData('ref', this);

    this.scene.physics.world.enable(this.sprite);
    this.body = this.sprite.body as Phaser.Physics.Arcade.Body;
    this.body.setCollideWorldBounds(true);
    this.body.setBounce(1.5, 1.5);

    this.scene.physics.add.overlap(
      this.sprite,
      lidl.trolleyCollider,
      this.onLidlCollide
    );
  }

  onLidlCollide = () => {
    this.emit('collide');
    this.body.destroy();
    this.player.inventory.addItem('Wódka');

    this.sprite.setDepth(99999999);

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
