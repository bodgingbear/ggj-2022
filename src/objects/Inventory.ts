type InventoryItemType = 'alcohol' | 'energy';

export interface BaseInventoryItem {
  name: string;
  sprite: string;
  count: number;
  key: string;
  type: InventoryItemType;
}

export interface AlcoholInventoryItem extends BaseInventoryItem {
  type: 'alcohol';
  pee: number;
}

export interface EnergyInventoryItem extends BaseInventoryItem {
  type: 'energy';
  multiplier: number;
  duration: number;
}

export type InventoryItem = AlcoholInventoryItem | EnergyInventoryItem;

export class Inventory {
  items: InventoryItem[] = [
    {
      name: 'Wódka',
      sprite: 'alcohol.png',
      count: 3,
      key: '1',
      pee: 10,
      type: 'alcohol',
    },
    {
      name: 'Red Bull',
      sprite: 'red-bull.png',
      count: 0,
      key: '2',
      type: 'energy',
      multiplier: 2.5,
      duration: 2500,
    },
  ];
}
