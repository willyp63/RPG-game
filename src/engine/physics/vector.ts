export default class HPVector {

  static get Zero() { return new HPVector(0); }

  static from(data: { x: number, y: number }) {
    return new HPVector(data.x, data.y);
  }

  public get x() { return this._x; }
  public get y() { return this._y; }

  private _y: number;

  constructor(
    private _x: number,
    _y?: number,
  ) {
    // if only one arg is provided, use that value for both x and y
    this._y = _y !== undefined ? _y : _x;
  }

  get length() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  get angle() {
    return Math.atan2(this.y, this.x);
  }

  plus(otherVector: HPVector) {
    return new HPVector(this.x + otherVector.x, this.y + otherVector.y);
  }

  minus(otherVector: HPVector) {
    return new HPVector(this.x - otherVector.x, this.y - otherVector.y);
  }

  times(scaleVector: HPVector | number) {
    return typeof scaleVector === 'number'
      ? new HPVector(this.x * scaleVector, this.y * scaleVector)
      : new HPVector(this.x * scaleVector.x, this.y * scaleVector.y);
  }

  dot(scaleVector: HPVector) {
    return this.x * scaleVector.x + this.y * scaleVector.y;
  }

  limit(limitVector: HPVector | number) {
    if (typeof limitVector === 'number') {
      limitVector = new HPVector(limitVector);
    }

    const newX = this.x > 0 ? Math.min(this.x, limitVector.x) : Math.max(this.x, -limitVector.x);
    const newY = this.y > 0 ? Math.min(this.y, limitVector.y) : Math.max(this.y, -limitVector.y);
    return new HPVector(newX, newY);
  }

  newX(newX: number) {
    return new HPVector(newX, this.y);
  }

  newY(newY: number) {
    return new HPVector(this.x, newY);
  }

  toUnit() {
    return new HPVector(this.x / this.length, this.y / this.length);
  }

  flipHorz(isFlipped = true) {
    return this.times(new HPVector(isFlipped ? -1 : 1, 1));
  }

  flipVert(isFlipped = true) {
    return this.times(new HPVector(1, isFlipped ? -1 : 1));
  }

}
