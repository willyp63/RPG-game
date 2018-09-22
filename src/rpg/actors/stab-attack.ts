import { Actor } from "../../engine/stage";
import { Collision, Vector } from "../../engine/physics";
import { RenderTexture } from "pixi.js";

export default class StabAttack extends Actor {

  static isFriendly = true;
  static isStatic = true;

  constructor(position: Vector) {
    super(
      new PIXI.Sprite(RenderTexture.create(8, 8)),
      position,
    );

    setTimeout(() => this.kill(), 200);
  }

  onCollision(otherActor: Actor, collision: Collision) {
    super.onCollision(otherActor, collision);

    if (!otherActor.isFriendly) otherActor.kill();
  }

}
