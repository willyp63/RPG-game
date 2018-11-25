export default class HPVector {

  static get Zero() { return new HPVector(0, 0); }

  static fromData(data: { x: number, y: number }) { return new HPVector(data.x, data.y); }

  constructor(
    public x: number,
    public y: number,
  ) { }

  get length() { return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2)); }
  get angle() { return Math.atan2(this.y, this.x); }

  plus(otherVector: HPVector) {
    return new HPVector(this.x + otherVector.x, this.y + otherVector.y);
  }

  minus(otherVector: HPVector) {
    return new HPVector(this.x - otherVector.x, this.y - otherVector.y);
  }

  times(scaleVector: HPVector | number) {
    if (typeof scaleVector === 'number') {
      scaleVector = new HPVector(scaleVector, scaleVector);
    }

    return new HPVector(this.x * scaleVector.x, this.y * scaleVector.y);
  }

  dot(scaleVector: HPVector) {
    return this.x * scaleVector.x + this.y * scaleVector.y;
  }

  capped(capVector: HPVector | number) {
    if (typeof capVector === 'number') {
      capVector = new HPVector(capVector, capVector);
    }

    const newX = this.x > 0 ? Math.min(this.x, capVector.x) : Math.max(this.x, -capVector.x);
    const newY = this.y > 0 ? Math.min(this.y, capVector.y) : Math.max(this.y, -capVector.y);
    return new HPVector(newX, newY);
  }

  withNewX(newX: number) {
    return new HPVector(newX, this.y);
  }

  withNewY(newY: number) {
    return new HPVector(this.x, newY);
  }

  toUnitVector() {
    return new HPVector(this.x / this.length, this.y / this.length);
  }

  flipHorz(isFlipped = true) {
    return this.times(new HPVector(isFlipped ? -1 : 1, 1));
  }

}
