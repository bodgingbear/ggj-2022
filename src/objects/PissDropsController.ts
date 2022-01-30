export class PissDropsController {
  constructor(
    private scene: Phaser.Scene,
    private pissDrops: Phaser.GameObjects.Group,
    private enemies: Phaser.GameObjects.Group
  ) {
    this.scene.physics.add.collider(
      this.enemies,
      this.pissDrops,
      (enemyObj, pissObj) => {
        enemyObj.getData('ref').onHit(pissObj, {});
      }
    );
  }
}
