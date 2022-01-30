import { EventEmitter } from 'packages/utils';
import { InventoryItem } from './Inventory';

type EventTypes = 'end' | 'drink';
interface EventHandlers {
  end: () => void;
  drink: (item: InventoryItem) => void;
}
export class GameEmiter extends EventEmitter<EventTypes, EventHandlers> {}
