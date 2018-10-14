export default class Vector {

  static get zero() { return new Vector(0, 0); }

  constructor(
    public x: number,
    public y: number,
  ) { }

  get length() { return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2)); }
  get angle() { return Math.atan2(this.y, this.x); }

  plus(otherVector: Vector) {
    return new Vector(this.x + otherVector.x, this.y + otherVector.y);
  }

  minus(otherVector: Vector) {
    return new Vector(this.x - otherVector.x, this.y - otherVector.y);
  }

  times(scaleVector: Vector | number) {
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
    return new Vector(newX, this.y);
  }

  withNewY(newY: number) {
    return new Vector(this.x, newY);
  }

  toUnitVector() {
    return new Vector(this.x / this.length, this.y / this.length);
  }

  flippedHorizontally(isFlipped = true) {
    return this.times(new Vector(isFlipped ? -1 : 1, 1));
  }

}
