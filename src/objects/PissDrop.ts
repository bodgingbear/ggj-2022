const PISS_VELOCITY = 150

export class PissDrop {
    private sprite: Phaser.GameObjects.Rectangle
    private body: Phaser.Physics.Arcade.Body;
    
    constructor(
        private scene: Phaser.Scene,
        rotation: number,
        originPos: Phaser.Math.Vector2,
        private emitterManager: Phaser.GameObjects.Particles.ParticleEmitterManager) {
        this.sprite = this.scene.add.rectangle(
           originPos.x, originPos.y, 5, 5, 0xffff00, 0.8)

       this.sprite.setOrigin(0.5)

       this.sprite.setRotation(rotation)

       this.scene.physics.world.enable(this.sprite);

       this.body = this.sprite.body as Phaser.Physics.Arcade.Body;

       const {x, y} = new Phaser.Math.Vector2(PISS_VELOCITY, 0).rotate(rotation)
       this.body.setVelocity(x, y)


       this.scene.time.addEvent({
           delay: 1500,
           callback: () => {
               this.body.destroy()
               this.sprite.destroy()

               const path = new Phaser.Geom.Circle(0, 0, 10)

               const emitter = this.emitterManager.createEmitter({
                x: this.body.position.x, y: this.body.position.y,
                lifespan: 400,
                quantity: 1,
                scale: 0.4,
                alpha: { start: 1, end: 0 },
                blendMode: 'ADD',
                emitZone: { type: 'random', source: path }
            }).start()

            this.scene.time.addEvent({
                delay: 400,
                callback: () => {
                    emitter.killAll()
                    emitter.stop()
                }
            })
           }
       })
    }
}