export class Moon {
  constructor(private scene: Phaser.Scene, x: number, y: number) {
    this.scene.lights.addLight(x, y, 700, 0xfff6f2, 0.5);
    Array.from(Array(3)).map((_, i) => {
      this.scene.lights.addLight(i * 900, y - 220, 800, 0xfff6f2, 0.5);
    });
  }
}
