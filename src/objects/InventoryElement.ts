import { BaseInventoryItem } from './Inventory';

const keyMap: Record<string, string> = {
  '0': 'ZERO',
  '1': 'ONE',
  '2': 'TWO',
  '3': 'THREE',
  '4': 'FOUR',
  '5': 'FIVE',
  '6': 'SIX',
  '7': 'SEVEN',
  '8': 'EIGHT',
  '9': 'NINE',
};

export class InventoryElement {
  sprite: Phaser.GameObjects.Sprite;

  enabled = true;

  visible = true;

  text: Phaser.GameObjects.Text | null = null;

  countText!: Phaser.GameObjects.Text;

  constructor(
    private readonly scene: Phaser.Scene,
    inventoryItem: BaseInventoryItem,
    x: number,
    y: number,
    drawKeys: boolean,
    onKeyDown: () => void
  ) {
    this.sprite = this.scene.add
      .sprite(x, y, 'master', inventoryItem.sprite)
      .setScale(4)
      .setOrigin(0, 0);

    this.countText = this.scene.add
      .text(
        x + this.sprite.displayWidth + 16,
        y + this.sprite.displayHeight / 2,
        `x${inventoryItem.count}`,
        {
          fontSize: '24px',
          align: 'left',
        }
      )
      .setOrigin(0, 0.5);

    const topWidth = this.getWidth();

    if (drawKeys) {
      this.text = this.scene.add
        .text(
          x + topWidth / 2,
          y + this.sprite.displayHeight + 8,
          inventoryItem.key,
          {
            fontSize: '24px',
          }
        )
        .setOrigin(0.5, 0);
    }

    const keyboardKey = keyMap[inventoryItem.key] ?? inventoryItem.key;
    this.scene.input.keyboard.on(`keydown-${keyboardKey}`, () => {
      if (this.enabled) {
        onKeyDown();
      }
    });

    this.setEnabled(this.enabled);
    this.setVisible(this.visible);
  }

  getWidth = () => {
    return this.countText.getRightCenter().x - this.sprite.getLeftCenter().x;
  };

  setEnabled = (enabled: boolean) => {
    this.enabled = enabled;
    const alpha = this.enabled ? 1 : 0.5;

    this.sprite.setAlpha(alpha);
    this.text?.setAlpha(alpha);
    this.countText.setAlpha(alpha);
  };

  setVisible = (visible: boolean) => {
    this.visible = visible;

    this.sprite.setVisible(this.visible);
    this.text?.setVisible(this.visible);
    this.countText.setVisible(this.visible);
  };

  setCount = (count: number) => {
    this.countText.setText(`x${count}`);

    this.setEnabled(count > 0);
  };
}
