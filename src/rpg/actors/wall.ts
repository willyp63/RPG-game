import { RenderTexture, Sprite } from "pixi.js";
import PIXIEntity from "../../engine/pixi/pixi-entity";
import Vector from "../../engine/core/vector";

export default class Wall extends PIXIEntity {

  get isWall() { return true; }

  constructor(
    position: Vector,
    size: Vector,
    sprite?: Sprite,
  ) {
    super(
      sprite || new PIXI.Sprite(RenderTexture.create(size.x, size.y)),
      new Vector(position.x + size.x / 2, position.y + size.y / 2),
    );
  }

}
