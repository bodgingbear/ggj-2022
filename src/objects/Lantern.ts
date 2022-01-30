export class Lantern {
  sprite: Phaser.GameObjects.Sprite;

  constructor(
    private scene: Phaser.Scene,
    x: number,
    y: number,
    double = false,
    litUp = true
  ) {
    this.sprite = this.scene.add
      .sprite(x, y, 'master', double ? 'latarnia2.png' : 'latarnia1.png')
      .setScale(4)
      .setPipeline('Light2D')
      .setOrigin(0.5)
      .setFlipX(true);

    if (litUp) this.scene.lights.addLight(x, y, 250, 0xffe692, 0.8);

    // dodać miganie i przy każdym mignięciu dać dźwięk "lights"
  }
}
