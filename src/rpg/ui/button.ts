import UIEntity from "../../engine/pixi/ui-entity";
import Vector from "../../engine/core/vector";
import { Graphics, Text, ObservablePoint } from "pixi.js";

const BORDER = 2;
const MARGIN = 8;

export default class Button extends UIEntity {

  private text = new Text('', {fontFamily : 'Arial', fontSize: 8, fill : 0x000000, align : 'center'});

  constructor(position: Vector, size: Vector, text: string) {
    super(
      () => {
        const box = new Graphics();

        box.beginFill(0xFFFFFF);
        box.lineStyle(BORDER, 0x000000);
        box.drawRect(MARGIN, MARGIN, size.x - MARGIN * 2, size.y - MARGIN * 2);
        box.endFill();

        return box;
      },
      position,
    );

    this.text.text = text;
    this.text.anchor = <ObservablePoint>{ x: 0.5, y: 0.5 };
    this.text.position.x = size.x / 2;
    this.text.position.y = size.y / 2;
    this.sprite.addChild(this.text);
  }

  onClick(callback: Function) {
    this.sprite.interactive = true;
    this.sprite.on('pointerdown', callback);
  }

}