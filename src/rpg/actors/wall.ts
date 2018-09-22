import { Actor } from "../../engine/stage";
import { Vector } from "../../engine/physics";
import { RenderTexture } from "pixi.js";

export default class Wall extends Actor {

  static isWall = true;
  static isFriendly = true;
  static isStatic = true;

  constructor(position: Vector, size: Vector) {
    super(
      new PIXI.Sprite(RenderTexture.create(size.x, size.y)),
      new Vector(position.x + size.x / 2, position.y + size.y / 2),
    );
  }

}
