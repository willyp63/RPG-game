import KeyListener from "../../../engine/interaction/key-listener";
import WarriorStabAttack from "./attacks/warrior-stab-attack";
import AnimatedPIXIEntity from "../../../engine/pixi/animated-pixi-entity";
import Vector from "../../../engine/core/vector";
import Direction from "../../../engine/core/direction";
import EntityType from "../../../engine/core/entity-type";
import TextureHelper from "../../../engine/pixi/texture-helper";
import PIXIAnimation from "../../../engine/pixi/pixi-animation";

const TEXTURES_FILE = "public/imgs/warrior.json";
const ANIMATION_SPEED = 0.08;

const SIZE = new Vector(16, 35);
const RUN_FORCE = new Vector(0.22, 0);
const SPRINT_FORCE = new Vector(0.36, 0);
const JUMP_FORCE = new Vector(0, -7);
const STAB_POSITION = new Vector(24, 2);
const MAX_HEALTH = 100;

export default class Warrior extends AnimatedPIXIEntity {

  get type() { return EntityType.Friendly; }
  get size() { return SIZE; }
  get maxHealth() { return MAX_HEALTH; }
  get isGravityBound() { return true; }
  get isWallBound() { return true; }

  static assets = [TEXTURES_FILE];

  static get _runTextures() { return [
    TextureHelper.get(TEXTURES_FILE, "run_1.png"),
    TextureHelper.get(TEXTURES_FILE, "run_2.png"),
    TextureHelper.get(TEXTURES_FILE, "run_3.png"),
    TextureHelper.get(TEXTURES_FILE, "run_2.png"),
  ]; }

  static get _stabTextures() { return [
    TextureHelper.get(TEXTURES_FILE, "stab_1.png"),
    TextureHelper.get(TEXTURES_FILE, "stab_2.png"),
  ]; }

  private _leftDown = false;
  private _rightDown = false;
  private _isStabbing = false;
  private _isOnGround = false;
  private _isSprinting = false;
  private _runForce = new Vector(0, 0);

  constructor(position: Vector) {
    super(position, Warrior._runTextures);

    if (this._healthBar) this._healthBar.alpha = 0;

    new KeyListener(37 /* left arrow */,
      () => {
        this._goLeft();
        this._leftDown = true;
      },
      () => {
        this._rightDown ? this._goRight() : this._stop();
        this._leftDown = false;
      },
    );

    new KeyListener(39 /* right arrow */,
      () => {
        this._goRight();
        this._rightDown = true;
      },
      () => {
        this._leftDown ? this._goLeft() : this._stop();
        this._rightDown = false;
      },
    );

    new KeyListener(38 /* up arrow */,
      () => this._jump(),
    );

    new KeyListener(65 /* `a` */,
      () => this.stab(),
    );

    new KeyListener(83 /* `s` */,
      () => {
        this._isSprinting = true;
        if (this._runForce.x > 0) {
          this._goRight();
        } else if (this._runForce.x < 0) {
          this._goLeft();
        }
      },
      () => {
        this._isSprinting = false;
        if (this._runForce.x > 0) {
          this._goRight();
        } else if (this._runForce.x < 0) {
          this._goLeft();
        }
      },
    );

    this._stop();
  }

  afterTick() {
    super.afterTick();

    this._isOnGround = this.isTouchingWallsInAllDirections([Direction.Down]);
    if (this._isOnGround) {
      this.push(this._runForce);
    }
  }

  _goLeft() {
    if (this._isStabbing) return;

    this._runForce = this._isSprinting ? SPRINT_FORCE : RUN_FORCE;
    this._runForce = this._runForce.flippedHorizontally();

    this.animation =
      new PIXIAnimation(Warrior._runTextures)
        .speed(this._isSprinting ? ANIMATION_SPEED * SPRINT_FORCE.x / RUN_FORCE.x : ANIMATION_SPEED)
        .flippedHorizontally();
  }

  _goRight() {
    if (this._isStabbing) return;

    this._runForce = this._isSprinting ? SPRINT_FORCE : RUN_FORCE;

    this.animation =
      new PIXIAnimation(Warrior._runTextures)
      .speed(this._isSprinting ? ANIMATION_SPEED * SPRINT_FORCE.x / RUN_FORCE.x : ANIMATION_SPEED)
      .flippedHorizontally(false);
  }

  _stop() {
    if (this._isStabbing) return;

    this._runForce = new Vector(0, 0);

    this.animation =
      new PIXIAnimation(Warrior._runTextures)
        .speed(ANIMATION_SPEED)
        .stopOn(1);
  }

  _jump() {
    if (this._isStabbing) return;

    if (this._isOnGround) {
      this.velocity = this.velocity.withNewY(0);
      this.push(JUMP_FORCE);
    }
  }

  stab() {
    if (this._isStabbing) return;

    this._runForce = new Vector(0, 0);
    this._isStabbing = true;

    this.animation =
      new PIXIAnimation(Warrior._stabTextures)
        .speed(ANIMATION_SPEED)
        .onFrameChange(this._onStabFrameChange.bind(this))
        .onLoop(this._onStabComplete.bind(this));
  }

  _onStabFrameChange(currentFrame: number) {
    if (currentFrame === 1) {
      this.addEntityToSystem(new WarriorStabAttack(
        this.position.plus(STAB_POSITION.flippedHorizontally(this.isFacingLeft)),
        this,
      ));
    }
  }

  _onStabComplete() {
    this._isStabbing = false;
      
    if (this._rightDown) {
      this._goRight();
    } else if (this._leftDown) {
      this._goLeft();
    } else {
      this._stop();
    }
  }

}
