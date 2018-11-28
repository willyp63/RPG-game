import HPDirection from "./direction";

export default class HPCollision {

  public hit: boolean;
  public direction: HPDirection;

  constructor(
    _direction: HPDirection | undefined = undefined,
  ) {
    this.hit = _direction !== undefined;
    this.direction = _direction !== undefined ? _direction : HPDirection.Down;
  }

  withOppositeDirection() {
    return new HPCollision(this.hit ? this.direction * -1 : undefined);
  }

}
