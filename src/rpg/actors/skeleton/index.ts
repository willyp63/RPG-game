import AnimatedPIXIEntity from "../../../engine/pixi/animated-pixi-entity";
import Vector from "../../../engine/core/vector";
import Direction from "../../../engine/core/direction";
import EntityType from "../../../engine/core/entity-type";
import TextureHelper from "../../../engine/pixi/texture-helper";
import Entity from "../../../engine/core/entity";
import Collision from "../../../engine/core/collision";
import SkeletonAttack from "./attacks/skeleton-attack";
import PIXIAnimation from "../../../engine/pixi/pixi-animation";

const TEXTURES_FILE = "public/imgs/skeleton.json";
const WALK_ANIMATION_SPEED = 0.1;
const ATTACK_ANIMATION_SPEED = 0.167;

const WALK_FORCE = new Vector(0.05, 0);
const SIZE = new Vector(15, 35);
const ALERT_DISTANCE = 120;
const ATTACK_ALERT_DISTANCE = 24;
const ATTACK_POSITION = new Vector(12, 0);
const MAX_HEALTH = 40;

export default class Skeleton extends AnimatedPIXIEntity {

  get type() { return EntityType.Unfriendly; }
  get size() { return SIZE; }
  get maxHealth() { return MAX_HEALTH; }
  get isGravityBound() { return true; }
  get isWallBound() { return true; }

  static assets = [TEXTURES_FILE];

  static get _walkTextures() { return [
    TextureHelper.get(TEXTURES_FILE, "skeleton__walk-1.png"),
    TextureHelper.get(TEXTURES_FILE, "skeleton__walk-2.png"),
    TextureHelper.get(TEXTURES_FILE, "skeleton__walk-3.png"),
  ]; }

  static get _attackTextures() { return [
    TextureHelper.get(TEXTURES_FILE, "skeleton__attack-1.png"),
    TextureHelper.get(TEXTURES_FILE, "skeleton__attack-2.png"),
  ]; }

  private _walkForce = WALK_FORCE;
  private _isFacingLeft = false;
  private _isAttacking = false;

  constructor(position: Vector) {
    super(position, Skeleton._walkTextures);

    Math.random() < 0.5 ? this._walkLeft() : this._walkRight();
  }

  afterTick() {
    super.afterTick();

    if (this.isTouchingWallsInAllDirections([Direction.Right])) {
      this._walkLeft();
    }

    if (this.isTouchingWallsInAllDirections([Direction.Left])) {
      this._walkRight();
    }

    if (this.isTouchingWallsInAllDirections([Direction.Down])) {
      this.push(this._walkForce);
    }
  }

  onCollision(otherEntity: Entity, collision: Collision) {
    super.onCollision(otherEntity, collision);

    if (otherEntity.type === EntityType.Friendly) {

      const distanceToOtherEntity = this.position.minus(otherEntity.position).length;
      const isFacingOtherEntity =
        (this._isFacingLeft && otherEntity.position.x < this.position.x) ||
        (!this._isFacingLeft && otherEntity.position.x > this.position.x);

      if (isFacingOtherEntity && distanceToOtherEntity < ATTACK_ALERT_DISTANCE) {
        this._attack();
      } else if (!isFacingOtherEntity && distanceToOtherEntity < ALERT_DISTANCE) {
        if (this._isFacingLeft) this._walkRight();
        else this._walkLeft();
      }
    }
  }

  _walkRight() {
    this._walkForce = WALK_FORCE;
    this._isFacingLeft = false;
    this._isAttacking = false;

    this.animation =
      new PIXIAnimation(Skeleton._walkTextures)
        .speed(WALK_ANIMATION_SPEED);
  }

  _walkLeft() {
    this._walkForce = WALK_FORCE.flippedHorizontally();
    this._isFacingLeft = true;
    this._isAttacking = false;

    this.animation =
      new PIXIAnimation(Skeleton._walkTextures)
        .speed(WALK_ANIMATION_SPEED)
        .flippedHorizontally();
  }

  _attack () {
    if (this._isAttacking) return;
    
    this._walkForce = new Vector(0, 0);
    this._isAttacking = true;

    this.animation =
      new PIXIAnimation(Skeleton._attackTextures)
        .speed(ATTACK_ANIMATION_SPEED)
        .flippedHorizontally(this._isFacingLeft)
        .onLoop(this._onAttackComplete.bind(this));
  }

  _onAttackComplete() {
    this.addEntityToSystem(new SkeletonAttack(
      this.position.plus(ATTACK_POSITION.flippedHorizontally(this._isFacingLeft)),
      this,
    ));

    this._isAttacking = false;

    if (this._isFacingLeft) this._walkLeft();
    else this._walkRight();
  }

}
