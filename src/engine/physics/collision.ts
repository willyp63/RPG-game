import Direction, { oppositeDirection } from "./direction";

export default class Collision {

  constructor(
    private _hit: boolean,
    private _direction?: Direction,
  ) { }

  get hit() { return this._hit; }
  get direction() { return this._direction; }

  withOppositeDirection() {
    return new Collision(this._hit, oppositeDirection(this._direction));
  }

}
