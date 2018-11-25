import HPVector from "../../engine/physics/vector";
import HPStaticShapeActor from "../../engine/actors/static-shape-actor";
import HPActor from "../../engine/core/actor";
import HPCollision from "../../engine/physics/collision";
import HPActorType from "../../engine/core/actor-type";

export default class TGFireBall extends HPStaticShapeActor {

  get size() { return new HPVector(20, 20); }
  get isGravityBound() { return false; }

  constructor(
    position: HPVector,
  ) {
    super(
      position,
      {
        color: 0xFF7700,
        borderWidth: 2,
        borderColor: 0x000000,
      },
    );
  }

  onCollision(actor: HPActor, collision: HPCollision) {
    if (!collision.hit) return;

    if (actor.isWall) {
      this.kill();
    } else if (actor.type === HPActorType.Unfriendly) {
      actor.kill();
      this.kill();
    }
    
  }

}