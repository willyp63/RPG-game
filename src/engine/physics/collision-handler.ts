import HPEntity from "./entity";
import HPCollision from "./collision";
import HPDirection from "./direction";
import HPVector from "./vector";

export default class HPCollisionHandler {

  static handle(
    e1: HPEntity,
    e2: HPEntity,
    collision: HPCollision,
  ) {
    HPCollisionHandler.handleWithTargetEntity(e1, e2, collision);
    HPCollisionHandler.handleWithTargetEntity(e2, e1, collision);
  }

  static handleWithTargetEntity(
    targetEntity: HPEntity,
    otherEntity: HPEntity,
    collision: HPCollision,
  ) {
    if (!collision.hit) return;

    HPCollisionHandler.handleWallCollision(targetEntity, otherEntity, collision);
  }

  private static handleWallCollision(
    targetEntity: HPEntity,
    otherEntity: HPEntity,
    collision: HPCollision,
  ) {
    if (!targetEntity.isWallBound || !otherEntity.isWall) return;

    HPCollisionHandler.recedeFromWall(targetEntity, otherEntity, collision);
    HPCollisionHandler.bounceOffWall(targetEntity, otherEntity, collision);
    HPCollisionHandler.applyFloorFriction(targetEntity, otherEntity, collision);
    targetEntity.wallContact.setContact(collision.direction * -1);
  }

  private static recedeFromWall(
    entity: HPEntity,
    wall: HPEntity,
    collision: HPCollision,
  ) {
    const combinedHalfSize = entity.size.times(0.5).plus(wall.size.times(0.5));

    if (collision.direction === HPDirection.Down) {
      entity.position = entity.position.newY(wall.position.y + combinedHalfSize.y);
    } else if (collision.direction === HPDirection.Left) {
      entity.position = entity.position.newX(wall.position.x - combinedHalfSize.x);
    } else if (collision.direction === HPDirection.Up) {
      entity.position = entity.position.newY(wall.position.y - combinedHalfSize.y);
    } else if (collision.direction === HPDirection.Right) {
      entity.position = entity.position.newX(wall.position.x + combinedHalfSize.x);
    }
  }

  private static bounceOffWall(
    entity: HPEntity,
    wall: HPEntity,
    collision: HPCollision,
  ) {
    const combinedBounciness = (wall.bounciness + entity.bounciness) / 2;

    if (collision.direction === HPDirection.Up) {
      entity.velocity = entity.velocity.newY(Math.min(wall.velocity.y, entity.velocity.y * -combinedBounciness));
    } else if (collision.direction === HPDirection.Right) {
      entity.velocity = entity.velocity.newX(Math.max(wall.velocity.x, entity.velocity.x * -combinedBounciness));
    } else if (collision.direction === HPDirection.Down) {
      entity.velocity = entity.velocity.newY(Math.max(wall.velocity.y, entity.velocity.y * -combinedBounciness));
    } else if (collision.direction === HPDirection.Left) {
      entity.velocity = entity.velocity.newX(Math.min(wall.velocity.x, entity.velocity.x * -combinedBounciness));
    }
  }

  private static applyFloorFriction(
    entity: HPEntity,
    wall: HPEntity,
    collision: HPCollision,
  ) {
    if (collision.direction !== HPDirection.Up) return;

    const velocityDiff = wall.velocity.minus(entity.velocity);
    entity.push(new HPVector(velocityDiff.x * (1 - wall.slipperiness), 0));

    // stick to floor when going down elevators
    if (wall.velocity.y > 0) entity.velocity = entity.velocity.newY(wall.velocity.y);
  }

}
