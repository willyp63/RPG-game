import { Vector } from "../physics";
import { Sprite } from "pixi.js";

export default class UIElement {

  static assets: Array<string> = [];

  get sprite() { return this._sprite; }
  protected _sprite: Sprite;

  private _position: Vector;

  constructor(
    sprite,
    position = new Vector(0, 0),
  ) {
    this._sprite = typeof sprite === 'function' ? sprite() : sprite;
    this.position = position;
  }

  get position() { return this._position; }
  set position(position) {
    this._position = position;

    // keep pixi sprite updated
    this._sprite.x = this._position.x;
    this._sprite.y = this._position.y;
  }

  get width() { return this._sprite.width; }
  get height() { return this._sprite.height; }
}
