import { EventEmitter } from 'packages/utils';
import { levels } from './levels';

export class EnemiesSpawnController extends EventEmitter<
  'request-emit' | 'end-of-levels',
  {
    'request-emit': (position: Phaser.Math.Vector2) => void;
    'end-of-levels': () => void;
  }
> {
  private level = 0;

  constructor(private scene: Phaser.Scene) {
    super();
    this.onRoundStart();
  }

  private onRoundStart() {
    this.spawnEnemies();
  }

  onRoundEnd() {
    if (++this.level > levels.length - 1) {
      this.emit('end-of-levels');
    } else {
      this.spawnEnemies();
    }
  }

  private spawnEnemies() {
    levels[this.level].forEach(({ time, position }) => {
      this.scene.time.addEvent({
        delay: time,
        callback: () => {
          this.emit('request-emit', position);
        },
      });
    });
  }
}
