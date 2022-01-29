type Level = {
  time: number;
  position: Phaser.Math.Vector2;
  type: 'ordinary' | 'priest' | 'boombox';
}[];

const level1: Level = [
  { time: 1500, position: new Phaser.Math.Vector2(0, 900), type: 'ordinary' },
  { time: 2000, position: new Phaser.Math.Vector2(800, 200), type: 'boombox' },
  { time: 2500, position: new Phaser.Math.Vector2(1600, 10), type: 'ordinary' },
];

// HAJS AFTER 1: 70

const level2: Level = [
  { time: 200, position: new Phaser.Math.Vector2(0, 400), type: 'ordinary' },
  { time: 500, position: new Phaser.Math.Vector2(0, 460), type: 'ordinary' },
  { time: 700, position: new Phaser.Math.Vector2(0, 520), type: 'ordinary' },
  { time: 800, position: new Phaser.Math.Vector2(0, 420), type: 'ordinary' },
  { time: 4500, position: new Phaser.Math.Vector2(0, 600), type: 'ordinary' },
  { time: 5000, position: new Phaser.Math.Vector2(0, 600), type: 'boombox' },
  { time: 5500, position: new Phaser.Math.Vector2(0, 600), type: 'ordinary' },
];

// HAJS AFTER 2: 110

const level3: Level = [
  { time: 1500, position: new Phaser.Math.Vector2(0, 500), type: 'ordinary' },
  { time: 2000, position: new Phaser.Math.Vector2(0, 500), type: 'boombox' },
  { time: 2500, position: new Phaser.Math.Vector2(0, 500), type: 'ordinary' },
  { time: 5000, position: new Phaser.Math.Vector2(0, 400), type: 'ordinary' },
  { time: 5000, position: new Phaser.Math.Vector2(0, 460), type: 'ordinary' },
  { time: 5000, position: new Phaser.Math.Vector2(0, 520), type: 'ordinary' },
  { time: 5000, position: new Phaser.Math.Vector2(0, 580), type: 'ordinary' },
  { time: 8500, position: new Phaser.Math.Vector2(0, 600), type: 'ordinary' },
  { time: 9000, position: new Phaser.Math.Vector2(0, 600), type: 'boombox' },
  { time: 9500, position: new Phaser.Math.Vector2(0, 600), type: 'ordinary' },
];

// HAJS AFTER 3: 190

const level4: Level = [
  // BOOMBOX SQUAD 1
  { time: 1500, position: new Phaser.Math.Vector2(0, 400), type: 'priest' },
  { time: 2000, position: new Phaser.Math.Vector2(0, 400), type: 'boombox' },
  { time: 2500, position: new Phaser.Math.Vector2(0, 400), type: 'ordinary' },
  // BOOMBOX SQUAD 2
  { time: 1800, position: new Phaser.Math.Vector2(0, 500), type: 'priest' },
  { time: 2300, position: new Phaser.Math.Vector2(0, 500), type: 'boombox' },
  { time: 2800, position: new Phaser.Math.Vector2(0, 500), type: 'ordinary' },
  // ORDINARY SQUAD 1
  { time: 5000, position: new Phaser.Math.Vector2(0, 400), type: 'ordinary' },
  { time: 5000, position: new Phaser.Math.Vector2(0, 460), type: 'ordinary' },
  { time: 5000, position: new Phaser.Math.Vector2(0, 520), type: 'ordinary' },
  { time: 5000, position: new Phaser.Math.Vector2(0, 580), type: 'ordinary' },
  // ORDINARY SQUAD 2
  { time: 6000, position: new Phaser.Math.Vector2(0, 410), type: 'ordinary' },
  { time: 6000, position: new Phaser.Math.Vector2(0, 420), type: 'ordinary' },
  { time: 6000, position: new Phaser.Math.Vector2(0, 490), type: 'ordinary' },
  { time: 6000, position: new Phaser.Math.Vector2(0, 550), type: 'ordinary' },
];

export const levels = [level1, level2, level3, level4];
