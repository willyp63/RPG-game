import { Vector } from "../../engine/physics";
import { Actor } from "../../engine/stage";
import { RenderTexture } from "pixi.js";
import Ramp, { RampOrientation } from "../../engine/physics/ramp";

export default class RampWall extends Actor {

  static isWall = true;
  static isFriendly = true;
  static isStatic = true;

  get orientation() { return this._orientation; }
   
  constructor(
    position: Vector,
    size: Vector,
    private _orientation: RampOrientation,
  ) {
    super(
      new PIXI.Sprite(RenderTexture.create(size.x, size.y)),
      position,
    );

    this._bounds = new Ramp(
      new Vector(position.x + size.x / 2, position.y + size.y / 2),
      size,
      _orientation,
    );
    this._sprite.x = this._bounds.position.x;
    this._sprite.y = this._bounds.position.y;
  }
}
