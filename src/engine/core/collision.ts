import Direction, { oppositeDirection } from "./direction";
import Entity from "./entity";
import Vector from "./vector";

export default class Collision {

  constructor(
    private _hit: boolean,
    private _direction?: Direction,
  ) { }

  get hit() { return this._hit; }
  get direction() { return this._direction; }

  withOppositeDirection() {
    return new Collision(this._hit, oppositeDirection(this._direction));
  }

  static detect(
    e1: Entity,
    e2: Entity,
  ): Collision {
    const e1HalfSize = e1.size.scaled(0.5);
    const e2HalfSize = e2.size.scaled(0.5);
    const combinedHalfSize = e1HalfSize.plus(e2HalfSize);
    const velocityDiff = e1.velocity.minus(e2.velocity);
    const positionDiff = e1.position.minus(e2.position);

    const hit =
      Math.abs(positionDiff.x) < combinedHalfSize.x &&
      Math.abs(positionDiff.y) < combinedHalfSize.y;

    if (!hit) return new Collision(false);

    const penetration =
      Collision.getPenetrationVector(
        combinedHalfSize,
        positionDiff,
        velocityDiff,
      );
    
    let direction = (penetration.x > penetration.y)
      ? velocityDiff.x > 0 ? Direction.Right : Direction.Left
      : velocityDiff.y > 0 ? Direction.Down : Direction.Up;

    return new Collision(hit, direction);
  }

  static recede(
    entity: Entity,
    wall: Entity,
    collision: Collision,
  ) {
    const entityHalfSize = entity.size.scaled(0.5);
    const wallHalfSize = wall.size.scaled(0.5);
    const combinedHalfSize = entityHalfSize.plus(wallHalfSize);

    if (collision.direction === Direction.Up) {
      entity.position = entity.position.withNewY(wall.position.y + combinedHalfSize.y);
    } else if (collision.direction === Direction.Right) {
      entity.position = entity.position.withNewX(wall.position.x - combinedHalfSize.x);
    } else if (collision.direction === Direction.Down) {
      entity.position = entity.position.withNewY(wall.position.y - combinedHalfSize.y);
    } else if (collision.direction === Direction.Left) {
      entity.position = entity.position.withNewX(wall.position.x + combinedHalfSize.x);
    }
  }

  private static getPenetrationVector(
    combinedHalfSize: Vector,
    positionDiff: Vector,
    velocityDiff: Vector,
  ): Vector {

    let penetrationX, penetrationY;

    if (velocityDiff.x > 0) {
      penetrationX = (combinedHalfSize.x + positionDiff.x);
    } else {
      penetrationX = (combinedHalfSize.x - positionDiff.x);
    }
    penetrationX = 1 / Math.abs(penetrationX - velocityDiff.x);
    
    if (velocityDiff.y > 0) {
      penetrationY = (combinedHalfSize.y + positionDiff.y);
    } else {
      penetrationY = (combinedHalfSize.y - positionDiff.y);
    }
    penetrationY = 1 / Math.abs(penetrationY - velocityDiff.y);

    return new Vector(penetrationX, penetrationY);
  }

}
