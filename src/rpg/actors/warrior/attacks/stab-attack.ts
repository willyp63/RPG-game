import Entity from "../../../../engine/core/entity";
import Vector from "../../../../engine/core/vector";
import Collision from "../../../../engine/core/collision";
import EntityType from "../../../../engine/core/entity-type";
import Warrior from "..";

export default class StabAttack extends Entity {

  get type() { return EntityType.Friendly; }
  get size() { return new Vector(12, 12); }

  constructor(
    position: Vector,
    private _warrior: Warrior,
  ) {
    super(position);
  }

  afterTick() {
    this.kill();
  }

  onCollision(otherEntity: Entity, collision: Collision) {
    super.onCollision(otherEntity, collision);

    if (collision.hit && otherEntity.type === EntityType.Unfriendly) {
      if (this._warrior.position.x < otherEntity.position.x) {
        otherEntity.push(new Vector(6, -2));
      } else {
        otherEntity.push(new Vector(-6, -2));
      }
    }
  }

}
