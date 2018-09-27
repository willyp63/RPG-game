import { Sprite, ObservablePoint } from "pixi.js";
import Vector from "../core/vector";
import Entity from "../core/entity";

export default abstract class PIXIEntity extends Entity {

  static assets: Array<string> = [];

  get sprite() { return this._sprite; }
  protected _sprite: Sprite;

  constructor(
    sprite: Sprite | Function,
    position: Vector,
  ) {
    super(position);

    this._sprite = typeof sprite === 'function' ? sprite() : sprite;

    // all sprites are anchored at their center
    this.sprite.anchor = <ObservablePoint>{ x: 0.5, y: 0.5 };

    this._alignSprite();
  }

  afterTick() {
    super.afterTick();

    this._alignSprite();
  }

  /* --- private --- */
  _alignSprite() {
    this.sprite.x = this.position.x;
    this.sprite.y = this.position.y;
  }

}
