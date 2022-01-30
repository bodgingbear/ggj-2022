import { InventoryItem } from './Inventory';
import { InventoryElement } from './InventoryElement';

export class InventoryElementsList {
  elements: InventoryElement[] = [];

  constructor(
    private readonly scene: Phaser.Scene,
    items: InventoryItem[],
    drawKeys: boolean,
    onClick?: (item: InventoryItem) => void
  ) {
    let prevWidth = 0;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      const inventoryElement = new InventoryElement(
        this.scene,
        item,
        prevWidth + 32 + 32 * i,
        32,
        drawKeys,
        () => onClick?.(item)
      );

      prevWidth += inventoryElement.getWidth();

      this.elements.push(inventoryElement);
    }
  }
}
