import AnimatedPIXIEntity from "../../../engine/pixi/animated-pixi-entity";
import Vector from "../../../engine/core/vector";
import Direction from "../../../engine/core/direction";
import Entity from "../../../engine/core/entity";
import Collision from "../../../engine/core/collision";
import EntityType from "../../../engine/core/entity-type";
import TextureHelper from "../../../engine/pixi/texture-helper";
import SwipeAttack from "./attacks/swipe-attack";

const TEXTURES_FILE = "public/imgs/ogre.json";
const RUN_SPEED = 0.1;
const RUN_ANIMATION_SPEED = 0.1;
const SWIPE_ATTACK_ANIMATION_SPEED = 0.0666;

export default class Ogre extends AnimatedPIXIEntity {

  get type() { return EntityType.Unfriendly; }
  get size() { return new Vector(44, 96); }
  get weight() { return 4; }
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

  private _runForce = new Vector(0, 0);
  private _isAttacking = false;
  private _isFacingLeft = false;

  constructor(position: Vector) {
    super(position, Ogre._runTextures);

    Math.random() < 0.5
      ? this._runLeft()
      : this._runRight();
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
      const isFacingOtherEntity =
        (this._isFacingLeft && otherEntity.position.x < this.position.x) ||
        (!this._isFacingLeft && otherEntity.position.x > this.position.x);

      if (isFacingOtherEntity) {
        const distanceToOtherEntity = this.position.minus(otherEntity.position).length;

        if (distanceToOtherEntity < 80) {
          this._swipeAttack();
        }
      }
    }
  }

  _runRight() {
    this._runForce = new Vector(RUN_SPEED, 0);
    this.sprite.scale.x = 1;
    this.sprite.animationSpeed = RUN_ANIMATION_SPEED;
    this.sprite.textures = Ogre._runTextures;
    this.sprite.gotoAndPlay(1);
    this._isFacingLeft = false;
  }

  _runLeft() {
    this._runForce = new Vector(-RUN_SPEED, 0);
    this.sprite.scale.x = -1;
    this.sprite.animationSpeed = RUN_ANIMATION_SPEED;
    this.sprite.textures = Ogre._runTextures;
    this.sprite.gotoAndPlay(1);
    this._isFacingLeft = true;
  }

  _swipeAttack() {
    if (this._isAttacking) return;
    this._isAttacking = true;

    const numAttacks = Math.ceil(Math.random() * 2);
    let currentNumAttacks = 0;

    this._runForce = new Vector(0, 0);
    this.sprite.animationSpeed = SWIPE_ATTACK_ANIMATION_SPEED;
    this.sprite.textures = Ogre._swipeAttackTextures;
    this.sprite.loop = true;

    this.sprite.onFrameChange = () => {
      if ([1, 3].includes(this.sprite.currentFrame)) {
        this.addEntityToSystem(new SwipeAttack(
          new Vector(
            this._isFacingLeft ? this.position.x - 48 : this.position.x + 48,
            this.position.y + 16,
          ),
          this,
        ));
      }
    };

    this.sprite.onLoop = () => {
      currentNumAttacks++;

      if (currentNumAttacks < numAttacks) return;

      this.sprite.onLoop = () => {};
      this.sprite.onFrameChange = () => {};
      this._isAttacking = false;

      if (this._isFacingLeft) this._runLeft();
      else this._runRight();
    };

    this.sprite.gotoAndPlay(0);
  }

}
