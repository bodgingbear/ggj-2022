import { Enemy } from 'objects/Enemy';
import { Player } from 'objects/Player';

export class GameScene extends Phaser.Scene {
  private player?: Player;

  private enemy?: Enemy;

  public constructor() {
    super({
      key: 'GameScene',
    });
  }

  public create(): void {
    this.add.text(50, 50, 'Here is the game', {
      fontSize: '12px',
      fill: '#fff',
      align: 'center',
      lineSpacing: 10,
    });

    const keys = this.input.keyboard.addKeys({up:Phaser.Input.Keyboard.KeyCodes.W,
      down:Phaser.Input.Keyboard.KeyCodes.S,
      left:Phaser.Input.Keyboard.KeyCodes.A,
      right:Phaser.Input.Keyboard.KeyCodes.D});

    this.player = new Player(this, keys);
    this.enemy = new Enemy(this);
  }

  update(_time: number, delta: number) {
    this.player?.update(delta);
    this.enemy?.update(delta, this.player!);
  }
}
