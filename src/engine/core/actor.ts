import { Container } from "pixi.js";
import HPEntity from "../physics/entity";
import HPVector from "../physics/vector";
import HPCollision from "../physics/collision";
import HPWallContactMap from "../physics/wall-contact-map";
import HPActorType from "./actor-type";
import HPDirection from "../physics/direction";

export default abstract class HPActor implements HPEntity {

  /* @override */
  abstract get sprite(): Container;
  abstract get size(): HPVector;
  get type() { return HPActorType.Nuetral; }
  get isWall() { return false; }
  get isWallBound() { return false; }
  get isGravityBound() { return false; }
  get isAirFrictionBound() { return false; }
  get canWalkOnAir() { return false; }
  get bounciness() { return 0.2; }
  get slipperiness() { return 0.2; }
  get weight() { return 1; }
  get maxVelocity() { return 64; }

  /* @override */
  init() { }
  destroy() { }
  onCollision(actor: HPActor, collision: HPCollision) { }

  velocity = HPVector.Zero;
  acceleration = HPVector.Zero;

  moveForce = HPVector.Zero;
  facingDirection = HPDirection.Right;

  wallContact = new HPWallContactMap();
  isOnGround = false;

  isDead = false;
  newBornActors: Array<HPActor> = [];

  constructor(
    public position: HPVector,
  ) { }

  /* @override */
  onTick() {
    this.sprite.x = this.position.x;
    this.sprite.y = this.position.y;

    this.isOnGround = this.wallContact.all([HPDirection.Down]);
    if (this.isOnGround || this.canWalkOnAir) this.push(this.moveForce);
  }

  beforeTick() {
    this.velocity = this.velocity.plus(this.acceleration).capped(this.maxVelocity);
    this.position = this.position.plus(this.velocity);
    this.acceleration = HPVector.Zero;
    this.wallContact = new HPWallContactMap();
  }

  move(moveForce: HPVector, faceMoveDirection = true) {
    this.moveForce = moveForce;

    if (faceMoveDirection && moveForce.x !== 0) {
      this.facingDirection = moveForce.x < 0 ? HPDirection.Left : HPDirection.Right;
    }
  }

  push(force: HPVector) {
    this.acceleration = this.acceleration.plus(force.times(1 / this.weight));
  }

  kill() {
    this.isDead = true;
  }

  get isFacingLeft() { return this.facingDirection === HPDirection.Left; }

}
