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

    const hit = Math.abs(positionDiff.x) < combinedHalfSize.x && Math.abs(positionDiff.y) < combinedHalfSize.y;

    if (!hit) return new Collision(false);

    // determine direction of collision
    let direction;

    const penetration = Collision._getPenetrationVector(combinedHalfSize, positionDiff, velocityDiff, r1, r2);
    
    if (penetration.x === 0 && penetration.y === 0) {
      direction = undefined;
    } else if (penetration.x > penetration.y) {
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
    if (direction && recedeRect) Collision._recedeFirstRect(r1, r2, direction, combinedHalfSize);

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
    const c = ramp.position.y - 3 - (rampSlope * ramp.position.x);
    const distToRamp = (a * cornerPointToTest.x + b * cornerPointToTest.y + c) / Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));

    const hit = distToRamp < 0;

    if (hit && recedeRect) {
      Collision._recedeRectFromRamp(rect, ramp, distToRamp, rampSlope);
    }

    return new Collision(hit, Direction.Down);
  }

  static _recedeRectFromRamp(
    rect: Rect,
    ramp: Ramp,
    distToRamp: number,
    rampSlope: number,
  ) {
    let displacement = new Vector(1, rampSlope / -1).toUnitVector().scaled(-distToRamp);
    if (ramp.orientation === RampOrientation.TopRightToBottomLeft) displacement = displacement.scaled(-1);
    rect.position = rect.position.plus(displacement);
  }

  static _recedeFirstRect(
    r1: Rect,
    r2: Rect,
    direction: Direction,
    combinedHalfSize: Vector,
  ) {
    switch (direction) {
      case Direction.Up:
        r1.position = r1.position.withNewY(r2.position.y + combinedHalfSize.y);
        break;
      case Direction.Right:
        r1.position = r1.position.withNewX(r2.position.x - combinedHalfSize.x);
        break;
      case Direction.Down:
        r1.position = r1.position.withNewY(r2.position.y - combinedHalfSize.y);
        break;
      case Direction.Left:
        r1.position = r1.position.withNewX(r2.position.x + combinedHalfSize.x);
        break;
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

    if (velocityDiff.x === 0) penetrationX = 0;
    else if (velocityDiff.x > 0 ) penetrationX = (combinedHalfSize.x + positionDiff.x);
    else penetrationX = (combinedHalfSize.x - positionDiff.x);
    
    if (velocityDiff.y === 0) penetrationY = 0;
    else if (velocityDiff.y > 0 ) penetrationY = (combinedHalfSize.y + positionDiff.y);
    else penetrationY = (combinedHalfSize.y - positionDiff.y);

    if (penetrationX === 0 || penetrationX > Math.abs(velocityDiff.x) + 0.001) penetrationX = 0;
    else penetrationX /= Math.abs(velocityDiff.x);

    if (penetrationY === 0 || penetrationY > Math.abs(velocityDiff.y) + 0.001) penetrationY = 0;
    else penetrationY /= Math.abs(velocityDiff.y);

    if (penetrationX === 0 && penetrationY === 0) {
      console.log('here');
    }

    console.log(penetrationX);
    console.log(penetrationY);

    return new Vector(penetrationX, penetrationY);
  }
  
}
