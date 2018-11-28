import HPStaticShapeActor from "../../../../../../engine/actors/static-shape-actor";
import HPVector from "../../../../../../engine/physics/vector";
import { setTicksOut } from "../../../../../../engine/util/set-ticks-out";
import HPActor from "../../../../../../engine/core/actor";
import HPCollision from "../../../../../../engine/physics/collision";
import HPActorType from "../../../../../../engine/core/actor-type";

const LIFETIME = 40;
const INITIAL_SIZE = new HPVector(10, 10);
const MAX_SIZE = new HPVector(30, 30);

export default class TGFireBall extends HPStaticShapeActor {

  get size() { return this._size; }
  get isAirFrictionBound() { return false; }
  get gravityBoundCoefficient() { return this.isChanneling ? 0 : 0.5; }

  get color() { return 0xEF6D09; }
  get borderWidth() { return 1; }
  get borderColor() { return 0x000000; }
  get isRound() { return true; }

  constructor(position: HPVector) {
    super(position);

    this._size = INITIAL_SIZE;
  }

  channel() {
    this.isChanneling = true;
  }

  stopChanneling() {
    this.isChanneling = false;
    setTicksOut(() => this.kill(), LIFETIME);
  }

  init() {
    super.init();
  }

  onTick() {
    super.onTick();

    if (this.isChanneling) {
      if (this._size.x < MAX_SIZE.x) {
        this._size = this._size.times(1.02);
      } else {
        this._size = MAX_SIZE;
      }
      this.paint();
    }
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

  private _size: HPVector;
  private isChanneling = false;

}
