import Entity, { EntityType } from "../../../../engine/core/entity";
import Vector from "../../../../engine/core/vector";
import Collision from "../../../../engine/core/collision";
import PIXIEntity from "../../../../engine/pixi/pixi-entity";
import { Sprite, loader } from "pixi.js";

const TEXTURES_FILE = 'public/imgs/bouncy-blue-ball.png';

const SIZE = new Vector(10, 10);
const DAMAGE = 15;
const FORCE = new Vector(4, 0);
const PROJECTILE_FORCE = new Vector(6, 3);
const MAX_WALLS_HIT = 6;

export default class BouncyBlueBall extends PIXIEntity {

  static get assets() { return [TEXTURES_FILE]; }

  get type() { return EntityType.Neutral; }
  get size() { return SIZE; }
  get isGravityBound() { return true; }
  get isWallBound() { return true; }
  get elasticity() { return 2; }

  private numWallsHit = 0;

  constructor(
    position: Vector,
    isFacingLeft: boolean,
  ) {
    super(
      new Sprite(loader.resources[TEXTURES_FILE].texture),
      position,
    );

    this.push(PROJECTILE_FORCE.flippedHorizontally(isFacingLeft));
  }

  onCollision(otherEntity: Entity, collision: Collision) {
    super.onCollision(otherEntity, collision);

    if (collision.hit) {
      if (otherEntity.type === EntityType.Unfriendly) {
        otherEntity.damage(DAMAGE);
        otherEntity.push(FORCE.flippedHorizontally(this.position.x > otherEntity.position.x));
        this.velocity.x *= -1;
        this.numWallsHit++;
      }

      if (otherEntity.isWall) {
        this.numWallsHit++;
      }

      if (this.numWallsHit >= MAX_WALLS_HIT) {
        this.kill();
      }
    }
  }

}
