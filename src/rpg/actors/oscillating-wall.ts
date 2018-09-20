import Wall from "./wall";
import { Vector } from "../../engine/physics";

export default class OscillatingWall extends Wall {

  static isStatic = false;

  private _tickCount = 0;

  constructor(position: Vector, size: Vector, velocity: Vector, private _halfOscillationPeriod: number) {
    super(
      position,
      size,
    );

    this.bounds.velocity = velocity;
  }

  afterTick() {
    this._tickCount++;
    if (this._tickCount >= this._halfOscillationPeriod) {
      this._turnAround();
      this._tickCount = 0;
    }
  }

  _turnAround() {
    this.bounds.velocity = this.bounds.velocity.scaled(-1);
  }

}
