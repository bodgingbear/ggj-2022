import { EventEmitter } from 'packages/utils';

export const START_TIME_IN_SECONDS = 10;

export const formatTime = (delta: number) => {
  const minutes = Math.floor(delta / 1000 / 60);
  const seconds = Math.floor(delta / 1000) - minutes * 60;
  const milliseconds = Math.floor(
    (delta - seconds * 1000 - minutes * 60 * 1000) / 100
  );

  const minutesString = String(minutes).padStart(2, '0');
  const secondsString = String(seconds).padStart(2, '0');
  const millisecondsString = String(milliseconds).padStart(1, '0');

  return `${minutesString}:${secondsString}.${millisecondsString}`;
};

export class DayTimer extends EventEmitter<'end'> {
  text: Phaser.GameObjects.Text;

  constructor(private readonly scene: Phaser.Scene, private startedAt: number) {
    super();
    this.text = this.scene.add.text(1280 - 24, 24, '0');
    this.text.setOrigin(1, 0);
  }

  update = () => {
    const endTime = this.startedAt + START_TIME_IN_SECONDS * 1000;
    const delta = endTime - Date.now();

    if (delta <= 0) {
      this.emit('end');
    }

    this.text.setText(formatTime(Math.max(0, delta)));
  };
}
