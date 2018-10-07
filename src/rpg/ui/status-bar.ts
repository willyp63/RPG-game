import UIEntity from "../../engine/pixi/ui-entity";
import Vector from "../../engine/core/vector";
import { Graphics, Sprite, Text, ObservablePoint } from "pixi.js";

const BORDER_WIDTH = 2;
const MARGIN = 3;

export default class StatusBar extends UIEntity {

  private graphics = new Graphics();
  private text = new Text('', {fontFamily : 'Arial', fontSize: 8, fill : 0x000000, align : 'center'});

  constructor(
    position: Vector,
    private size: Vector,
    public maxValue: number,
    private fullColor: number,
    private emptyColor: number,
  ) {
    super(
      new Sprite(),
      position,
    );

    this.text.anchor = <ObservablePoint>{ x: 0.5, y: 0.5 };
    this.sprite.addChild(this.graphics);
    this.graphics.addChild(this.text);
    this.setValue(maxValue);
  }

  setValue(value: number) {
    const percent = value / this.maxValue;

    this.graphics.beginFill(0x000000);
    this.graphics.drawRect(this.size.x / -2 - BORDER_WIDTH + MARGIN, this.size.y / -2 - BORDER_WIDTH + MARGIN, this.size.x + BORDER_WIDTH * 2 - MARGIN * 2, this.size.y + BORDER_WIDTH * 2 - MARGIN * 2);
    this.graphics.endFill();

    this.graphics.beginFill(this.emptyColor);
    this.graphics.drawRect(this.size.x / -2 + MARGIN, this.size.y / -2 + MARGIN, this.size.x - MARGIN * 2, this.size.y - MARGIN * 2);
    this.graphics.endFill();

    this.graphics.beginFill(this.fullColor);
    this.graphics.drawRect(this.size.x / -2 + MARGIN, this.size.y / -2 + MARGIN, (this.size.x - MARGIN * 2) * percent, this.size.y - MARGIN * 2);
    this.graphics.endFill();

    this.text.text = `${value} / ${this.maxValue}`;
  }

}
