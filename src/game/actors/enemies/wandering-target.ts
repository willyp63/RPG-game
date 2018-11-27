import HPVector from "../../../engine/physics/vector";
import setTicksOut from "../../../engine/util/set-ticks-out";
import HPActorType from "../../../engine/core/actor-type";
import HPRandom from "../../../engine/util/random";
import HPStaticShapeActor from "../../../engine/actors/static-shape-actor";

const WANDER_FORCE = new HPVector(1, 0);
const JUMP_FORCE = new HPVector(0, -12);

export default class TGWanderingTarget extends HPStaticShapeActor {

  static get id() { return 'WanderingTarget'; }

  get size() { return new HPVector(20, 50); }
  get type() { return HPActorType.Unfriendly; }

  get color() { return 0xFF0000; }
  get borderWidth() { return 1; }
  get borderColor() { return 0x000000; }
  get cornerRadius() { return 2; }

  constructor(position: HPVector) {
    super(position);
  }

  init() {
    super.init();

    this.move(WANDER_FORCE.flipHorz(HPRandom.chance(0.5)));
    this.changeDirection();
  }

  onTick() {
    super.onTick();

    if (this.isOnGround && HPRandom.chance(0.005)) this.push(JUMP_FORCE);
  }

  private changeDirection() {
    this.move(this.moveForce.flipHorz());
    setTicksOut(() => this.changeDirection(), HPRandom.int(80, 160));
  }

}
