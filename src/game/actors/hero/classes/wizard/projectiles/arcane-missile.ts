import HPStaticShapeActor from "../../../../../../engine/actors/static-shape-actor";
import HPVector from "../../../../../../engine/physics/vector";
import { setTicksOut } from "../../../../../../engine/util/set-ticks-out";
import HPActor from "../../../../../../engine/core/actor";
import HPCollision from "../../../../../../engine/physics/collision";
import HPActorType from "../../../../../../engine/core/actor-type";

const LIFETIME = 20;

export default class TGArcaneMissile extends HPStaticShapeActor {

  get size() { return new HPVector(12, 12); }
  get isAirFrictionBound() { return false; }
  get gravityBoundCoefficient() { return 0.2; }

  get color() { return 0x7509C1; }
  get borderWidth() { return 1; }
  get borderColor() { return 0x000000; }
  get isRound() { return true; }

  constructor(position: HPVector) {
    super(position);
  }

  init() {
    super.init();

    setTicksOut(() => this.kill(), LIFETIME);
  }

  onCollision(actor: HPActor, collision: HPCollision) {
    if (!collision.hit) return;

    if (actor.isWall) {
      this.kill();
    } else if (actor.type === HPActorType.Unfriendly) {
      actor.damage(5);
      this.kill();
    }
  }

}
