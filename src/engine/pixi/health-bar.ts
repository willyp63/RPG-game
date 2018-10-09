import { Graphics, Sprite } from "pixi.js";
import Vector from "../core/vector";
import UIEntity from "./ui-entity";

const WIDTH = 16;
const HEIGHT = 2;
const BORDER_WIDTH = 1;

export class HealthBar extends UIEntity {

  get isFixed() { return false; }

  private graphics = new Graphics();

  constructor(position: Vector, public maxHealth: number) {
    super(
      new Sprite(),
      position,
    );

    this.sprite.addChild(this.graphics);
    this.setHealth(this.maxHealth);
  }

  setHealth(health: number) {
    const percent = health / this.maxHealth;

    this.graphics.clear();

    this.graphics.beginFill(0x000000);
    this.graphics.drawRect(WIDTH / -2 - BORDER_WIDTH, HEIGHT / -2 - BORDER_WIDTH, WIDTH + BORDER_WIDTH * 2, HEIGHT + BORDER_WIDTH * 2);
    this.graphics.endFill();

    this.graphics.beginFill(0xFF0000);
    this.graphics.drawRect(WIDTH / -2, HEIGHT / -2, WIDTH, HEIGHT);
    this.graphics.endFill();

    this.graphics.beginFill(0x00FF00);
    this.graphics.drawRect(WIDTH / -2, HEIGHT / -2, WIDTH * percent, HEIGHT);
    this.graphics.endFill();
  }

}
