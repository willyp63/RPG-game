import { Vector } from "../physics";
import { Sprite } from "pixi.js";

export default class UIElement {

  static assets: Array<string> = [];

  get sprite() { return this._sprite; }
  protected _sprite: Sprite;

  get position() { return this._position; }
  set position(position) {
    this._position = position;
    this._updatePIXISpritePosition();
  }
  private _position: Vector;

  get width() { return this._sprite.width; }
  get height() { return this._sprite.height; }

  constructor(
    sprite: Sprite | Function,
    position = new Vector(0, 0),
  ) {
    this._sprite = typeof sprite === 'function' ? sprite() : sprite;
    this._position = position;
    this._updatePIXISpritePosition();
  }

  _updatePIXISpritePosition() {
    this._sprite.x = this._position.x;
    this._sprite.y = this._position.y;
  }

}
