import { Container } from "pixi.js";
import HPEntity from "../physics/entity";
import HPVector from "../physics/vector";
import HPCollision from "../physics/collision";
import HPWallContactMap from "../physics/wall-contact-map";
import HPActorType from "./actor-type";
import HPDirection from "../physics/direction";
import HPDestroyable from "../util/destroyer";
import HPHealthBar from "./health-bar";

export default abstract class HPActor implements HPEntity, HPDestroyable {

  /** @override */
  get type() { return HPActorType.Nuetral; }
  get bounciness() { return 0.2; }
  get slipperiness() { return 0.2; }
  get size() { return HPVector.Zero; }
  get weight() { return 1; }
  get maxVelocity() { return 64; }
  get isWall() { return false; }
  get isWallBound() { return true; }
  get gravityBoundCoefficient() { return 1; }
  get isAirFrictionBound() { return true; }
  get airWalkCoefficient() { return 0.066; }
  get hasHealth() { return false; }
  get maxHealth() { return 0; }
  get hideHealthBar() { return false; }

  velocity = HPVector.Zero;
  acceleration = HPVector.Zero;
  moveForce = HPVector.Zero;
  facingDirection = HPDirection.Right;
  wallContact = new HPWallContactMap();
  isOnGround = false;
  isDead = false;
  newBornActors: Array<HPActor> = [];
  healthBar = new HPHealthBar();
  health = 0;

  constructor(
    public position: HPVector,
    public sprite: Container,
  ) { }

  /** @override */
  init() {
    this.health = this.maxHealth;
    this.initHealthBar();
  }
  destroy() { }
  onCollision(actor: HPActor, collision: HPCollision) { }

  /** @override */
  onTick() {
    this.sprite.x = this.position.x;
    this.sprite.y = this.position.y;

    this.isOnGround = this.wallContact.all([HPDirection.Down]);
    this.push(this.isOnGround ? this.moveForce : this.moveForce.times(this.airWalkCoefficient));
  }

  beforeTick() {
    this.velocity = this.velocity.plus(this.acceleration).limit(this.maxVelocity);
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

  damage(amount: number) {
    this.health = Math.max(0, this.health - amount);
    this.healthBar.percent = this.healthPercent;
  }

  heal(amount: number) {
    this.health = Math.min(this.maxHealth, this.health + amount);
    this.healthBar.percent = this.healthPercent;
  }

  kill() {
    this.isDead = true;
  }

  get isFacingLeft() { return this.facingDirection === HPDirection.Left; }

  private initHealthBar() {
    if (!this.hasHealth || this.hideHealthBar) return;

    this.healthBar.position = new HPVector(0, this.size.y * -2 / 3);
    this.sprite.addChild(this.healthBar.sprite);
  }

  private get healthPercent() {
    return this.health / this.maxHealth;
  }

}
