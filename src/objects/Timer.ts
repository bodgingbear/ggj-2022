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
export class Timer {
  text: Phaser.GameObjects.Text;

  constructor(private readonly scene: Phaser.Scene, private startedAt: number) {
    this.text = this.scene.add.text(1280 - 24, 64, '0');
    this.text.setOrigin(1, 0.5);
  }

  update = () => {
    const delta = this.scene.time.now - this.startedAt;

    this.text.setText(formatTime(delta));
  };
}
