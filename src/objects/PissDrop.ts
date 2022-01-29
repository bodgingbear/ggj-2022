const PISS_VELOCITY = 180;

export class PissDrop {
  public sprite: Phaser.GameObjects.Sprite;

  private body: Phaser.Physics.Arcade.Body;

  constructor(
    private scene: Phaser.Scene,
    rotation: number,
    originPos: Phaser.Math.Vector2,
    private emitterManager: Phaser.GameObjects.Particles.ParticleEmitterManager
  ) {
    this.sprite = this.scene.add
      .sprite(originPos.x, originPos.y, 'master', 'piss-drop.png')
      .setScale(4)
      .setRotation(rotation)
      .setPipeline('Light2D');

    this.sprite.setData('ref', this);

    this.scene.physics.world.enable(this.sprite);

    this.body = this.sprite.body as Phaser.Physics.Arcade.Body;

    const { x, y } = new Phaser.Math.Vector2(PISS_VELOCITY, 0).rotate(rotation);
    this.body.setVelocity(x, y);

    this.scene.time.addEvent({
      delay: 1100,
      callback: () => {
        this.body.destroy();
        this.sprite.destroy();

        const path = new Phaser.Geom.Circle(0, 0, 10);

        const lifespan = 400;

        const emitter = this.emitterManager
          .createEmitter({
            x: this.body.position.x,
            y: this.body.position.y,
            lifespan,
            quantity: 1,
            scale: 2,
            alpha: { start: 1, end: 0 },
            blendMode: 'ADD',
            emitZone: { type: 'random', source: path },
          })
          .start();

        this.scene.time.addEvent({
          delay: lifespan,
          callback: () => {
            emitter.killAll();
            emitter.stop();
          },
        });
      },
    });
  }
}
