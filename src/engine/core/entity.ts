import Vector from "./vector";
import EntityType from "./entity-type";
import Shape from "./shape";
import Direction, { oppositeDirection } from "./direction";
import Collision from "./collision";
import CollisionDetector from "./collision-detector";
import WallReceder from "./wall-receder";

const DEFAULT_WEIGHT = 1;
const DEFAULT_MAX_VELOCITY = 16;
const DEFAULT_FRICTION_COEFFICIENT = 0.1333;
const DEFAULT_ELASTICITY = 0.2;

export default abstract class Entity {

  get type() { return EntityType.Neutral; }
  get size() { return new Vector(0, 0); }
  get shape() { return Shape.Rect; }
  get weight() { return DEFAULT_WEIGHT; }
  get frictionCoefficient() { return DEFAULT_FRICTION_COEFFICIENT; }
  get elasticity() { return DEFAULT_ELASTICITY; }
  get maxVelocity() { return DEFAULT_MAX_VELOCITY; }
  get isWall() { return false; }
  get isWallBound() { return false; }
  get isGravityBound() { return false; }

  public velocity = new Vector(0, 0);
  public acceleration = new Vector(0, 0);

  public isDead = false;
  public entitiesToAdd: Array<Entity> = [];
  public touchingWallInDirection: {
    [Direction.Up]?: Entity,
    [Direction.Down]?: Entity,
    [Direction.Right]?: Entity,
    [Direction.Left]?: Entity,
  } = {};

  constructor(
    public position: Vector,
  ) { }

  /* --- public --- */
  public push(force: Vector) {
    this.acceleration = this.acceleration.plus(force.scaled(1 / this.weight));
  }

  public kill() {
    this.isDead = true;
  }

  public isTouchingWallInAnyDirection(directions: Array<Direction>): boolean {
    return directions.some(direction => this.touchingWallInDirection[direction] !== undefined);
  }

  public isTouchingWallsInAllDirections(directions: Array<Direction>): boolean {
    return directions.every(direction => this.touchingWallInDirection[direction] !== undefined);
  }

  public onTick() {
    this.velocity = this.velocity.plus(this.acceleration).capped(this.maxVelocity);
    this.position = this.position.plus(this.velocity);

    this.acceleration = new Vector(0, 0);
    this.touchingWallInDirection = {};
  }

  public afterTick() { }

  public onCollision(otherEntity: Entity, collision: Collision) {
    if (collision.hit) {

      // wall physics
      if (this.isWall && otherEntity.isWallBound) {

        // recede from walls
        if (CollisionDetector.isRamp(this)) {
          WallReceder.recedeEntityFromRampWallCollision(otherEntity, this);
        } else {
          WallReceder.recedeEntityFromRectWallCollision(otherEntity, this, collision.withOppositeDirection());
        }

        // floor friction
        if (collision.direction === Direction.Up || collision.direction === Direction.Down) {
          otherEntity.push(new Vector((this.velocity.x - otherEntity.velocity.x) * this.frictionCoefficient, 0));
        }

        // bounce off walls
        const combinedElasticity = (this.elasticity + otherEntity.elasticity) / 2;
        if (collision.direction === Direction.Up) {
          otherEntity.velocity = otherEntity.velocity.withNewY(Math.min(this.velocity.y, otherEntity.velocity.y * -combinedElasticity));
        } else if (collision.direction === Direction.Right) {
          otherEntity.velocity = otherEntity.velocity.withNewX(Math.max(this.velocity.x, otherEntity.velocity.x * -combinedElasticity));
        } else if (collision.direction === Direction.Down) {
          otherEntity.velocity = otherEntity.velocity.withNewY(Math.max(this.velocity.y, otherEntity.velocity.y * -combinedElasticity));
        } else if (collision.direction === Direction.Left) {
          otherEntity.velocity = otherEntity.velocity.withNewX(Math.min(this.velocity.x, otherEntity.velocity.x * -combinedElasticity));
        }

        // track touching walls
        otherEntity.touchingWallInDirection[oppositeDirection(collision.direction)] = this;
      }
    }
  }

  /* --- protected --- */
  protected addEntityToSystem(entity: Entity) {
    this.entitiesToAdd.push(entity);
  }

}
