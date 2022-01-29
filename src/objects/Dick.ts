import { PissDrop } from './PissDrop';

export class Dick {
  private pissDropDeathEmitterManager: Phaser.GameObjects.Particles.ParticleEmitterManager;

  constructor(
    private scene: Phaser.Scene,
    private pissDrops: Phaser.GameObjects.Group
  ) {
    this.pissDropDeathEmitterManager = scene.add
      .particles('master', 'piss-drop.png')
      .setPipeline('Light2D');
  }

  pee = (rotation: number) => {
    this.pissDrops.add(
      new PissDrop(
        this.scene,
        rotation,
        this.body.position.add(
          new Phaser.Math.Vector2(
            this.sprite.displayWidth / 2,
            this.sprite.displayHeight * 0.7
          )
        ),
        pissDropDeathEmitterManager
      ).sprite.setDepth(
        this.sprite.frame.name === 'Andrzej-Drunk-Up.png'
          ? this.sprite.depth - 0.1
          : this.sprite.depth + 0.1
      )
    );
  };
}
