import { Container } from "pixi.js";
import HPEntity from "../physics/entity";
import HPVector from "../physics/vector";
import HPCollision from "../physics/collision";
import HPWallContactMap from "../physics/wall-contact-map";

export default abstract class HPActor implements HPEntity {

  /* @override */
  abstract get sprite(): Container;
  abstract get size(): HPVector;
  get isWall() { return false; }
  get isWallBound() { return false; }
  get isGravityBound() { return false; }
  get isAirFrictionBound() { return false; }
  get bounciness() { return 0.5; }
  get slipperiness() { return 0.5; }
  get weight() { return 1; }
  get maxVelocity() { return 64; }

  /* @override */
  onTick() { }
  onCollision(actor: HPActor, collision: HPCollision) { }

  velocity = HPVector.Zero;
  acceleration = HPVector.Zero;

  wallContact = new HPWallContactMap();

  isDead = false;
  newBornActors: Array<HPActor> = [];

  constructor(
    public position: HPVector,
  ) { }

  beforeTick() {
    this.velocity = this.velocity.plus(this.acceleration).capped(this.maxVelocity);
    this.position = this.position.plus(this.velocity);
    this.acceleration = HPVector.Zero;
    this.wallContact = new HPWallContactMap();

    // align sprite
    this.sprite.x = this.position.x;
    this.sprite.y = this.position.y;
  }

  push(force: HPVector) {
    this.acceleration = this.acceleration.plus(force.times(1 / this.weight));
  }

  kill() {
    this.isDead = true;
  }

}
