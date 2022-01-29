import { Player } from 'objects/Player';

export class GameScene extends Phaser.Scene {
  private player?: Player;

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

    const keys = this.input.keyboard.createCursorKeys();

    this.player = new Player(this, keys);
  }

  update(_time: number, delta: number) {
    this.player?.update(delta);
  }
}
