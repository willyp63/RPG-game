import Vector from "./vector";
import Rect from "./rect";

export enum RampOrientation {
  TopLeftToBottomRight,
  TopRightToBottomLeft,
}

export default class Ramp extends Rect {

  get orientation() { return this._orientation; }

  constructor(
    position: Vector,
    size: Vector,
    private _orientation: RampOrientation,
  ) {
    super(position, size);
  }

}
