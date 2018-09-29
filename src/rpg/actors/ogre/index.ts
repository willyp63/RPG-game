import AnimatedPIXIEntity from "../../../engine/pixi/animated-pixi-entity";
import Vector from "../../../engine/core/vector";
import Direction from "../../../engine/core/direction";
import Entity from "../../../engine/core/entity";
import Collision from "../../../engine/core/collision";
import EntityType from "../../../engine/core/entity-type";
import TextureHelper from "../../../engine/pixi/texture-helper";
import OgreSwipeAttack from "./attacks/ogre-swipe-attack";
import PIXIAnimation from "../../../engine/pixi/pixi-animation";

const TEXTURES_FILE = "public/imgs/ogre.json";
const RUN_ANIMATION_SPEED = 0.1;
const SWIPE_ATTACK_ANIMATION_SPEED = 0.0666;

const RUN_FORCE = new Vector(0.1, 0);
const SWIPE_ATTACK_POSITION = new Vector(48, 16);
const MAX_NUM_SWIPE_ATTACKS = 2;
const SWIPE_ATTACK_ALERT_DISTANCE = 80;
const SIZE = new Vector(44, 92);
const WEIGHT = 4;
const MAX_HEALTH = 200;

export default class Ogre extends AnimatedPIXIEntity {

  get type() { return EntityType.Unfriendly; }
  get size() { return SIZE; }
  get weight() { return WEIGHT; }
  get maxHealth() { return MAX_HEALTH; }
  get isGravityBound() { return true; }
  get isWallBound() { return true; }
  get isWall() { return true; }

  static assets = [TEXTURES_FILE];

  static get _runTextures() { return [
    TextureHelper.get(TEXTURES_FILE, "ogre__run-1.png"),
    TextureHelper.get(TEXTURES_FILE, "ogre__run-2.png"),
    TextureHelper.get(TEXTURES_FILE, "ogre__run-3.png"),
    TextureHelper.get(TEXTURES_FILE, "ogre__run-2.png"),
  ]; }

  static get _swipeAttackTextures() { return [
    TextureHelper.get(TEXTURES_FILE, "ogre__swipe-attack-1.png"),
    TextureHelper.get(TEXTURES_FILE, "ogre__swipe-attack-2.png"),
    TextureHelper.get(TEXTURES_FILE, "ogre__swipe-attack-3.png"),
    TextureHelper.get(TEXTURES_FILE, "ogre__swipe-attack-2.png"),
  ]; }

  private _runForce = RUN_FORCE;
  private _isAttacking = false;
  private _numSwipeAttacks = 0;
  private _currentNumSwipeAttacks = 0;

  constructor(position: Vector) {
    super(position, Ogre._runTextures);

    Math.random() < 0.5 ? this._runLeft() : this._runRight();
  }

  afterTick() {
    super.afterTick();

    if (this.isTouchingWallsInAllDirections([Direction.Right])) {
      this._runLeft();
    }

    if (this.isTouchingWallsInAllDirections([Direction.Left])) {
      this._runRight();
    }

    if (this.isTouchingWallsInAllDirections([Direction.Down])) {
      this.push(this._runForce);
    }
  }

  onCollision(otherEntity: Entity, collision: Collision) {
    super.onCollision(otherEntity, collision);

    if (otherEntity.type === EntityType.Friendly) {

      // is facing other entity
      const isFacingOtherEntity =
        (this.isFacingLeft && otherEntity.position.x < this.position.x) ||
        (!this.isFacingLeft && otherEntity.position.x > this.position.x);
      if (isFacingOtherEntity) {

        // is close enough to attack
        const distanceToOtherEntity = this.position.minus(otherEntity.position).length;
        if (distanceToOtherEntity < SWIPE_ATTACK_ALERT_DISTANCE) {
          this._swipeAttack();
        }
      }
    }
  }

  _runRight() {
    this._runForce = RUN_FORCE;
    this._isAttacking = false;

    this.animation =
      new PIXIAnimation(Ogre._runTextures)
        .speed(RUN_ANIMATION_SPEED)
        .flippedHorizontally(false);
  }

  _runLeft() {
    this._runForce = RUN_FORCE.flippedHorizontally();
    this._isAttacking = false;

    this.animation =
      new PIXIAnimation(Ogre._runTextures)
        .speed(RUN_ANIMATION_SPEED)
        .flippedHorizontally();
  }

  _swipeAttack() {
    if (this._isAttacking) return;
    
    this._runForce = new Vector(0, 0);
    this._isAttacking = true;

    this._numSwipeAttacks = Math.ceil(Math.random() * MAX_NUM_SWIPE_ATTACKS);
    this._currentNumSwipeAttacks = 0;

    this.animation =
      new PIXIAnimation(Ogre._swipeAttackTextures)
        .speed(SWIPE_ATTACK_ANIMATION_SPEED)
        .onFrameChange(this._onSwipeAttackFrameChange.bind(this))
        .onLoop(this._onSwipeAttackComplete.bind(this));
  }

  _onSwipeAttackFrameChange(currentFrame: number) {
    if ([1, 3].includes(currentFrame)) {
      this.addEntityToSystem(new OgreSwipeAttack(
        this.position.plus(SWIPE_ATTACK_POSITION.flippedHorizontally(this.isFacingLeft)),
        this,
      ));
    }
  }
  
  _onSwipeAttackComplete() {
    this._currentNumSwipeAttacks++;
    if (this._currentNumSwipeAttacks < this._numSwipeAttacks) return;

    this._isAttacking = false;

    if (this.isFacingLeft) this._runLeft();
    else this._runRight();
  }
}
