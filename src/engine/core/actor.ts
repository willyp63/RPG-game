import { Container } from "pixi.js";
import HPEntity from "../physics/entity";
import HPVector from "../physics/vector";
import HPCollision from "../physics/collision";
import HPWallContactMap from "../physics/wall-contact-map";
import HPActorType from "./actor-type";
import HPDirection from "../physics/direction";
import HPDestroyable from "../util/destroyer";

export interface HPActorOptions {
  type: HPActorType;
  bounciness: number;
  slipperiness: number;
  weight: number;
  maxVelocity: number;
  isWall: boolean;
  isWallBound: boolean;
  isGravityBound: boolean;
  isAirFrictionBound: boolean;
  airWalkCoefficient: number;
}

export interface HPActorArgs {
  type?: HPActorType;
  bounciness?: number;
  slipperiness?: number;
  weight?: number;
  maxVelocity?: number;
  isWall?: boolean;
  isWallBound?: boolean;
  isGravityBound?: boolean;
  isAirFrictionBound?: boolean;
  airWalkCoefficient?: number;
}

export const HPActorDefaultOptions: HPActorOptions = {
  type: HPActorType.Nuetral,
  bounciness: 0.2,
  slipperiness: 0.2,
  weight: 1,
  maxVelocity: 64,
  isWall: false,
  isWallBound: true,
  isGravityBound: true,
  isAirFrictionBound: true,
  airWalkCoefficient: 0.066,
};

export default abstract class HPActor implements HPEntity, HPDestroyable {

  size: HPVector;

  position: HPVector;
  velocity = HPVector.Zero;
  acceleration = HPVector.Zero;

  sprite: Container;

  moveForce = HPVector.Zero;
  facingDirection = HPDirection.Right;

  wallContact = new HPWallContactMap();
  isOnGround = false;

  isDead = false;
  newBornActors: Array<HPActor> = [];

  type: HPActorType;
  bounciness: number;
  slipperiness: number;
  weight: number;
  maxVelocity: number;
  isWall: boolean;
  isWallBound: boolean;
  isGravityBound: boolean;
  isAirFrictionBound: boolean;
  airWalkCoefficient: number;

  constructor(
    _position: HPVector,
    _size: HPVector,
    _sprite: Container,
    _options: HPActorArgs,
  ) {
    this.position = _position;
    this.size = _size;
    this.sprite = _sprite;

    const options = Object.assign({}, HPActorDefaultOptions, _options);
    this.type = options.type;
    this.bounciness = options.bounciness;
    this.slipperiness = options.slipperiness;
    this.weight = options.weight;
    this.maxVelocity = options.maxVelocity;
    this.isWall = options.isWall;
    this.isWallBound = options.isWallBound;
    this.isGravityBound = options.isGravityBound;
    this.isAirFrictionBound = options.isAirFrictionBound;
    this.airWalkCoefficient = options.airWalkCoefficient;
  }

  /* @override */
  init() { }
  destroy() { }
  onCollision(actor: HPActor, collision: HPCollision) { }

  /* @override */
  onTick() {
    this.sprite.x = this.position.x;
    this.sprite.y = this.position.y;

    this.isOnGround = this.wallContact.all([HPDirection.Down]);
    this.push(this.isOnGround ? this.moveForce : this.moveForce.times(this.airWalkCoefficient));
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
