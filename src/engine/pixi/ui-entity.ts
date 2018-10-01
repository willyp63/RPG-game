import { Sprite } from "pixi.js";
import Vector from "../core/vector";

export default class UIEntity {

  get sprite() { return this._sprite; }
  protected _sprite: Sprite;

  constructor(
    sprite: Sprite | Function,
    position: Vector,
  ) {
    this._sprite = typeof sprite === 'function' ? sprite() : sprite;
    this._sprite.x = position.x;
    this._sprite.y = position.y;
  }

}