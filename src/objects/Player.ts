export class Player {
    private sprite: Phaser.GameObjects.Rectangle

    constructor(private scene: Phaser.Scene) {
        this.sprite = this.scene.add.rectangle(
             1280 / 2, 720 /2, 50, 50, 0xff00ff, 0.8)

        this.sprite.setOrigin(0.5)
    }
}