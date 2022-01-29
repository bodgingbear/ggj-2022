import { Alcohol } from './Alcohol';
import { Player } from './Player';

const SPAWN_INTERVAL = 1000;
const MAX_ALCOHOLS_COUNT = 3;

export class AlcoholSpawner {
  private alcohols: Alcohol[] = [];

  constructor(private scene: Phaser.Scene, private player: Player) {
    scene.time.addEvent({
      delay: SPAWN_INTERVAL,
      callback: this.spawnAlcohol,
      loop: true,
    });
  }

  private spawnAlcohol = () => {
    if (this.alcohols.length >= MAX_ALCOHOLS_COUNT) {
      return;
    }

    const { width, height } = this.scene.cameras.main.getBounds();
    const alcohol = new Alcohol(
      this.scene,
      (width - 200) * Math.random(),
      (height - 500) * Math.random() + 250,
      this.player,
      (thisAlcohol) => {
        this.alcohols = this.alcohols.filter((a) => a !== thisAlcohol);
      }
    );

    this.alcohols.push(alcohol);
  };
}
