import Vector from "./vector";

export default class Rect {

  static maxAcceleration = 16;

  public velocity: Vector = new Vector(0, 0);
  public acceleration: Vector = new Vector(0, 0);

  constructor(
    public position: Vector,
    public size: Vector,
  ) { }

  tick() {
    this.velocity = this.velocity.plus(this.acceleration.capped(Rect.maxAcceleration));
    this.position = this.position.plus(this.velocity);
    this.acceleration = new Vector(0, 0);
  }

}
