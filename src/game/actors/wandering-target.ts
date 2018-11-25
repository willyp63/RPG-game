import HPStaticShapeActor from "../../engine/actors/static-shape-actor";
import HPVector from "../../engine/physics/vector";
import setTicksOut from "../../engine/util/set-ticks-out";
import HPActorType from "../../engine/core/actor-type";
import HPRandom from "../../engine/util/random";

export default class TGWanderingTarget extends HPStaticShapeActor {

  static get id() { return 'WanderingTarget'; }

  static get wanderForce() { return new HPVector(1, 0); }
  static get jumpForce() { return new HPVector(0, -12); }

  get type() { return HPActorType.Unfriendly; }
  get size() { return new HPVector(30, 60); }

  constructor(
    position: HPVector,
  ) {
    super(
      position,
      {
        color: 0xFF0000,
        borderWidth: 2,
        borderColor: 0x000000,
        cornerRadius: 4,
      },
    );
  }

  init() {
    super.init();

    this.move(TGWanderingTarget.wanderForce.flipHorz(HPRandom.chance(0.5)));
    this.changeDirection();
  }

  onTick() {
    super.onTick();

    if (this.isOnGround && HPRandom.chance(0.005)) {
      this.push(TGWanderingTarget.jumpForce);
    }
  }

  private changeDirection() {
    this.move(this.moveForce.flipHorz());
    setTicksOut(() => this.changeDirection(), HPRandom.int(80, 160));
  }

}
