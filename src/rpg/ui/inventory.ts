import UIEntity from "../../engine/pixi/ui-entity";
import Vector from "../../engine/core/vector";
import { Graphics } from "pixi.js";
import ItemSlot from "./item-slot";
import InventoryItem from "./inventory-item";

const BORDER = 2;
const MARGIN = 8;
const SIZE = new Vector(128, 128);

export default class Inventory extends UIEntity {

  static get size() { return SIZE; }

  private items: Array<InventoryItem> = [];
  
  constructor(position: Vector) {
    super(
      () => {
        const box = new Graphics();

        box.beginFill(0xFFFFFF);
        box.lineStyle(BORDER, 0x000000);
        box.drawRect(MARGIN, MARGIN, SIZE.x - MARGIN * 2, SIZE.y - MARGIN * 2);
        box.endFill();

        return box;
      },
      position,
    );

    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        const itemSlot = new ItemSlot(new Vector((i + 1) * ItemSlot.size.x, (j + 1) * ItemSlot.size.y));
        this.sprite.addChild(itemSlot.sprite);
      }
    }
  }

  addItem(item: InventoryItem) {
    this.items.push(item);
    this.layoutItems();
  }

  removeItemWithId(id: string) {
    const index = this.items.findIndex(item => item.id === id);
    if (index < 0) return;

    this.items.splice(index, 1)[0];
    this.layoutItems();
  }

  private layoutItems() {
    let i = 0, j = 0;
    this.items.forEach(item => {
      item.position = new Vector((i + 1) * ItemSlot.size.x, (j + 1) * ItemSlot.size.y);
      item.position = item.position.plus(this.position);
      i++;
      if (i >= 6) {
        i = 0;
        j++;
      }
    });
  }

}
