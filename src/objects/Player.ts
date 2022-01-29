
const ROTATION_SPEED = Math.PI * 0.5;

export class Player {
    private sprite: Phaser.GameObjects.Rectangle

    private targetToMouseRotation: number = 0;

    constructor(private scene: Phaser.Scene) {
        this.sprite = this.scene.add.rectangle(
             1280 / 2, 720 /2, 50, 50, 0xff00ff, 0.8)

        this.sprite.setOrigin(0.5)
        
        scene.input.on('pointermove', (pointer: any) => {
            this.targetToMouseRotation = Phaser.Math.Angle.BetweenPoints(this.sprite, pointer);
        });
    }


    update(delta: number) {
        this.sprite.setRotation(Phaser.Math.Angle.RotateTo(
            this.sprite.rotation,
            this.targetToMouseRotation,
            ROTATION_SPEED * 0.001 * delta
        ))
    }
}