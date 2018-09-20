import Vector from "./vector";

export default class Rect {

  public velocity: Vector = new Vector(0, 0);
  public acceleration: Vector = new Vector(0, 0);

  constructor(
    public position: Vector,
    public size: Vector,
  ) { }

}
