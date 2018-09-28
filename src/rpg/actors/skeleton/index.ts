import AnimatedPIXIEntity from "../../../engine/pixi/animated-pixi-entity";
import Vector from "../../../engine/core/vector";
import Direction from "../../../engine/core/direction";
import EntityType from "../../../engine/core/entity-type";
import TextureHelper from "../../../engine/pixi/texture-helper";
import Entity from "../../../engine/core/entity";
import Collision from "../../../engine/core/collision";
import SkeletonAttack from "./attacks/skeleton-attack";

const TEXTURES_FILE = "public/imgs/skeleton.json";
const WALK_ANIMATION_SPEED = 0.1;
const WALK_FORCE_X = 0.05;
const ATTACK_ANIMATION_SPEED = 0.1;

export default class Skeleton extends AnimatedPIXIEntity {

  get type() { return EntityType.Unfriendly; }
  get size() { return new Vector(15, 35); }
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

  private _walkForce = new Vector(0, 0);
  private _isFacingLeft = false;
  private _isAttacking = false;

  constructor(position: Vector) {
    super(position, Skeleton._walkTextures);

    Math.random() < 0.5
      ? this._walkLeft()
      : this._walkRight();
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
      const isFacingOtherEntity =
        (this._isFacingLeft && otherEntity.position.x < this.position.x) ||
        (!this._isFacingLeft && otherEntity.position.x > this.position.x);

      if (isFacingOtherEntity) {
        const distanceToOtherEntity = this.position.minus(otherEntity.position).length;

        if (distanceToOtherEntity < 24) {
          this._attack();
        }
      }
    }
  }

  _walkRight() {
    this._walkForce = new Vector(WALK_FORCE_X, 0);
    this.sprite.scale.x = 1;
    this.sprite.animationSpeed = WALK_ANIMATION_SPEED;
    this.sprite.textures = Skeleton._walkTextures;
    this.sprite.loop = true;
    this.sprite.gotoAndPlay(0);
    this._isFacingLeft = false;
  }

  _walkLeft() {
    this._walkForce = new Vector(-WALK_FORCE_X, 0);
    this.sprite.scale.x = -1;
    this.sprite.animationSpeed = WALK_ANIMATION_SPEED;
    this.sprite.textures = Skeleton._walkTextures;
    this.sprite.loop = true;
    this.sprite.gotoAndPlay(0);
    this._isFacingLeft = true;
  }

  _attack () {
    if (this._isAttacking) return;
    this._isAttacking = true;

    this._walkForce = new Vector(0, 0);
    this.sprite.animationSpeed = ATTACK_ANIMATION_SPEED;
    this.sprite.textures = Skeleton._attackTextures;
    this.sprite.loop = false;
    this.sprite.play();

    this.sprite.onComplete = () => {

      this.addEntityToSystem(new SkeletonAttack(
        new Vector(
          this._isFacingLeft ? this.position.x - 12 : this.position.x + 12,
          this.position.y,
        ),
        this,
      ));

      this.sprite.onComplete = () => {};
      this._isAttacking = false;

      if (this._isFacingLeft) this._walkLeft();
      else this._walkRight();
    };
  }

}
