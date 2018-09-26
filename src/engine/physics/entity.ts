import Vector from "./vector";
import EntityType from "./entity-type";
import Shape from "./shape";
import Direction from "./direction";
import Collision from "./collision";
import CollisionDetector from "./collision-detector";
import WallReceder from "./wall-receder";

const DEFAULT_WEIGHT = 1;
const DEFAULT_MAX_VELOCITY = 16;

export default class Entity {

  get type() { return EntityType.Neutral; }
  get size() { return new Vector(0, 0); }
  get shape() { return Shape.Rect; }
  get weight() { return DEFAULT_WEIGHT; }
  get maxVelocity() { return DEFAULT_MAX_VELOCITY; }
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
  }

  public onCollision(otherEntity: Entity, collision: Collision) {
    // wall physics
    if (collision.hit && this.type === EntityType.Wall && otherEntity.isWallBound) {
      if (CollisionDetector.isRamp(this)) {
        WallReceder.recedeEntityFromRampWallCollision(otherEntity, this);
      } else {
        WallReceder.recedeEntityFromRectWallCollision(otherEntity, this, collision);
      }
    }
  }

  /* --- protected --- */
  protected addEntityToSystem(entity: Entity) {
    this.entitiesToAdd.push(entity);
  }

}
