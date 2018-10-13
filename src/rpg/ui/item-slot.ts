import UIEntity from "../../engine/pixi/ui-entity";
import Vector from "../../engine/core/vector";
import { Graphics } from "pixi.js";

const BORDER = 1;
const MARGIN = 1;
const SIZE = new Vector(16, 16);

export default class ItemSlot extends UIEntity {

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
  }
}
