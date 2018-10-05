import Entity from './entity';
import Vector from './vector';
import EntityType from './entity-type';
import Collision from './collision';

export default class Attack extends Entity {

  get type() { return this._isFriendly ? EntityType.Friendly : EntityType.Unfriendly; }
  get size() { return this._size; }

  private _size: Vector;

  constructor(
    position: Vector,
    private _attacker: Entity,
    size: number | Vector,
    private _force: Vector,
    private _damage: number,
    private _isFriendly = false,
  ) {
    super(position);

    if (typeof size === 'number') {
      this._size = new Vector(size, size);
    } else {
      this._size = size;
    }
  }

  afterTick() {
    this.kill();
  }

  onCollision(otherEntity: Entity, collision: Collision) {
    super.onCollision(otherEntity, collision);

    if (collision.hit && otherEntity.type === EntityType.Unfriendly) {
      otherEntity.damage(this._damage);
      otherEntity.push(this._force.flippedHorizontally(this._attacker.position.x > otherEntity.position.x));
    }
  }

}
