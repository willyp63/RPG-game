import Wall from "./wall";
import { Vector } from "../../engine/physics";
import { Sprite, loader, ObservablePoint } from "pixi.js";

export default class OscillatingWall extends Wall {

  static isStatic = false;
  static assets = ['public/imgs/wood-plank.jpg'];

  private _tickCount = 0;

  constructor(position: Vector, size: Vector, velocity: Vector, private _halfOscillationPeriod: number) {
    super(
      position,
      size,
    );

    const img = new Sprite(loader.resources['public/imgs/wood-plank.jpg'].texture);
    img.anchor = <ObservablePoint>{ x: 0.5, y: 0.5 };
    this._sprite.addChild(img);

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
