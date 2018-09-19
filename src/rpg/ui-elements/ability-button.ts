import { UIElement } from "../../engine/stage";
import { Graphics, Text } from "pixi.js";
import KeyListener from "../../engine/interaction/key-listener";
import { Vector } from "../../engine/physics";

export default class AbilityButton extends UIElement {
  
  constructor(position: Vector, keyCode: number, buttonText: string, onClick: Function) {
    super(
      () => {
        const circle = new Graphics();
        circle.beginFill(0xFFFFFF);
        circle.drawCircle(20, 20, 20);
        circle.endFill();

        const text = new Text(buttonText);
        text.x = 13;
        text.y = 3;
        circle.addChild(text);
  
        return circle;
      },
      position,
    );

    this._sprite.interactive = true;
    this._sprite.on('pointerdown', onClick);
    new KeyListener(keyCode, onClick);
  }
}
