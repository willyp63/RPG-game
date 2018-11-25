import HPStaticShapeActor from "../../engine/actors/static-shape-actor";
import HPVector from "../../engine/physics/vector";
import HPDirection from "../../engine/physics/direction";
import setTicksOut from "../../engine/util/set-ticks-out";
import HPActorType from "../../engine/core/actor-type";
import HPRandom from "../../engine/util/random";

export default class TGWanderingTarget extends HPStaticShapeActor {

  static get type() { return 'WanderingTarget'; }

  static get wanderForce() { return new HPVector(1, 0); }
  static get jumpForce() { return new HPVector(0, -12); }

  get color() { return 0xFF0000; }
  get borderWidth() { return 2; }
  get borderColor() { return 0x000000; }
  get cornerRadius() { return 4; }

  get type() { return HPActorType.Unfriendly; }
  get size() { return new HPVector(30, 60); }
  get isGravityBound() { return true; }
  get isWallBound() { return true; }
  get isAirFrictionBound() { return true; }

  private wanderDirection = HPRandom.chance(0.5)
    ? HPDirection.Right
    : HPDirection.Left;

  constructor(
    position: HPVector,
  ) {
    super(position);
  }

  init() {
    super.init();

    this.changeDirection();
  }

  onTick() {
    super.onTick();

    const isOnGround = this.wallContact.all([HPDirection.Down]);

    if (isOnGround) {
      this.push(TGWanderingTarget.wanderForce.flipHorz(this.wanderDirection === HPDirection.Left));

      if (HPRandom.chance(0.005)) {
        this.push(TGWanderingTarget.jumpForce);
      }
    }
  }

  private changeDirection() {
    this.wanderDirection *= -1;
    setTicksOut(() => this.changeDirection(), HPRandom.int(80, 160));
  }

}
