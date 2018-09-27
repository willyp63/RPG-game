import Entity from "./entity";
import Collision from "./collision";
import Direction from "./direction";
import Vector from "./vector";
import Shape, { getRampSlope, isRamp } from "./shape";

export default class CollisionDetector {

  static detect(
    e1: Entity,
    e2: Entity,
  ): Collision {
    if (isRamp(e1)) {
      return this._rectHitsRamp(e2, e1).withOppositeDirection();
    } else if (isRamp(e2)) {
      return this._rectHitsRamp(e1, e2);
    } else {
      return this._rectHitsRect(e1, e2);
    }
  }

  /* --- private --- */
  static _rectHitsRect(
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
      CollisionDetector._getPenetrationVector(
        combinedHalfSize,
        positionDiff,
        velocityDiff,
      );
    
    let direction;
    if (penetration.x > penetration.y) {
      direction = velocityDiff.x > 0 ? Direction.Right : Direction.Left;
    } else {
      direction = velocityDiff.y > 0 ? Direction.Down : Direction.Up;
    }

    return new Collision(hit, direction);
  }

  static _rectHitsRamp(
    rect: Entity,
    ramp: Entity, 
  ): Collision {

    const rectHalfSize =  rect.size.scaled(0.5);
    const rampHalfSize =  ramp.size.scaled(0.5);

    let cornerPointToTest = rect.position.plus(
      new Vector(
        ramp.shape === Shape.DeclineRamp
          ? -rectHalfSize.x
          : rectHalfSize.x,
        rectHalfSize.y,
      )
    );

    const isOutsideGridAlignedSides =
      (cornerPointToTest.y > ramp.position.y + rampHalfSize.y) ||
      (ramp.shape === Shape.DeclineRamp && cornerPointToTest.x < ramp.position.x - rampHalfSize.x - 1) ||
      (ramp.shape === Shape.InclineRamp && cornerPointToTest.x > ramp.position.x + rampHalfSize.x + 1);
    if (isOutsideGridAlignedSides) return new Collision(false);

    const rampSlope = getRampSlope(ramp);

    // (https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line)
    const a = rampSlope;
    const b = -1;
    const c = ramp.position.y - (rampSlope * ramp.position.x);
    const distFromTestPointToRamp = (a * cornerPointToTest.x + b * cornerPointToTest.y + c) / Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));

    const hit = distFromTestPointToRamp <= 0;
    return new Collision(hit, Direction.Down);
  }

  static _getPenetrationVector(
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
