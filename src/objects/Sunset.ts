import { START_TIME_IN_SECONDS } from './DayTimer';

export class Sunset {
  sprite: Phaser.GameObjects.Sprite;

  sunSunset: Phaser.GameObjects.Sprite;

  sun: Phaser.GameObjects.Sprite;

  constructor(private readonly scene: Phaser.Scene) {
    this.sprite = this.scene.add
      .sprite(0, 0, 'master', 'sunset-sky.png')
      .setOrigin(0, 0)
      .setScale(4);

    this.sun = this.scene.add.sprite(0, 550, 'master', 'sun.png').setScale(4);

    this.sunSunset = this.scene.add
      .sprite(0, 550, 'master', 'sunset-sun.png')
      .setScale(4);

    const animationDuration = 15000;
    const { width: DISPLAY_WIDTH } = this.scene.cameras.main;
    this.scene.tweens.add({
      targets: [this.sun, this.sunSunset],
      x: { from: 0, to: DISPLAY_WIDTH },
      duration: START_TIME_IN_SECONDS * 1000,
      ease: Phaser.Math.Easing.Sine.InOut,
    });
    this.scene.tweens.add({
      targets: [this.sun, this.sunSunset],
      scale: { from: 4, to: 2.5 },
      duration: (START_TIME_IN_SECONDS / 2) * 1000,
      ease: Phaser.Math.Easing.Sine.InOut,
    });
    this.scene.tweens.add({
      targets: [this.sun, this.sunSunset],
      scale: { to: 4, from: 2.5 },
      duration: (START_TIME_IN_SECONDS / 2) * 1000,
      delay: (START_TIME_IN_SECONDS / 2) * 1000,
      ease: Phaser.Math.Easing.Sine.InOut,
    });

    this.scene.tweens.add({
      targets: [this.sun, this.sunSunset],
      y: { from: 550, to: 150 },
      ease: Phaser.Math.Easing.Quadratic.InOut,
      duration: animationDuration,
    });
    this.scene.tweens.add({
      targets: [this.sprite, this.sunSunset],
      alpha: 0,
      duration: animationDuration,
    });

    this.scene.tweens.add({
      targets: [this.sun, this.sunSunset],
      y: { from: 150, to: 550 },
      ease: Phaser.Math.Easing.Quadratic.InOut,
      duration: animationDuration,
      delay: START_TIME_IN_SECONDS * 1000 - animationDuration,
    });
    this.scene.tweens.add({
      targets: [this.sprite, this.sunSunset],
      alpha: 1,
      duration: animationDuration,
      delay: START_TIME_IN_SECONDS * 1000 - animationDuration,
    });

    this.scene.tweens.addCounter({
      duration: animationDuration,
      ease: Phaser.Math.Easing.Quadratic.InOut,
      from: 0,
      to: 1,
      onUpdate: (value) => {
        const { r, g, b } = Phaser.Display.Color.Interpolate.ColorWithColor(
          new Phaser.Display.Color(0xdf, 0x6d, 0x35),
          new Phaser.Display.Color(0xff, 0xff, 0xff),
          1,
          value.getValue()
        );

        // eslint-disable-next-line no-bitwise
        this.scene.lights.setAmbientColor((1 << 24) + (r << 16) + (g << 8) + b);
      },
    });

    this.scene.tweens.addCounter({
      duration: animationDuration,
      delay: START_TIME_IN_SECONDS * 1000 - animationDuration,
      ease: Phaser.Math.Easing.Quadratic.InOut,
      from: 1,
      to: 0,
      onUpdate: (value) => {
        const { r, g, b } = Phaser.Display.Color.Interpolate.ColorWithColor(
          new Phaser.Display.Color(0x22, 0x00, 0x00),
          new Phaser.Display.Color(0xff, 0xff, 0xff),
          1,
          value.getValue()
        );

        // eslint-disable-next-line no-bitwise
        this.scene.lights.setAmbientColor((1 << 24) + (r << 16) + (g << 8) + b);
      },
    });
  }
}
