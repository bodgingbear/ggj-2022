export class Lantern {
  sprite: Phaser.GameObjects.Sprite;

  constructor(
    private scene: Phaser.Scene,
    x: number,
    y: number,
    double = false
  ) {
    this.sprite = this.scene.add
      .sprite(x, y, 'master', double ? 'latarnia2.png' : 'latarnia1.png')
      .setScale(4)
      .setOrigin(0.5)
      .setFlipX(true);

    this.scene.lights.addLight(x, y, 200, 0xffe692, 0.5);

    // dodać miganie i przy każdym mignięciu dać dźwięk "lights"
  }
}
