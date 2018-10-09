import Entity, { EntityType } from '../core/entity';
import Vector from '../core/vector';
import Collision from '../core/collision';

export default class InstantAttack extends Entity {

  get type() { return this.isFriendly ? EntityType.Friendly : EntityType.Unfriendly; }
  get size() { return this._size; }

  private _size: Vector;

  constructor(
    position: Vector,
    private _attacker: Entity,
    size: number | Vector,
    private force: Vector,
    private _damage: number,
    private isFriendly = false,
  ) {
    super(position);

    this._size = typeof size === 'number'
      ? new Vector(size, size)
      : size;
  }

  afterTick() {
    super.afterTick();

    // kill after one tick
    this.kill();
  }

  onCollision(otherEntity: Entity, collision: Collision) {
    super.onCollision(otherEntity, collision);

    if (collision.hit && otherEntity.type === EntityType.Unfriendly) {
      otherEntity.damage(this._damage);
      otherEntity.push(this.force.flippedHorizontally(this._attacker.position.x > otherEntity.position.x));
    }
  }

}
