export default class Vector {
  constructor(
    public _x: number,
    public _y: number,
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

  capped(maxVector: Vector | number) {
    if (typeof maxVector === 'number') {
      maxVector = new Vector(maxVector, maxVector);
    }

    return new Vector(Math.min(this.x, maxVector.x), Math.min(this.y, maxVector.y));
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
}
