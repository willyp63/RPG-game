import Entity from "../../../../engine/core/entity";
import EntityType from "../../../../engine/core/entity-type";
import Vector from "../../../../engine/core/vector";
import Ogre from "..";
import Collision from "../../../../engine/core/collision";

const SIZE = 36;
const ATTACK_FORCE = new Vector(8, -3);
const ATTACK_DAMAGE = 30;

export default class OgreSwipeAttack extends Entity {

  get type() { return EntityType.Unfriendly; }
  get size() { return new Vector(SIZE, SIZE); }

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
      otherEntity.damage(ATTACK_DAMAGE);
      otherEntity.push(ATTACK_FORCE.flippedHorizontally(this._ogre.position.x > otherEntity.position.x));
    }
  }

}
