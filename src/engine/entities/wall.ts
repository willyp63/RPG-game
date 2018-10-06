import Entity from "../core/entity";
import Vector from "../core/vector";

export default class Wall extends Entity {

  get isWall() { return true; }
  get size() { return this._size; }

  constructor(
    position: Vector,
    private _size: Vector,
  ) {
    super(position.plus(_size.scaled(0.5)));
  }

}
