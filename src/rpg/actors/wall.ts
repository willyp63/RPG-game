import { RenderTexture, Sprite } from "pixi.js";
import PIXIEntity from "../../engine/pixi/pixi-entity";
import Vector from "../../engine/core/vector";

export default class Wall extends PIXIEntity {

  get isWall() { return true; }
  get size() { return this._size; }

  constructor(
    position: Vector,
    private _size: Vector,
    sprite?: Sprite,
  ) {
    super(
      sprite || new PIXI.Sprite(RenderTexture.create(_size.x, _size.y)),
      new Vector(position.x + _size.x / 2, position.y + _size.y / 2),
    );
  }

}
