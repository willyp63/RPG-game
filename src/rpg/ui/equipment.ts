import UIEntity from "../../engine/pixi/ui-entity";
import Vector from "../../engine/core/vector";
import { Graphics } from "pixi.js";
import ItemSlot from "./item-slot";

const BORDER = 2;
const MARGIN = 8;
const SIZE = new Vector(80, 80);

export default class Equipment extends UIEntity {

  static get size() { return SIZE; }

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

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (i === 0 && (j === 0 || j === 2) || i === 2 && (j === 0 || j === 2)) continue;
        const itemSlot = new ItemSlot(new Vector((i + 1) * ItemSlot.size.x, (j + 1) * ItemSlot.size.y));
        this.sprite.addChild(itemSlot.sprite);
      }
    }
  }

}
