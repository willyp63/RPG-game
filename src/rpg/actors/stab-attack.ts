import Entity from "../../engine/core/entity";
import Vector from "../../engine/core/vector";
import Collision from "../../engine/core/collision";
import EntityType from "../../engine/core/entity-type";

export default class StabAttack extends Entity {

  static isFriendly = true;
  static isStatic = true;

  constructor(position: Vector) {
    super(position);

    setTimeout(() => this.kill(), 200);
  }

  onCollision(otherEntity: Entity, collision: Collision) {
    super.onCollision(otherEntity, collision);

    if (otherEntity.type === EntityType.Friendly) {
      otherEntity.kill();
    }
  }

}
