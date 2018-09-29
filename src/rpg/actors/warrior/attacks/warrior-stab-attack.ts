import Entity from "../../../../engine/core/entity";
import Vector from "../../../../engine/core/vector";
import Collision from "../../../../engine/core/collision";
import EntityType from "../../../../engine/core/entity-type";
import Warrior from "..";

const SIZE = 12;
const ATTACK_FORCE = new Vector(6, -2);
const ATTACK_DAMAGE = 20;

export default class WarriorStabAttack extends Entity {

  get type() { return EntityType.Friendly; }
  get size() { return new Vector(SIZE, SIZE); }

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
      otherEntity.damage(ATTACK_DAMAGE);
      otherEntity.push(ATTACK_FORCE.flippedHorizontally(this._warrior.position.x > otherEntity.position.x));
    }
  }

}
