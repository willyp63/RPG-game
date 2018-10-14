import UIEntity from "../../engine/pixi/ui-entity";
import Vector from "../../engine/core/vector";
import { Graphics, ObservablePoint, Text } from "pixi.js";

export default class ItemSlot extends UIEntity {

  constructor(position: Vector, size: Vector) {
    super(
      () => {
        const screen = new Graphics();
        screen.beginFill(0x000000);
        screen.drawRect(0, 0, size.x, size.y);
        screen.endFill();

        const text = new Text('Loading area...', {fontFamily : 'Arial', fontSize: 12, fill : 0xFFFFFF, align : 'center'});
        text.anchor = <ObservablePoint>{ x: 0.5, y: 0.5 };
        text.x = size.x / 2;
        text.y = size.y / 2;
        screen.addChild(text);

        return screen;
      },
      position,
    );
  }
  
}
