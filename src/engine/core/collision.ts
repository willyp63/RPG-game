import Direction, { oppositeDirection } from "./direction";
import Entity from "./entity";
import Vector from "./vector";

export default class Collision {

  static detect(
    e1: Entity,
    e2: Entity,
  ): Collision {
    const combinedHalfSize = e1.size.times(0.5).plus(e2.size.times(0.5));
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
    const combinedHalfSize = entity.size.times(0.5).plus(wall.size.times(0.5));
    if (collision.direction === Direction.Up) {
      entity.position.y = wall.position.y + combinedHalfSize.y;
    } else if (collision.direction === Direction.Right) {
      entity.position.x = wall.position.x - combinedHalfSize.x;
    } else if (collision.direction === Direction.Down) {
      entity.position.y = wall.position.y - combinedHalfSize.y;
    } else if (collision.direction === Direction.Left) {
      entity.position.x = wall.position.x + combinedHalfSize.x;
    }
  }

  private static getPenetrationVector(
    combinedHalfSize: Vector,
    positionDiff: Vector,
    velocityDiff: Vector,
  ): Vector {

    let penetrationX = velocityDiff.x > 0
      ? combinedHalfSize.x + positionDiff.x
      : combinedHalfSize.x - positionDiff.x;
    penetrationX = 1 / Math.abs(penetrationX - Math.abs(velocityDiff.x));
    
    let penetrationY = velocityDiff.y > 0
      ? combinedHalfSize.y + positionDiff.y
      : combinedHalfSize.y - positionDiff.y;
    penetrationY = 1 / Math.abs(penetrationY - Math.abs(velocityDiff.y));

    return new Vector(penetrationX, penetrationY);
  }

  constructor(
    public hit: boolean,
    public direction?: Direction,
  ) { }

  withOppositeDirection() {
    return new Collision(this.hit, oppositeDirection(this.direction));
  }

}
