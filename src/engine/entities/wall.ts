import Entity from "../core/entity";
import Vector from "../core/vector";

export default class Wall extends Entity {

  get isWall() { return true; }
  get size() { return this._size; }

  constructor(
    position: Vector,
    private _size: Vector,
  ) {
    // when creating a wall you specify the upper-left point, not the center
    super(position.plus(_size.times(0.5)));
  }

}
