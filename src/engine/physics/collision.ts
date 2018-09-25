import Vector from "./vector";
import Direction from "./direction";
import Ramp, { RampOrientation } from "./ramp";
import { Rect } from ".";

export default class Collision {

  constructor(
    public hit: boolean,
    public direction?: Direction,
  ) { }

  static between(
    r1: Rect,
    r2: Rect,
    recedeRect: boolean = false,
  ): Collision {
    if (r2 instanceof Ramp) {
      return this._rectHitsRamp(r1, <Ramp>r2, recedeRect);
    } else {
      return this._rectHitsRect(r1, r2, recedeRect);
    }
  }

  static _rectHitsRect(
    r1: Rect,
    r2: Rect,
    recedeRect: boolean,
  ): Collision {

    const r1HalfSize = r1.size.scaled(0.5);
    const r2HalfSize = r2.size.scaled(0.5);
    const combinedHalfSize = r1HalfSize.plus(r2HalfSize);
    const velocityDiff = r1.velocity.minus(r2.velocity);
    const positionDiff = r1.position.minus(r2.position);

    const hit = Math.abs(positionDiff.x) <= combinedHalfSize.x && Math.abs(positionDiff.y) <= combinedHalfSize.y;

    if (!hit) return new Collision(false);

    // determine direction of collision
    let direction;

    const penetration = Collision._getPenetrationVector(combinedHalfSize, positionDiff, velocityDiff, r1, r2);
    
    if (penetration.x > penetration.y) {
      if (velocityDiff.x > 0) {
        direction = Direction.Right;
      } else {
        direction = Direction.Left;
      }
    } else {
      if (velocityDiff.y > 0) {
        direction = Direction.Down;
      } else {
        direction = Direction.Up;
      }
    }

    // recede if need be
    if (direction !== undefined && recedeRect) {
      Collision._recedeFirstRect(r1, r2, direction, combinedHalfSize);
    }

    return new Collision(hit, direction);
  }

  static _rectHitsRamp(
    rect: Rect,
    ramp: Ramp, 
    recedeRect: boolean,
  ): Collision {

    const rectHalfSize =  rect.size.scaled(0.5);
    const rampHalfSize =  ramp.size.scaled(0.5);

    let cornerPointToTest = rect.position.plus(
      new Vector(
        ramp.orientation === RampOrientation.TopLeftToBottomRight ? -rectHalfSize.x : rectHalfSize.x,
        rectHalfSize.y,
      )
    );

    // test 2 grid-aligned sides first
    if (cornerPointToTest.y > ramp.position.y + rampHalfSize.y) return new Collision(false);
    if (ramp.orientation === RampOrientation.TopLeftToBottomRight && cornerPointToTest.x < ramp.position.x - rampHalfSize.x) return new Collision(false);
    if (ramp.orientation === RampOrientation.TopRightToBottomLeft && cornerPointToTest.x > ramp.position.x + rampHalfSize.x) return new Collision(false);

    let rampSlope = ramp.size.y / ramp.size.x;
    if (ramp.orientation === RampOrientation.TopRightToBottomLeft) rampSlope *= -1;

    // calc dist from test point to ramp
    const a = rampSlope;
    const b = -1;
    const c = ramp.position.y - (rampSlope * ramp.position.x);
    const distToRamp = (a * cornerPointToTest.x + b * cornerPointToTest.y + c) / Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));

    const hit = distToRamp <= 0;

    if (hit && recedeRect) {
      const newY = a * (cornerPointToTest.x - ramp.position.x) + ramp.position.y;
      rect.position = rect.position.plus(new Vector(0, newY - cornerPointToTest.y));
    }

    return new Collision(hit, Direction.Down);
  }

  static _recedeFirstRect(
    r1: Rect,
    r2: Rect,
    direction: Direction,
    combinedHalfSize: Vector,
  ) {
    if (direction === Direction.Up) {
      r1.position = r1.position.withNewY(r2.position.y + combinedHalfSize.y);
    } else if (direction === Direction.Right) {
      r1.position = r1.position.withNewX(r2.position.x - combinedHalfSize.x);
    } else if (direction === Direction.Down) {
      r1.position = r1.position.withNewY(r2.position.y - combinedHalfSize.y);
    } else if (direction === Direction.Left) {
      r1.position = r1.position.withNewX(r2.position.x + combinedHalfSize.x);
    }
  }

  static _getPenetrationVector(
    combinedHalfSize: Vector,
    positionDiff: Vector,
    velocityDiff: Vector,
    r1: Rect,
    r2: Rect,
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
