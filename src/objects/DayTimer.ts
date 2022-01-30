const START_TIME_IN_SECONDS = 45;

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

export class DayTimer {
  text: Phaser.GameObjects.Text;

  constructor(private readonly scene: Phaser.Scene) {
    this.text = this.scene.add.text(1280 - 24, 64, '0');
    this.text.setOrigin(1, 0.5);
  }

  update = () => {
    const endTime = START_TIME_IN_SECONDS * 1000;

    this.text.setText(formatTime(endTime - this.scene.time.now));
  };
}
