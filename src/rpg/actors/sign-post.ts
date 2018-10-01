import PIXIEntity from "../../engine/pixi/pixi-entity";
import Vector from "../../engine/core/vector";
import { Sprite, loader } from "pixi.js";

const TEXTURE_FILE = "public/imgs/sign-post.png";
const SIZE = new Vector(30, 32);

export default class SignPost extends PIXIEntity {

  get size() { return SIZE; }

  static assets = [TEXTURE_FILE];

  constructor(
    position: Vector,
  ) {
    super(
      new Sprite(loader.resources[TEXTURE_FILE].texture),
      position,
    );
  }

}
