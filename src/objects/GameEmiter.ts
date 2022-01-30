import { EventEmitter } from 'packages/utils';
import { InventoryItem } from './Inventory';

type EventTypes = 'end' | 'drink' | 'overlayEnd';
interface EventHandlers {
  end: () => void;
  drink: (item: InventoryItem) => void;
  overlayEnd: () => void;
}
export class GameEmiter extends EventEmitter<EventTypes, EventHandlers> {}
