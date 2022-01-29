import { Player } from './Player';

export class Alcohol {
  constructor(
    private readonly scene: Phaser.Scene,
    x: number,
    y: number,
    player: Player,
    onCollect?: (alcohol: Alcohol) => void
  ) {
    const alcohol = this.scene.add.rectangle(
      x,
      y,
      50,
      50,
      0xffffff * Math.random()
    );

    console.log(x, y);

    const onCollide = () => {
      onCollect?.(this);
      alcohol.destroy();
      player.addPiss(10);
    };

    this.scene.physics.world.enable(alcohol);
    this.scene.physics.add.overlap(alcohol, player.sprite, onCollide);
  }
}
