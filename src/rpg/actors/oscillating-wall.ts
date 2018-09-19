import Wall from "./wall";

export default class OscillatingWall extends Wall {

  static isStatic = false;

  constructor(position, size, velocity, halfOscillationPeriod) {
    super(
      position,
      size,
    );

    this.velocity = velocity;

    setInterval(this._turnAround.bind(this), halfOscillationPeriod);
  }

  _turnAround() {
    this.velocity = this.velocity.scaled(-1);
  }

}
