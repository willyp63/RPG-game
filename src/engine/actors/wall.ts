import HPActor from "../core/actor";
import HPVector from "../physics/vector";
import { Graphics } from "pixi.js";

export default class HPWall extends HPActor {

  static get type() { return 'Wall'; }

  get sprite() { return this._sprite; }
  get size() { return this._size; }
  get isWall() { return true; }

  private _sprite: Graphics;

  constructor(
    position: HPVector,
    private _size: HPVector,
  ) {
    // when creating a wall you specify the upper-left point, not the center
    super(position.plus(_size.times(0.5)));

    // paint a red box
    this._sprite = new Graphics();
    this._sprite.beginFill(0xFF0000);
    this._sprite.drawRect(_size.x / -2, _size.y / -2, _size.x, _size.y);
    this._sprite.endFill();
  }
}
