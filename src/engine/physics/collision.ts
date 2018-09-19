import Rect from "./rect";
import Vector from "./vector";
import Direction from "./direction";

export default class Collision {

  get hit() { return this._hit; }
  private _hit: boolean;
  
  get direction() { return this._direction; }
  private _direction: Direction;

  private _combinedHalfSize: Vector;
  private _positionDiff: Vector;
  private _velocityDiff: Vector;

  constructor(
    private _r1: Rect,
    private _r2: Rect,
  ) {
    const r1HalfSize = _r1.size.scaled(0.5);
    const r2HalfSize = _r2.size.scaled(0.5);

    this._combinedHalfSize = r1HalfSize.plus(r2HalfSize);
    this._positionDiff = _r1.position.minus(_r2.position);
    this._velocityDiff = this._r1.velocity.minus(this._r2.velocity);

    this._hit =
      Math.abs(this._positionDiff.x) < this._combinedHalfSize.x &&
      Math.abs(this._positionDiff.y) < this._combinedHalfSize.y;
      
    this._direction = this._calcDirection();
  }

  recedeFirstRect() {
    if (!this._hit) return;

    if (this._direction === Direction.Up) {
      this._r1.position = this._r1.position.withNewY(this._r2.position.y + this._combinedHalfSize.y);
    } else if (this._direction === Direction.Right) {
      this._r1.position = this._r1.position.withNewX(this._r2.position.x - this._combinedHalfSize.x);
    } else if (this._direction === Direction.Down) {
      this._r1.position = this._r1.position.withNewY(this._r2.position.y - this._combinedHalfSize.y);
    } else {
      this._r1.position = this._r1.position.withNewX(this._r2.position.x + this._combinedHalfSize.x);
    }
  }

  _calcDirection(): Direction {
    if (!this._hit) return Direction.Up;

    let penetrationX, penetrationY;

    if (this._velocityDiff.x === 0) penetrationX = 0;
    else if (this._velocityDiff.x > 0 ) penetrationX = (this._combinedHalfSize.x + this._positionDiff.x);
    else penetrationX = (this._combinedHalfSize.x - this._positionDiff.x);
    
    if (this._velocityDiff.y === 0) penetrationY = 0;
    else if (this._velocityDiff.y > 0 ) penetrationY = (this._combinedHalfSize.y + this._positionDiff.y);
    else penetrationY = (this._combinedHalfSize.y - this._positionDiff.y);

    if (penetrationX === 0 || penetrationX > Math.abs(this._velocityDiff.x) + .001) penetrationX = 0;
    else penetrationX /= Math.abs(this._velocityDiff.x);

    if (penetrationY === 0 || penetrationY > Math.abs(this._velocityDiff.y) + .001) penetrationY = 0;
    else penetrationY /= Math.abs(this._velocityDiff.y);

    return penetrationX > penetrationY
      ? (this._velocityDiff.x > 0 ? Direction.Right : Direction.Left)
      : (this._velocityDiff.y > 0 ? Direction.Down : Direction.Up);
  }
  
}
