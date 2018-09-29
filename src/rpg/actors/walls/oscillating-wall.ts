import Wall from "./wall";
import { Sprite, loader } from "pixi.js";
import Vector from "../../../engine/core/vector";

const TEXTURES_FILE = 'public/imgs/wood-plank.jpg';
const SM_TEXTURES_FILE = 'public/imgs/wood-plank-sm.jpg';

export default class OscillatingWall extends Wall {

  static assets = [TEXTURES_FILE, SM_TEXTURES_FILE];

  private _tickCount = 0;

  constructor(
    position: Vector,
    size: Vector,
    velocity: Vector,
    private _halfOscillationPeriod: number,
  ) {
    super(
      position,
      size,
      new Sprite(loader.resources[TEXTURES_FILE].texture),
    );

    this.velocity = velocity;

    if (size.x < 96) {
      this._sprite.texture = loader.resources[SM_TEXTURES_FILE].texture;
    }
  }

  afterTick() {
    super.afterTick();

    this._tickCount++;
    if (this._tickCount >= this._halfOscillationPeriod) {
      this._turnAround();
      this._tickCount = 0;
    }
  }

  _turnAround() {
    this.velocity = this.velocity.scaled(-1);
  }

}
