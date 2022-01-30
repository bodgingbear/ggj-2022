import { PASSER_BY_VELOCITY } from 'constants';
import { EventEmitter } from 'packages/utils';
import { PasserScheduled } from './passersScheduled';

function getRandomPasserByTexture() {
  const textures = ['Ziomek-0.png', 'Ziomek-1.png'];

  return textures[Math.floor(Math.random() * textures.length)];
}

export class PasserBy extends EventEmitter<'toss-a-coin'> {
  sprite: Phaser.GameObjects.Sprite;

  private body: Phaser.Physics.Arcade.Body;

  talkingZone: Phaser.GameObjects.Rectangle;

  didGive = false;

  constructor(
    private scene: Phaser.Scene,
    x: number,
    y: number,
    direction: PasserScheduled['direction'],
    public isGenerous: boolean
  ) {
    super();

    this.sprite = scene.add
      .sprite(x, y, 'master', getRandomPasserByTexture())
      .setScale(4);

    this.scene.physics.world.enable(this.sprite);
    this.body = this.sprite.body as Phaser.Physics.Arcade.Body;
    this.body.setSize(this.sprite.width, (this.sprite.height * 1) / 3);
    this.body.setOffset(0, (this.sprite.height * 2) / 3);
    this.sprite.setData('ref', this);
    this.body.setImmovable(true);

    this.talkingZone = this.scene.add.rectangle(x, y, 200, 200, 0, 0);
    this.talkingZone.setData('ref', this);
    this.scene.physics.world.enable(this.talkingZone);
    this.scene.events.on('update', () => {
      this.talkingZone.setPosition(this.sprite.x, this.sprite.y);
    });

    if (direction === 'up') {
      this.body.setVelocityY(-PASSER_BY_VELOCITY);
      this.sprite.setFlipX(Math.random() > 0.5);
    } else if (direction === 'down') {
      this.body.setVelocityY(PASSER_BY_VELOCITY);
      this.sprite.setFlipX(Math.random() > 0.5);
    } else if (direction === 'left') {
      this.body.setVelocityX(-PASSER_BY_VELOCITY);
      this.sprite.setFlipX(false);
    } else if (direction === 'right') {
      this.body.setVelocityX(PASSER_BY_VELOCITY);
      this.sprite.setFlipX(true);
    }
  }
}
