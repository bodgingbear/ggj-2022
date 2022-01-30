import { loadAsset } from 'packages/utils';

export class BootScene extends Phaser.Scene {
  public constructor() {
    super({
      key: 'BootScene',
    });
  }

  public preload(): void {
    this.load.spritesheet('intro', loadAsset('images/intro.png'), {
      frameWidth: 78,
      frameHeight: 44,
    });

    this.load.image('piss', loadAsset('images/piss.png'));
    this.load.multiatlas('master', 'atlas/master.json', 'atlas');
  }

  public create(): void {
    this.anims.create({
      key: 'Andrzej-Drunk-Down',
      frames: [
        { key: 'master', frame: 'Andrzej-Drunk-Down-0.png' },
        { key: 'master', frame: 'Andrzej-Drunk-Down-1.png' },
      ],
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: 'Andrzej-Drunk-Left',
      frames: [
        { key: 'master', frame: 'Andrzej-Drunk-Left-0.png' },
        { key: 'master', frame: 'Andrzej-Drunk-Left-1.png' },
      ],
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: 'Andrzej-Drunk-Right',
      frames: [
        { key: 'master', frame: 'Andrzej-Drunk-Right-0.png' },
        { key: 'master', frame: 'Andrzej-Drunk-Right-1.png' },
      ],
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: 'Andrzej-Drunk-Up',
      frames: [
        { key: 'master', frame: 'Andrzej-Drunk-Up-0.png' },
        { key: 'master', frame: 'Andrzej-Drunk-Up-1.png' },
      ],
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: 'Andrzej-Drunk-Up',
      frames: [
        { key: 'master', frame: 'Andrzej-Drunk-Up-0.png' },
        { key: 'master', frame: 'Andrzej-Drunk-Up-1.png' },
      ],
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: 'Andrzej-Down',
      frames: [
        { key: 'master', frame: 'Andrzej-Down-0.png' },
        { key: 'master', frame: 'Andrzej-Down-1.png' },
      ],
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: 'Andrzej-Left',
      frames: [
        { key: 'master', frame: 'Andrzej-Left-0.png' },
        { key: 'master', frame: 'Andrzej-Left-1.png' },
      ],
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: 'Andrzej-Right',
      frames: [
        { key: 'master', frame: 'Andrzej-Right-0.png' },
        { key: 'master', frame: 'Andrzej-Right-1.png' },
      ],
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: 'Andrzej-Up',
      frames: [
        { key: 'master', frame: 'Andrzej-Up-0.png' },
        { key: 'master', frame: 'Andrzej-Up-1.png' },
      ],
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: 'Andrzej-Up',
      frames: [
        { key: 'master', frame: 'Andrzej-Up-0.png' },
        { key: 'master', frame: 'Andrzej-Up-1.png' },
      ],
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: 'Straznik-FHV',
      frames: [
        { key: 'master', frame: 'Straznik-FHV-0.png' },
        { key: 'master', frame: 'Straznik-FHV-1.png' },
      ],
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: 'Straznik-F',
      frames: [
        { key: 'master', frame: 'Straznik-F-0.png' },
        { key: 'master', frame: 'Straznik-F-1.png' },
      ],
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: 'Straznik-M',
      frames: [
        { key: 'master', frame: 'Straznik-M-0.png' },
        { key: 'master', frame: 'Straznik-M-1.png' },
      ],
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: 'Straznik-MHV',
      frames: [
        { key: 'master', frame: 'Straznik-MHV-0.png' },
        { key: 'master', frame: 'Straznik-MHV-1.png' },
      ],
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: 'intro-start',
      frames: this.anims.generateFrameNumbers('intro', {
        first: 0,
        start: 0,
        end: 9,
      }),
      frameRate: 9,
      repeat: 0,
    });

    this.anims.create({
      key: 'intro-loop',
      frames: this.anims.generateFrameNumbers('intro', {
        start: 10,
        end: -1,
      }),
      frameRate: 3,
      repeat: -1,
    });

    this.scene.start('LoadingScene');
  }
}
