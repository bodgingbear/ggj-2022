export type PasserScheduled = {
  position: Phaser.Math.Vector2;
  direction: 'up' | 'down' | 'left' | 'right';
};

export const passersScheduled: PasserScheduled[] = [
  { position: new Phaser.Math.Vector2(1100, 550), direction: 'down' },
  { position: new Phaser.Math.Vector2(100, 1000), direction: 'right' },
  { position: new Phaser.Math.Vector2(1300, 1300), direction: 'up' },
  {
    position: new Phaser.Math.Vector2(100, 600),
    direction: 'right',
  },
];
