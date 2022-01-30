import { Player } from './Player';

const LIDL_X = 3040 / 2;
const LIDL_Y = 1600 / 2;

export class Lidl {
  public sprite: Phaser.GameObjects.Sprite;

  private body: Phaser.Physics.Arcade.Body;

  public trolleyCollider: Phaser.GameObjects.Rectangle;

  text: Phaser.GameObjects.Text;

  constructor(private scene: Phaser.Scene, player: Player, litUp = true) {
    this.sprite = this.scene.add
      .sprite(LIDL_X, LIDL_Y, 'master', 'lidl.png')
      .setScale(4)
      .setPipeline('Light2D')
      .setDepth(1);

    this.text = this.scene.add.text(
      LIDL_X + 350,
      LIDL_Y + 120,
      'ZWROT KOSZYKÓW',
      {
        color: 'red',
      }
    );

    this.trolleyCollider = this.scene.add
      .rectangle(0, 0, 500, 150, 0x00ff00, 0)
      .setDepth(200000);

    this.sprite.setOrigin(0.2);

    this.trolleyCollider.setOrigin(0, 1);
    this.trolleyCollider.setPosition(
      LIDL_X + 300,
      this.sprite.getBottomCenter().y + 50
    );

    this.scene.physics.world.enable(this.trolleyCollider);

    // this.scene.physics.world.enable(this.sprite);
    // this.body = this.sprite.body as Phaser.Physics.Arcade.Body;
    // this.scene.physics.add.overlap(this.sprite, player.sprite);
    // this.body.setImmovable(true);

    if (litUp) {
      this.scene.lights.addLight(
        this.sprite.x + 80,
        this.sprite.y,
        300,
        0xfff6f2,
        0.5
      );

      this.scene.lights.addLight(
        this.sprite.x + 80,
        this.sprite.y,
        300,
        0x0000ff,
        0.5
      );

      this.scene.lights.addLight(
        this.sprite.x + 80,
        this.sprite.y + 200,
        300,
        0x0000ff,
        0.5
      );
    }
  }

  update = () => {
    this.text.setDepth(this.sprite.depth);
  };
}
