import { Enemy } from './Enemy';
import { levels } from './levels';

export class EnemiesSpawnController {
  constructor(
    private scene: Phaser.Scene,
    private enemies: Phaser.GameObjects.Group
  ) {
    this.onRoundStart();
  }

  private onRoundStart() {
    this.spawnEnemies();
  }

  private spawnEnemies() {
    levels[0].forEach(({ time, position }) => {
      this.scene.time.addEvent({
        delay: time,
        callback: () => {
          const enemy = new Enemy(this.scene, position);
          this.enemies.add(enemy.sprite);
        },
      });
    });
  }
}
