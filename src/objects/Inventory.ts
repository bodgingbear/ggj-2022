export interface InventoryItem {
  name: string;
  sprite: string;
  count: number;
  key: string;
  pee: number;
}

export class Inventory {
  items: InventoryItem[] = [
    {
      name: 'Wódka',
      sprite: 'alcohol.png',
      count: 3,
      key: 'Q',
      pee: 10,
    },
  ];
}
