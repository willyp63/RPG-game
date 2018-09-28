import Entity from "../../../../engine/core/entity";
import EntityType from "../../../../engine/core/entity-type";
import Vector from "../../../../engine/core/vector";
import Collision from "../../../../engine/core/collision";
import Skeleton from "..";

export default class SkeletonAttack extends Entity {

  get type() { return EntityType.Unfriendly; }
  get size() { return new Vector(16, 16); }

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
      if (this._skeleton.position.x < otherEntity.position.x) {
        otherEntity.push(new Vector(4, -2));
      } else {
        otherEntity.push(new Vector(-4, -2));
      }
    }
  }

}
