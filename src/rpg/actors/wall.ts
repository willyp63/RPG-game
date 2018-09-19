import { Actor } from "../../engine/stage";
import { Vector } from "../../engine/physics";
import { Graphics } from "pixi.js";

export default class Wall extends Actor {

  static isWall = true;
  static isFriendly = true;
  static isStatic = true;

  constructor(position, size) {
    super(
      () => {
        const sprite = new Graphics();
        sprite.beginFill(0x888888);
        sprite.drawRect(size.x / -2, size.y / -2, size.x, size.y);
        sprite.endFill();
        return sprite;
      },
      new Vector(position.x + size.x / 2, position.y + size.y / 2),
    );
  }

}
