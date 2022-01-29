export class ClickableElement {
  sprite: Phaser.GameObjects.Sprite;

  enabled = true;

  visible = true;

  text: Phaser.GameObjects.Text;

  constructor(
    private readonly scene: Phaser.Scene,
    frame: string,
    key: string,
    x: number,
    y: number,
    onKeyDown: () => void
  ) {
    this.sprite = this.scene.add
      .sprite(x, y, 'master', frame)
      .setScale(4)
      .setOrigin(1, 0);

    this.text = this.scene.add
      .text(x, y + this.sprite.displayHeight + 8, key, {
        fontSize: '24px',
      })
      .setOrigin(1, 0);

    this.scene.input.keyboard.on(`keydown-${key}`, () => {
      if (this.enabled) {
        onKeyDown();
      }
    });

    this.setEnabled(this.enabled);
    this.setVisible(this.visible);
  }

  setEnabled = (enabled: boolean) => {
    this.enabled = enabled;
    const alpha = this.enabled ? 1 : 0;

    this.sprite.setAlpha(alpha);
    this.text.setAlpha(alpha);
  };

  setVisible = (visible: boolean) => {
    this.visible = visible;

    this.sprite.setVisible(this.visible);
    this.text.setVisible(this.visible);
  };
}
