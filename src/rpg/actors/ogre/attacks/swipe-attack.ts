import Entity from "../../../../engine/core/entity";
import EntityType from "../../../../engine/core/entity-type";
import Vector from "../../../../engine/core/vector";
import Ogre from "..";
import Collision from "../../../../engine/core/collision";

export default class SwipeAttack extends Entity {

  get type() { return EntityType.Friendly; }
  get size() { return new Vector(36, 36); }

  constructor(
    position: Vector,
    private _ogre: Ogre,
  ) {
    super(position);
  }

  afterTick() {
    this.kill();
  }

  onCollision(otherEntity: Entity, collision: Collision) {
    super.onCollision(otherEntity, collision);

    if (collision.hit && otherEntity.type === EntityType.Friendly) {
      if (this._ogre.position.x < otherEntity.position.x) {
        otherEntity.push(new Vector(8, -3));
      } else {
        otherEntity.push(new Vector(-8, -3));
      }
    }
  }

}
