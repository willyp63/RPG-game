import { Graphics } from "pixi.js";
import Vector from "../core/vector";

const WIDTH = 20;
const HEIGHT = 2;

export class HealthBar extends Graphics {

  constructor(position: Vector, private _maxHealth: number) {
    super();

    this.x = position.x;
    this.y = position.y;

    this.setHealth(this._maxHealth);
  }

  setHealth(health: number) {
    const percent = health / this._maxHealth;

    this.beginFill(0xFF0000);
    this.drawRect(WIDTH / -2, HEIGHT / -2, WIDTH, HEIGHT);
    this.endFill();

    this.beginFill(0x00FF00);
    this.drawRect(WIDTH / -2, HEIGHT / -2, WIDTH * percent, HEIGHT);
    this.endFill();
  }

}
