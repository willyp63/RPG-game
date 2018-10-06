export default class Vector {

  constructor(
    private _x: number,
    private _y: number,
  ) { }

  get x() { return this._x; }
  get y() { return this._y; }

  get length() { return Math.sqrt(Math.pow(this._x, 2) + Math.pow(this._y, 2)); }

  plus(otherVector: Vector) {
    return new Vector(this.x + otherVector.x, this.y + otherVector.y);
  }

  minus(otherVector: Vector) {
    return new Vector(this.x - otherVector.x, this.y - otherVector.y);
  }

  scaled(scaleVector: Vector | number) {
    if (typeof scaleVector === 'number') {
      scaleVector = new Vector(scaleVector, scaleVector);
    }

    return new Vector(this.x * scaleVector.x, this.y * scaleVector.y);
  }

  dot(scaleVector: Vector) {
    return this.x * scaleVector.x + this.y * scaleVector.y;
  }

  capped(capVector: Vector | number) {
    if (typeof capVector === 'number') {
      capVector = new Vector(capVector, capVector);
    }

    const newX = this.x > 0 ? Math.min(this.x, capVector.x) : Math.max(this.x, -capVector.x);
    const newY = this.y > 0 ? Math.min(this.y, capVector.y) : Math.max(this.y, -capVector.y);
    return new Vector(newX, newY);
  }

  withNewX(newX: number) {
    return new Vector(newX, this._y);
  }

  withNewY(newY: number) {
    return new Vector(this._x, newY);
  }

  toUnitVector() {
    return new Vector(this._x / this.length, this._y / this.length);
  }

  flippedHorizontally(isFlipped = true) {
    return this.scaled(new Vector(isFlipped ? -1 : 1, 1));
  }

}
