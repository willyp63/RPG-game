import HPEntity from "./entity";
import HPCollision from "./collision";
import HPDirection from "./direction";
import HPVector from "./vector";

export default class HPCollisionDetector {

  static detect(
    e1: HPEntity,
    e2: HPEntity,
  ): HPCollision {

    const combinedHalfSize = e1.size.times(0.5).plus(e2.size.times(0.5));
    const velocityDiff = e1.velocity.minus(e2.velocity);
    const positionDiff = e1.position.minus(e2.position);

    const hit =
      Math.abs(positionDiff.x) < combinedHalfSize.x &&
      Math.abs(positionDiff.y) < combinedHalfSize.y;

    if (!hit) return new HPCollision();

    const penetration = HPCollisionDetector.getPenetrationVector(
      positionDiff,
      velocityDiff,
      combinedHalfSize,
    );
    
    let direction = (penetration.x > penetration.y)
      ? velocityDiff.x > 0 ? HPDirection.Right : HPDirection.Left
      : velocityDiff.y > 0 ? HPDirection.Down : HPDirection.Up;

    return new HPCollision(direction);
  }

  private static getPenetrationVector(
    positionDiff: HPVector,
    velocityDiff: HPVector,
    combinedHalfSize: HPVector,
  ) {
    return new HPVector(
      HPCollisionDetector.getPenetrationScalar(positionDiff.x, velocityDiff.x, combinedHalfSize.x),
      HPCollisionDetector.getPenetrationScalar(positionDiff.y, velocityDiff.y, combinedHalfSize.y),
    );
  }

  private static getPenetrationScalar(
    positionDiff: number,
    velocityDiff: number,
    combinedHalfSize: number,
  ) {
    const p = velocityDiff > 0
      ? combinedHalfSize + positionDiff
      : combinedHalfSize - positionDiff;
    return 1 / Math.abs(p - Math.abs(velocityDiff));
  }

}
