import { loader, extras } from "pixi.js";
import PIXIEntity from "../../engine/pixi/pixi-entity";
import Vector from "../../engine/core/vector";
import Direction from "../../engine/core/direction";
import Entity from "../../engine/core/entity";
import Collision from "../../engine/core/collision";
import EntityType from "../../engine/core/entity-type";

const TEXTURES_FILE = "public/imgs/ogre.json";

export default class Ogre extends PIXIEntity {

  static assets = [TEXTURES_FILE];

  get size() { return new Vector(44, 96); }
  get isGravityBound() { return true; }
  get isWallBound() { return true; }
  get isWall() { return true; }

  static get _textures() {
    const textures = loader.resources[TEXTURES_FILE].textures;
    if (!textures) throw "Can't find textures for Ogre!!";
    return textures;
  }

  static get _runTextures() { return [
    Ogre._textures["ogre__run-1.png"],
    Ogre._textures["ogre__run-2.png"],
    Ogre._textures["ogre__run-3.png"],
    Ogre._textures["ogre__run-2.png"],
  ]; }

  static get _swipeAttackTextures() { return [
    Ogre._textures["ogre__swipe-attack-1.png"],
    Ogre._textures["ogre__swipe-attack-2.png"],
    Ogre._textures["ogre__swipe-attack-3.png"],
    Ogre._textures["ogre__swipe-attack-2.png"],
  ]; }

  static runSpeed = 0.1;
  static runAnimationSpeed = 0.1;
  static swipeAttackSpeed = 0.0666;
  static swipeAttackAnimationSpeed = 0.0666;

  private _runForce: Vector;
  private _isAttacking = false;

  get sprite() { return <extras.AnimatedSprite>this._sprite; }

  constructor(position: Vector) {
    super(
      new extras.AnimatedSprite(Ogre._runTextures),
      position,
    );

    this.sprite.animationSpeed = Ogre.runAnimationSpeed;
    this.sprite.gotoAndPlay(0);

    this._runForce = new Vector(Ogre.runSpeed, 0);
    if (Math.random() < Ogre.runSpeed) this._turnLeft();
  }

  afterTick() {
    if (this.isTouchingWallsInAllDirections([Direction.Right])) {
      this._turnLeft();
    }

    if (this.isTouchingWallsInAllDirections([Direction.Left])) {
      this._turnRight();
    }

    if (this.isTouchingWallsInAllDirections([Direction.Down])) {
      this.push(this._runForce);
    }
  }

  onCollision(otherEntity: Entity, collision: Collision) {
    super.onCollision(otherEntity, collision);

    if (otherEntity.type === EntityType.Friendly) {
      this._swipeAttack();
    }
  }

  _turnRight() {
    this.velocity = this.velocity.withNewY(0);
    this._runForce = new Vector(Ogre.runSpeed, 0);
    this.sprite.scale.x = 1;
  }

  _turnLeft() {
    this.velocity = this.velocity.withNewY(0);
    this._runForce = new Vector(-Ogre.runSpeed, 0);
    this.sprite.scale.x = -1;
  }

  _swipeAttack() {
    if (this._isAttacking) return;
    this._isAttacking = true;

    if (this._runForce.x > 0) {
      this._runForce = new Vector(Ogre.swipeAttackSpeed, 0);
    } else {
      this._runForce = new Vector(-Ogre.swipeAttackSpeed, 0);
    }

    const numAttacks = Math.ceil(Math.random() * 2);
    let currentNumAttacks = 0;

    this.sprite.animationSpeed = Ogre.swipeAttackAnimationSpeed;
    this.sprite.textures = Ogre._swipeAttackTextures;
    this.sprite.loop = true;
    this.sprite.onLoop = () => {
      currentNumAttacks++;

      if (currentNumAttacks < numAttacks) return;

      this.sprite.animationSpeed = Ogre.runAnimationSpeed;
      this.sprite.textures = Ogre._runTextures;
      this.sprite.loop = true;
      this.sprite.onLoop = () => {};
      this.sprite.gotoAndPlay(0);

      if (this._runForce.x > 0) {
        this._runForce = new Vector(Ogre.runSpeed, 0);
      } else {
        this._runForce = new Vector(-Ogre.runSpeed, 0);
      }

      this._isAttacking = false;
    };
    this.sprite.gotoAndPlay(0);
  }

}
