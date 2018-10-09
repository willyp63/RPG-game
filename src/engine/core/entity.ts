import Vector from "./vector";
import Direction, { oppositeDirection } from "./direction";
import Collision from "./collision";

const SOLID_FORCE_SCALE = new Vector(1.5, 0.1);
const SOLID_MAX_FORCE = new Vector(4, 4);

export enum EntityType {
  Friendly,
  Unfriendly,
  Neutral,
};

export default abstract class Entity {

  get type() { return EntityType.Neutral; }

  get size() { return Vector.zero; }
  get weight() { return 1; }
  
  get maxHealth() { return 0; }
  get maxMana() { return 0; }
  get maxEnergy() { return 0; }

  get frictionCoefficient() { return 0.133; }
  get elasticity() { return 0.1; }
  get maxVelocity() { return 16; }

  get isWall() { return false; }
  get isSolid() { return false; }
  get isWallBound() { return false; }
  get isSolidBound() { return false; }
  get isGravityBound() { return false; }
  get isFrictionBound() { return false; }

  public velocity = Vector.zero;
  public acceleration = Vector.zero;

  public health = 0;
  public mana = 0;
  public energy = 0;

  public canBeRemovedFromSystem = false;
  public entitiesToAddNextFrame: Array<Entity> = [];

  public touchingWallInDirection: {
    [Direction.Up]?: Entity,
    [Direction.Down]?: Entity,
    [Direction.Right]?: Entity,
    [Direction.Left]?: Entity,
  } = {};

  constructor(public position: Vector) { }

  init() {
    this.health = this.maxHealth;
    this.mana = this.maxMana;
    this.energy = this.maxEnergy;
  }

  destroy() { }

  onTick() {
    // update properties
    this.velocity = this.velocity.plus(this.acceleration).capped(this.maxVelocity);
    this.position = this.position.plus(this.velocity);

    // reset properties
    this.acceleration = Vector.zero;
    this.touchingWallInDirection = {};
  }

  afterTick() { }

  onCollision(otherEntity: Entity, collision: Collision) {
    if (collision.hit) {

      // wall physics
      if (this.isWall && otherEntity.isWallBound) {

        // recede from walls
        Collision.recede(otherEntity, this, collision.withOppositeDirection());

        // floor friction
        if (collision.direction === Direction.Up) {
          const velocityDiff = this.velocity.minus(otherEntity.velocity);
          otherEntity.push(new Vector(velocityDiff.x * this.frictionCoefficient, 0));

          // stick to floor when going down elevators
          if (this.velocity.y > 0) {
            otherEntity.velocity.y = this.velocity.y;
          }
        }

        // bounce off walls
        const combinedElasticity = (this.elasticity + otherEntity.elasticity) / 2;
        if (collision.direction === Direction.Up) {
          otherEntity.velocity.y = Math.min(this.velocity.y, otherEntity.velocity.y * -combinedElasticity);
        } else if (collision.direction === Direction.Right) {
          otherEntity.velocity.x = Math.max(this.velocity.x, otherEntity.velocity.x * -combinedElasticity);
        } else if (collision.direction === Direction.Down) {
          otherEntity.velocity.y = Math.max(this.velocity.y, otherEntity.velocity.y * -combinedElasticity);
        } else if (collision.direction === Direction.Left) {
          otherEntity.velocity.x = Math.min(this.velocity.x, otherEntity.velocity.x * -combinedElasticity);
        }

        // track touching walls
        otherEntity.touchingWallInDirection[oppositeDirection(collision.direction)] = this;
      }

      // solid physics
      if (this.isSolid && otherEntity.isSolidBound) {
        const combinedHalfSize = this.size.times(0.5).plus(otherEntity.size.times(0.5));
        const positionDiff = otherEntity.position.minus(this.position);
        const penetration = combinedHalfSize.length / (combinedHalfSize.length - positionDiff.length);

        let solidForce =
          positionDiff
            .toUnitVector()
            .times(penetration)
            .times(this.elasticity + otherEntity.elasticity)
            .times(SOLID_FORCE_SCALE)
            .capped(SOLID_MAX_FORCE);
        otherEntity.push(solidForce);
      }

    }
  }

  push(force: Vector) {
    this.acceleration = this.acceleration.plus(force.times(1 / this.weight));
  }

  damage(amount: number) {
    this.health = Math.max(0, this.health - amount);
    if (this.health <= 0) this.kill();
  }

  heal(amount: number) {
    this.health = Math.min(this.maxHealth, this.health + amount);
  }

  kill() {
    this.canBeRemovedFromSystem = true;
  }

  isTouchingWallInAnyDirection(directions: Array<Direction>): boolean {
    return directions.some(direction => this.touchingWallInDirection[direction] !== undefined);
  }

  isTouchingWallsInAllDirections(directions: Array<Direction>): boolean {
    return directions.every(direction => this.touchingWallInDirection[direction] !== undefined);
  }

  protected addEntityToSystem(entity: Entity) {
    this.entitiesToAddNextFrame.push(entity);
  }

}
