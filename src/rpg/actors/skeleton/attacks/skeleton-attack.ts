import Entity from "../../../../engine/core/entity";
import EntityType from "../../../../engine/core/entity-type";
import Vector from "../../../../engine/core/vector";
import Collision from "../../../../engine/core/collision";
import Skeleton from "..";

const SIZE = 16;
const ATTACK_FORCE = new Vector(4, -2);
const ATTACK_DAMAGE = 5;

export default class SkeletonAttack extends Entity {

  get type() { return EntityType.Unfriendly; }
  get size() { return new Vector(SIZE, SIZE); }

  constructor(
    position: Vector,
    private _skeleton: Skeleton,
  ) {
    super(position);
  }

  afterTick() {
    this.kill();
  }

  onCollision(otherEntity: Entity, collision: Collision) {
    super.onCollision(otherEntity, collision);

    if (collision.hit && otherEntity.type === EntityType.Friendly) {
      otherEntity.damage(ATTACK_DAMAGE);
      otherEntity.push(ATTACK_FORCE.flippedHorizontally(this._skeleton.position.x > otherEntity.position.x));
    }
  }

}
