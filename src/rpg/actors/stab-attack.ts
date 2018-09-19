import { Actor } from "../../engine/stage";
import { Collision, Direction } from "../../engine/physics";

export default class StabAttack extends Actor {

  static isFriendly = true;
  static isStatic = true;

  constructor(position) {
    super(
      () => {
        const sprite = new PIXI.Graphics();
        sprite.beginFill(0xFF0000);
        sprite.drawRect(-4, -4, 8, 8);
        sprite.endFill();
        return sprite;
      },
      position,
    );

    setTimeout(() => this.kill(), 200);
  }

  onCollision(otherActor: Actor, collision: Collision) {
    super.onCollision(otherActor, collision);

    if (!otherActor.isFriendly) otherActor.kill();
  }

}
