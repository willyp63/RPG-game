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
const DIE_ANIMATION_SPEED = 0.1;

const WALK_FORCE = new Vector(0.05, 0);
const SIZE = new Vector(15, 33);
const ALERT_DISTANCE = 120;
const ATTACK_ALERT_DISTANCE = 24;
const ATTACK_POSITION = new Vector(12, 0);
const MAX_HEALTH = 30;
const REVIVE_TIME = 8000;
const CHANGE_DIRECTION_RECHARGE_TICKS = 40;
const ATTACK_RECHARGE_TICKS = 60;

export default class Skeleton extends AnimatedPIXIEntity {

  get type() { return this._isDead ? EntityType.Neutral : EntityType.Unfriendly; }
  get size() { return SIZE; }
  get maxHealth() { return MAX_HEALTH; }
  get isGravityBound() { return true; }
  get isWallBound() { return true; }
  get isSolidBound() { return !this._isDead; }
  get isFrictionBound() { return true; }

  static assets = [TEXTURES_FILE];

  static get _walkTextures() { return [
    TextureHelper.get(TEXTURES_FILE, "skeleton__walk-1.png"),
    TextureHelper.get(TEXTURES_FILE, "skeleton__walk-2.png"),
    TextureHelper.get(TEXTURES_FILE, "skeleton__walk-3.png"),
    TextureHelper.get(TEXTURES_FILE, "skeleton__walk-2.png"),
  ]; }

  static get _attackTextures() { return [
    TextureHelper.get(TEXTURES_FILE, "skeleton__attack-1.png"),
    TextureHelper.get(TEXTURES_FILE, "skeleton__attack-2.png"),
  ]; }

  static get _dieTextures() { return [
    TextureHelper.get(TEXTURES_FILE, "skeleton__die-1.png"),
    TextureHelper.get(TEXTURES_FILE, "skeleton__die-2.png"),
    TextureHelper.get(TEXTURES_FILE, "skeleton__die-3.png"),
  ]; }

  static get _reviveTextures() { return [
    TextureHelper.get(TEXTURES_FILE, "skeleton__die-2.png"),
    TextureHelper.get(TEXTURES_FILE, "skeleton__die-1.png"),
    TextureHelper.get(TEXTURES_FILE, "skeleton__walk-2.png"),
  ]; }

  private _walkForce = new Vector(0, 0);
  private _isAttacking = false;
  private _changeDirectionTicker = 0;
  private _attackRechargeTicker = 0;

  constructor(position: Vector, private _isDead = false) {
    super(position, Skeleton._walkTextures);

    if (_isDead) {
      setTimeout(this._onDieAnimationComplete.bind(this), 0);
    } else {
      Math.random() < 0.5 ? this._walkLeft() : this._walkRight();
    }
  }

  afterTick() {
    super.afterTick();

    if (this._isDead) return;

    if (this.isTouchingWallsInAllDirections([Direction.Right])) {
      this._walkLeft();
    }

    if (this.isTouchingWallsInAllDirections([Direction.Left])) {
      this._walkRight();
    }

    if (this.isTouchingWallsInAllDirections([Direction.Down])) {
      this.push(this._walkForce);
    }

    if (this._changeDirectionTicker > 0) this._changeDirectionTicker--;
    if (this._attackRechargeTicker > 0) this._attackRechargeTicker--;
  }

  onCollision(otherEntity: Entity, collision: Collision) {
    super.onCollision(otherEntity, collision);

    if (this._isDead) return;

    if (otherEntity.type === EntityType.Friendly) {

      const distanceToOtherEntity = this.position.minus(otherEntity.position).length;
      const isFacingOtherEntity =
        (this.isFacingLeft && otherEntity.position.x < this.position.x) ||
        (!this.isFacingLeft && otherEntity.position.x > this.position.x);

      if (isFacingOtherEntity && distanceToOtherEntity < ATTACK_ALERT_DISTANCE) {
        if (this._attackRechargeTicker <= 0) {
          this._attackRechargeTicker = ATTACK_RECHARGE_TICKS;

          this._attack();
        }
      } else if (!isFacingOtherEntity && distanceToOtherEntity < ALERT_DISTANCE) {
        if (this._changeDirectionTicker <= 0) {
          this._changeDirectionTicker = CHANGE_DIRECTION_RECHARGE_TICKS;

          if (this.isFacingLeft) this._walkRight();
          else this._walkLeft();
        }
      }
    }
  }

  kill() {
    this._walkForce = new Vector(0, 0);
    this._isAttacking = false;
    this._isDead = true;

    this.animation =
      new PIXIAnimation(Skeleton._dieTextures)
        .speed(DIE_ANIMATION_SPEED)
        .onLoop(this._onDieAnimationComplete.bind(this));
  }

  _onDieAnimationComplete() {
    if (this._healthBar) this._healthBar.alpha = 0;

    this.animation =
      new PIXIAnimation(Skeleton._dieTextures)
        .stopOn(2);

    setTimeout(this._revive.bind(this), REVIVE_TIME);
  }

  _revive() {
    this.animation =
      new PIXIAnimation(Skeleton._reviveTextures)
        .speed(DIE_ANIMATION_SPEED)
        .onLoop(this._onReviveAnimationComplete.bind(this));
  }

  _onReviveAnimationComplete() {
    this._isDead = false;
    this.heal(this.maxHealth);
    if (this._healthBar) this._healthBar.alpha = 1;

    if (this.isFacingLeft) this._walkLeft();
    else this._walkRight();
  }

  _walkRight() {
    this._walkForce = WALK_FORCE;
    this._isAttacking = false;

    this.animation =
      new PIXIAnimation(Skeleton._walkTextures)
        .speed(WALK_ANIMATION_SPEED)
        .flippedHorizontally(false);
  }

  _walkLeft() {
    this._walkForce = WALK_FORCE.flippedHorizontally();
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
        .onLoop(this._onAttackComplete.bind(this));
  }

  _onAttackComplete() {
    if (this._isDead) return;

    this.addEntityToSystem(new SkeletonAttack(
      this.position.plus(ATTACK_POSITION.flippedHorizontally(this.isFacingLeft)),
      this,
    ));

    this._isAttacking = false;

    if (this.isFacingLeft) this._walkLeft();
    else this._walkRight();
  }

}
