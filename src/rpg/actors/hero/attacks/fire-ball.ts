import Entity, { EntityType } from "../../../../engine/core/entity";
import Vector from "../../../../engine/core/vector";
import Collision from "../../../../engine/core/collision";
import PIXIEntity from "../../../../engine/pixi/pixi-entity";
import { Sprite, loader } from "pixi.js";

const TEXTURES_FILE = 'public/imgs/fireball.png';

const SIZE = new Vector(16, 16);
const DAMAGE = 15;
const FORCE = new Vector(4, 0);
const PROJECTILE_FORCE = new Vector(8, 0);

export default class FireBall extends PIXIEntity {

  static get assets() { return [TEXTURES_FILE]; }

  get type() { return EntityType.Neutral; }
  get size() { return SIZE; }

  constructor(
    position: Vector,
    isFacingLeft: boolean,
  ) {
    super(
      new Sprite(loader.resources[TEXTURES_FILE].texture),
      position,
    );

    if (isFacingLeft) this._sprite.scale.x = -1;

    this.push(PROJECTILE_FORCE.flippedHorizontally(isFacingLeft));
  }

  onCollision(otherEntity: Entity, collision: Collision) {
    super.onCollision(otherEntity, collision);

    if (collision.hit) {
      if (otherEntity.type === EntityType.Unfriendly) {
        otherEntity.damage(DAMAGE);
        otherEntity.push(FORCE.flippedHorizontally(this.position.x > otherEntity.position.x));
        this.kill();
      }

      if (otherEntity.isWall) {
        this.kill();
      }
    }
  }

}
