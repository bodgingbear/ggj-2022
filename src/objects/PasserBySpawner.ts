import { EventEmitter } from 'packages/utils';
import { PasserScheduled, passersScheduled } from './passersScheduled';

export class PasserBySpawner extends EventEmitter<
  'request-emit',
  {
    'request-emit': (
      position: Phaser.Math.Vector2,
      direction: PasserScheduled['direction']
    ) => void;
  }
> {
  constructor(private scene: Phaser.Scene) {
    super();
    this.onRoundStart();
  }

  private onRoundStart() {
    this.spawnEnemies();
  }

  private spawnEnemies() {
    this.scene.time.addEvent({
      delay: 0,
      callback: () => this.requestRandomEnemies(false),
    });

    this.scene.time.addEvent({
      delay: 6000,
      repeat: -1,
      callback: () =>
        this.scene.time.addEvent({
          delay: Math.random() * 3,
          callback: () => this.requestRandomEnemies(),
        }),
    });
  }

  private requestRandomEnemies(randomize = true) {
    passersScheduled.forEach(({ position, direction }) => {
      if (randomize && Math.random() < 0.5) return;
      this.emit(
        'request-emit',
        position
          .clone()
          .add(
            new Phaser.Math.Vector2(
              -50 + Math.random() * 100,
              -50 + Math.random() * 100
            )
          ),
        direction
      );
    });
  }
}
