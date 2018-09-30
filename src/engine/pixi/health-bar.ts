import { Graphics } from "pixi.js";
import Vector from "../core/vector";

const WIDTH = 16;
const HEIGHT = 2;
const BORDER_WIDTH = 1;

export class HealthBar extends Graphics {

  constructor(position: Vector, public maxHealth: number) {
    super();

    this.x = position.x;
    this.y = position.y;

    this.setHealth(this.maxHealth);
  }

  setHealth(health: number) {
    const percent = health / this.maxHealth;

    this.beginFill(0x000000);
    this.drawRect(WIDTH / -2 - BORDER_WIDTH, HEIGHT / -2 - BORDER_WIDTH, WIDTH + BORDER_WIDTH * 2, HEIGHT + BORDER_WIDTH * 2);
    this.endFill();

    this.beginFill(0xFF0000);
    this.drawRect(WIDTH / -2, HEIGHT / -2, WIDTH, HEIGHT);
    this.endFill();

    this.beginFill(0x00FF00);
    this.drawRect(WIDTH / -2, HEIGHT / -2, WIDTH * percent, HEIGHT);
    this.endFill();
  }

}
