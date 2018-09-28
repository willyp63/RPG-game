import Wall from "./wall";
import Shape from "../../../engine/core/shape";
import Vector from "../../../engine/core/vector";

export default class RampWall extends Wall {

  get shape() { return this._shape; }

  constructor(
    position: Vector,
    size: Vector,
    private _shape: Shape,
  ) {
    super(
      position,
      size,
    );
  }
}
