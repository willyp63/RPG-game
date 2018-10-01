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
const ROLL_ANIMATION_SPEED = 0.133;

const SIZE = new Vector(15, 33);
const ROLLING_SIZE = new Vector(15, 21);
const RUN_FORCE = new Vector(0.22, 0);
const MID_AIR_RUN_SCALE = 0.133;
const MID_AIR_RUN_MAX_VELOCITY = 1;
const SPRINT_FORCE = new Vector(0.3, 0);
const JUMP_FORCE = new Vector(0, -6.5);
const STAB_POSITION = new Vector(24, 2);
const MAX_HEALTH = 200;
const ROLL_FORCE = new Vector(9, 0);

enum WarriorState {
  Nuetral,
  Rolling,
  Stabbing,
};

export default class Warrior extends AnimatedPIXIEntity {

  get type() { return EntityType.Friendly; }
  get size() { return this._state === WarriorState.Rolling ? ROLLING_SIZE : SIZE; }
  get maxHealth() { return MAX_HEALTH; }
  get isGravityBound() { return true; }
  get isWallBound() { return true; }
  get isSolidBound() { return this._state !== WarriorState.Rolling; }

  get cameraPosition() {
    return this._state === WarriorState.Rolling
      ? this.position.minus(Warrior._rollPositionOffset)
      : this.position;
  }

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

  static get _rollTexture() { return [
    TextureHelper.get(TEXTURES_FILE, "roll_1.png"),
    TextureHelper.get(TEXTURES_FILE, "roll_2.png"),
  ]; }

  private _leftDown = false;
  private _rightDown = false;
  private _isOnGround = false;
  private _isSprinting = false;
  private _runForce = new Vector(0, 0);
  private _state = WarriorState.Nuetral;
  private _keyListeners: Array<KeyListener> = [];

  constructor(position: Vector) {
    super(position, Warrior._runTextures);

    this._keyListeners.push(new KeyListener(37 /* left arrow */,
      () => {
        this._goLeft();
        this._leftDown = true;
      },
      () => {
        this._rightDown ? this._goRight() : this._stop();
        this._leftDown = false;
      },
    ));

    this._keyListeners.push(new KeyListener(39 /* right arrow */,
      () => {
        this._goRight();
        this._rightDown = true;
      },
      () => {
        this._leftDown ? this._goLeft() : this._stop();
        this._rightDown = false;
      },
    ));

    this._keyListeners.push(new KeyListener(38 /* up arrow */,
      () => this._jump(),
    ));

    this._keyListeners.push(new KeyListener(90 /* `z` */,
      () => this.stab(),
    ));

    this._keyListeners.push(new KeyListener(88 /* `x` */,
      () => this._roll(),
    ));

    this._keyListeners.push(new KeyListener(65 /* `a` */,
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
    ));

    this._stop();
  }

  kill() {
    this._keyListeners.forEach(keyListener => keyListener.destroy());

    super.kill();
  }

  afterTick() {
    super.afterTick();

    this._isOnGround = this.isTouchingWallsInAllDirections([Direction.Down]);
    if (this._isOnGround) {
      this.push(this._runForce);
    } else if (Math.abs(this.velocity.x) < MID_AIR_RUN_MAX_VELOCITY) {
      this.push(this._runForce.scaled(MID_AIR_RUN_SCALE));
    }
  }

  _goLeft() {
    if (this._state !== WarriorState.Nuetral) return;

    this._runForce = this._isSprinting ? SPRINT_FORCE : RUN_FORCE;
    this._runForce = this._runForce.flippedHorizontally();

    this.animation =
      new PIXIAnimation(Warrior._runTextures)
        .speed(this._isSprinting ? ANIMATION_SPEED * SPRINT_FORCE.x / RUN_FORCE.x : ANIMATION_SPEED)
        .flippedHorizontally();
  }

  _goRight() {
    if (this._state !== WarriorState.Nuetral) return;

    this._runForce = this._isSprinting ? SPRINT_FORCE : RUN_FORCE;

    this.animation =
      new PIXIAnimation(Warrior._runTextures)
      .speed(this._isSprinting ? ANIMATION_SPEED * SPRINT_FORCE.x / RUN_FORCE.x : ANIMATION_SPEED)
      .flippedHorizontally(false);
  }

  _stop() {
    if (this._state !== WarriorState.Nuetral) return;

    this._runForce = new Vector(0, 0);

    this.animation =
      new PIXIAnimation(Warrior._runTextures)
        .speed(ANIMATION_SPEED)
        .stopOn(1);
  }

  _jump() {
    if (this._state !== WarriorState.Nuetral || !this._isOnGround) return;

    this.velocity = this.velocity.withNewY(0);
    this.push(JUMP_FORCE);
  }

  stab() {
    if (this._state !== WarriorState.Nuetral) return;

    this._runForce = new Vector(0, 0);
    this._state = WarriorState.Stabbing;

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
    this._state = WarriorState.Nuetral;
      
    if (this._rightDown) {
      this._goRight();
    } else if (this._leftDown) {
      this._goLeft();
    } else {
      this._stop();
    }
  }

  _roll() {
    if (this._state !== WarriorState.Nuetral || !this._isOnGround) return;

    this._runForce = new Vector(0, 0);
    this._state = WarriorState.Rolling;
    this.position = this.position.plus(Warrior._rollPositionOffset);
    this.push(ROLL_FORCE.flippedHorizontally(this.isFacingLeft));

    this.animation =
      new PIXIAnimation(Warrior._rollTexture)
        .speed(ROLL_ANIMATION_SPEED)
        .onLoop(() => {
          this.position = this.position.minus(Warrior._rollPositionOffset);
          this._onStabComplete();
        });
  }

  static get _rollPositionOffset() {
    return SIZE.minus(ROLLING_SIZE).scaled(0.5);
  }

}
