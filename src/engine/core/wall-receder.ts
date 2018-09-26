import Entity from "./entity";
import Collision from "./collision";
import Direction from "./direction";
import Shape from "./shape";
import Vector from "./vector";

export default class WallReceder {

  static recedeEntityFromRectWallCollision(
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

  static recedeEntityFromRampWallCollision(
    entity: Entity,
    wall: Entity,
  ) {
    const rectHalfSize =  entity.size.scaled(0.5);

    let cornerPointToTest = entity.position.plus(
      new Vector(
        wall.shape === Shape.DeclineRamp
          ? -rectHalfSize.x
          : rectHalfSize.x,
        rectHalfSize.y,
      )
    );

    let rampSlope = wall.size.y / wall.size.x;
    if (wall.shape === Shape.InclineRamp) rampSlope *= -1;

    const newY = rampSlope * (cornerPointToTest.x - wall.position.x) + wall.position.y;
    entity.position = entity.position.plus(new Vector(0, newY - cornerPointToTest.y));
  }

}