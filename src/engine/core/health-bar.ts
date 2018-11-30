import { Graphics } from "pixi.js";
import HPVector from "../physics/vector";

const SIZE = new HPVector(36, 6);

export default class HPHealthBar {

  sprite = new Graphics();

  constructor() {
    this.paint();
  }

  set position(position: HPVector) {
    this.sprite.x = position.x;
    this.sprite.y = position.y;
  }

  set percent(percent: number) {
    this.paint(percent);
  }

  paint(percent = 1) {
    this.sprite.clear();

    this.sprite.beginFill(0xFF0000);
    this.sprite.drawRect(SIZE.x / -2,  SIZE.y / -2, SIZE.x, SIZE.y);
    this.sprite.endFill();

    this.sprite.beginFill(0x00FF00);
    this.sprite.drawRect(SIZE.x / -2,  SIZE.y / -2, SIZE.x * percent, SIZE.y);
    this.sprite.endFill();

    this.sprite.lineStyle(1, 0x000000);
    this.sprite.drawRect(SIZE.x / -2,  SIZE.y / -2, SIZE.x, SIZE.y);
    this.sprite.endFill();
  }

}
