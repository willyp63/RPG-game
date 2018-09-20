import { Vector } from "../../engine/physics";
import { Actor } from "../../engine/stage";
import { Graphics } from "pixi.js";
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
      () => {
        const sprite = new Graphics();
        sprite.beginFill(0x888888);
        const halfSize = size.scaled(0.5);
        const rampPath = _orientation === RampOrientation.TopLeftToBottomRight
          ? [
            -halfSize.x, -halfSize.y,
            halfSize.x, halfSize.y,
            -halfSize.x, halfSize.y,
          ] : [
            halfSize.x, -halfSize.y,
            -halfSize.x, halfSize.y,
            halfSize.x, halfSize.y,
          ];
        sprite.drawPolygon(rampPath);
        sprite.endFill();
        return sprite;
      },
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
