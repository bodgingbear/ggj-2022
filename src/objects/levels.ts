type Level = {
  time: number;
  position: Phaser.Math.Vector2;
}[];

const level1: Level = [
  { time: 1500, position: new Phaser.Math.Vector2(0, 500) },
  { time: 3000, position: new Phaser.Math.Vector2(0, 1000) },
  { time: 3500, position: new Phaser.Math.Vector2(1600, 500) },
];

const level2: Level = [
  { time: 1500, position: new Phaser.Math.Vector2(0, 400) },
  { time: 3500, position: new Phaser.Math.Vector2(0, 1200) },
  { time: 4500, position: new Phaser.Math.Vector2(1800, 400) },
];

const level3: Level = [
  { time: 1500, position: new Phaser.Math.Vector2(0, 600) },
  { time: 1500, position: new Phaser.Math.Vector2(0, 1000) },
  { time: 1500, position: new Phaser.Math.Vector2(1600, 500) },
  { time: 5500, position: new Phaser.Math.Vector2(0, 400) },
  { time: 6500, position: new Phaser.Math.Vector2(0, 1200) },
  { time: 6500, position: new Phaser.Math.Vector2(1800, 400) },
];

export const levels = [level1, level2, level3];
