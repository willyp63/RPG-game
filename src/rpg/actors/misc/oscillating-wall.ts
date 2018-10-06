import { Sprite, loader } from "pixi.js";
import Vector from "../../../engine/core/vector";
import PIXIEntity from "../../../engine/pixi/pixi-entity";
import setTicksOut from "../../../engine/util/set-ticks-out";

const TEXTURES_FILE = 'public/imgs/wood-plank.jpg';
const SM_TEXTURES_FILE = 'public/imgs/wood-plank-sm.jpg';
const MD_TEXTURES_FILE = 'public/imgs/wood-plank-md.jpg';

export default class OscillatingWall extends PIXIEntity {

  static assets = [TEXTURES_FILE, SM_TEXTURES_FILE, MD_TEXTURES_FILE];

  get isWall() { return true; }
  get size() { return this._size; }

  constructor(
    position: Vector,
    private _size: Vector,
    velocity: Vector,
    private _halfOscillationPeriod: number,
  ) {
    super(
      new Sprite(loader.resources[TEXTURES_FILE].texture),
      position.plus(_size.scaled(0.5)),
    );

    this.velocity = velocity;

    if (this._size.x <= 32) {
      this._sprite.texture = loader.resources[SM_TEXTURES_FILE].texture;
    } else if (this._size.x <= 64) {
      this._sprite.texture = loader.resources[MD_TEXTURES_FILE].texture;
    }

    this.scheduleTurnAround();
  }

  private scheduleTurnAround() {
    setTicksOut(this.turnAround.bind(this), this._halfOscillationPeriod);
  }

  private turnAround() {
    this.velocity = this.velocity.scaled(-1);
    this.scheduleTurnAround();
  }

}
