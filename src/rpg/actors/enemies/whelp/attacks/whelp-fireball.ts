import Vector from '../../../../../engine/core/vector';
import PIXIEntity from '../../../../../engine/pixi/pixi-entity';
import Entity, { EntityType } from '../../../../../engine/core/entity';
import { Sprite, loader } from 'pixi.js';
import Collision from '../../../../../engine/core/collision';

const TEXTURES_FILE = 'public/imgs/fireball.png';

const SIZE = new Vector(16, 16);
const DAMAGE = 15;
const FORCE = 4;

export default class WhelpFireball extends PIXIEntity {

  static get assets() { return [TEXTURES_FILE]; }

  get type() { return EntityType.Neutral; }
  get size() { return SIZE; }

  constructor(
    position: Vector,
  ) {
    super(
      new Sprite(loader.resources[TEXTURES_FILE].texture),
      position,
    );
  }

  afterTick() {
    super.afterTick();

    this.sprite.rotation = this.velocity.angle;
  }

  onCollision(otherEntity: Entity, collision: Collision) {
    super.onCollision(otherEntity, collision);

    if (collision.hit) {
      if (otherEntity.type === EntityType.Friendly) {
        otherEntity.damage(DAMAGE);
        otherEntity.push(otherEntity.position.minus(this.position).toUnitVector().times(FORCE));
        this.kill();
      }

      if (otherEntity.isWall) {
        this.kill();
      }
    }
  }

}
