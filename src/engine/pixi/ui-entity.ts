import { Sprite } from "pixi.js";
import Vector from "../core/vector";

export default class UIEntity {

  get position() { return this._position; }

  get sprite() { return this._sprite; }
  get isFixed() { return true; }
  protected _sprite: Sprite;

  constructor(
    sprite: Sprite | Function,
    private _position: Vector,
  ) {
    this._sprite = typeof sprite === 'function' ? sprite() : sprite;
    this._sprite.x = _position.x;
    this._sprite.y = _position.y;
  }

  set position(position: Vector) {
    this._position = position;
    this._sprite.x = position.x;
    this._sprite.y = position.y;
  }

  hide() {
    this._sprite.alpha = 0;
  }

  show() {
    this._sprite.alpha = 1;
  }

}
