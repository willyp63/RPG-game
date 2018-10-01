import UIEntity from "../../engine/pixi/ui-entity";
import Vector from "../../engine/core/vector";
import { Graphics, Text } from "pixi.js";

const MARGIN = 8;
const BORDER = 4;
const PADDING = 4;

export default class MessageBox extends UIEntity {

  private _text = new Text('', {fontFamily : 'Arial', fontSize: 12, fill : 0x000000, align : 'left'});

  constructor(position: Vector, size: Vector) {
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

    this._text.x = MARGIN + BORDER + PADDING;
    this._text.y = MARGIN + BORDER + PADDING;
    this._sprite.addChild(this._text);

    this.hide();
  }

  showMessage(message: string) {
    this._text.text = message;
    this._sprite.alpha = 1;
  }

  hide() {
    this._sprite.alpha = 0;
  }

}
