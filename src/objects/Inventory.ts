type InventoryItemType = 'alcohol' | 'energy';

type InventoryNames = 'Wódka' | 'Red Bull';

export interface BaseInventoryItem {
  name: InventoryNames;
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
  pee: number;
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
      count: 2,
      key: '2',
      type: 'energy',
      multiplier: 2.5,
      pee: 2,
      duration: 2500,
    },
  ];

  public addItem = (
    searchedName: typeof this.items[number]['name'],
    addedCount = 1
  ) => {
    this.items = this.items.map(({ name, count, ...rest }) => ({
      name,
      count: name === searchedName ? count + addedCount : count,
      ...rest,
    }));
  };
}
