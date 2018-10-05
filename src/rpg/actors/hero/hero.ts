import Vector from "../../../engine/core/vector";
import AnimatedPIXIEntity from "../../../engine/pixi/animated-pixi-entity";
import TextureHelper from "../../../engine/pixi/texture-helper";
import KeyListener from "../../../engine/interaction/key-listener";
import Direction from "../../../engine/core/direction";
import EntityType from "../../../engine/core/entity-type";
import PIXIAnimation from "../../../engine/pixi/pixi-animation";
import HeroPunchAttack from "./hero-punch-attack";

const TEXTURES_FILE = 'public/imgs/man.json';

const ANIMATION_SPEED = 0.08;
const ROLL_ANIMATION_SPEED = 0.133;
const PUNCH_ANIMATION_SPEED = 0.08;

const SIZE = new Vector(14, 28);
const ROLLING_SIZE = new Vector(14, 18);

const MAX_HEALTH = 200;

const RUN_FORCE = new Vector(0.25, 0);
const JUMP_FORCE = new Vector(0, -8);
const ROLL_FORCE = new Vector(12, 0);

const PUNCH_ATTACK_POSITION = new Vector(10, 2);

const MID_AIR_RUN_SCALE = 0.333;

enum HeroState {
  Nuetral,
  Rolling,
  Attacking,
};

enum HeroRunState {
  Standing,
  RunningLeft,
  RunningRight,
}

export default class Hero extends AnimatedPIXIEntity {

  get type() { return EntityType.Friendly; }
  get size() { return this.state === HeroState.Rolling ? ROLLING_SIZE : SIZE; }
  get maxHealth() { return MAX_HEALTH; }
  get isGravityBound() { return true; }
  get isWallBound() { return true; }
  get isSolidBound() { return this.state !== HeroState.Rolling; }
  get isFrictionBound() { return true; }

  get cameraPosition() {
    return this.state === HeroState.Rolling
      ? this.position.minus(Hero.rollPositionOffset)
      : this.position;
  }

  static assets = [TEXTURES_FILE];

  private static get runTextures() { return [
    TextureHelper.get(TEXTURES_FILE, "man__run-1.png"),
    TextureHelper.get(TEXTURES_FILE, "man__run-2.png"),
    TextureHelper.get(TEXTURES_FILE, "man__run-3.png"),
    TextureHelper.get(TEXTURES_FILE, "man__run-2.png"),
  ]; }

  private static get jumpTextures() { return [
    TextureHelper.get(TEXTURES_FILE, "man__jump.png"),
  ]; }

  private static get rollTextures() { return [
    TextureHelper.get(TEXTURES_FILE, "man__roll-1.png"),
    TextureHelper.get(TEXTURES_FILE, "man__roll-2.png"),
  ]; }

  private static get punchTextures() { return [
    TextureHelper.get(TEXTURES_FILE, "man__punch-1.png"),
    TextureHelper.get(TEXTURES_FILE, "man__punch-2.png"),
  ]; }

  private static get rollPositionOffset() {
    return SIZE.minus(ROLLING_SIZE).scaled(0.5);
  }

  private keyListeners: Array<KeyListener> = [];

  private rightKeyDown = false;
  private leftKeyDown = false;
  private runState = HeroRunState.Standing;
  
  private isOnGround = false;
  private isJumping = false;
  private runForce = new Vector(0, 0);

  private state = HeroState.Nuetral;

  constructor(position: Vector) {
    super(
      position,
      Hero.runTextures,
    );

    this.addKeyListeners();
    this.stopRunning();
  }

  afterTick() {
    super.afterTick();

    this.isOnGround = this.isTouchingWallsInAllDirections([Direction.Down]);
    if (this.isOnGround) {
      if (this.isJumping) this.endJump();

      this.push(this.runForce);
    } else {
      this.push(this.runForce.scaled(MID_AIR_RUN_SCALE));
    }
  }

  kill() {
    this.keyListeners.forEach(keyListener => keyListener.destroy());
    super.kill();
  }

  private addKeyListeners() {
    this.keyListeners.push(new KeyListener(37 /* left arrow */,
      () => this.runLeft(),
      () => this.stopRunningLeft(),
    ));

    this.keyListeners.push(new KeyListener(39 /* right arrow */,
      () => this.runRight(),
      () => this.stopRunningRight(),
    ));

    this.keyListeners.push(new KeyListener(38 /* up arrow */,
      () => this.jump(),
    ));

    this.keyListeners.push(new KeyListener(88 /* `x` */,
      () => this.roll(),
    ));

    this.keyListeners.push(new KeyListener(90 /* `z` */,
      () => this.attack(),
    ));
  }

  private runLeft() {
    this.leftKeyDown = true;
    this.runState = HeroRunState.RunningLeft;

    if (this.state !== HeroState.Nuetral) return;

    this.runForce = RUN_FORCE.flippedHorizontally();

    if (this.isJumping) {
      this.animation = new PIXIAnimation(Hero.jumpTextures).speed(0).flippedHorizontally();
    } else {
      this.animation = new PIXIAnimation(Hero.runTextures).speed(ANIMATION_SPEED).flippedHorizontally();
    }
  }

  private runRight() {
    this.rightKeyDown = true;
    this.runState = HeroRunState.RunningRight;

    if (this.state !== HeroState.Nuetral) return;

    this.runForce = RUN_FORCE;

    if (this.isJumping) {
      this.animation = new PIXIAnimation(Hero.jumpTextures).speed(0).flippedHorizontally(false);
    } else {
      this.animation = new PIXIAnimation(Hero.runTextures).speed(ANIMATION_SPEED).flippedHorizontally(false);
    }
  }

  private stopRunning() {
    this.rightKeyDown = this.leftKeyDown = false;
    this.runState = HeroRunState.Standing;

    if (this.state !== HeroState.Nuetral) return;

    this.runForce = new Vector(0, 0);

    if (!this.isJumping) {
      this.animation = new PIXIAnimation(Hero.runTextures).speed(ANIMATION_SPEED).stopOn(1);
    }
  }

  private stopRunningLeft() {
    this.leftKeyDown = false;
    this.rightKeyDown ? this.runRight() : this.stopRunning();
  }

  private stopRunningRight() {
    this.rightKeyDown = false;
    this.leftKeyDown ? this.runLeft() : this.stopRunning();
  }

  private continueRunning() {
    if (this.runState === HeroRunState.RunningLeft) {
      this.runLeft();
    } else if (this.runState === HeroRunState.RunningRight) {
      this.runRight();
    } else {
      this.stopRunning();
    }
  }
  
  private endJump() {
    this.isJumping = false;
    this.continueRunning();
  }

  private jump() {
    if (this.state !== HeroState.Nuetral || !this.isOnGround) return;

    this.isJumping = true;

    this.velocity = this.velocity.withNewY(0);
    this.push(JUMP_FORCE);
    this.animation = new PIXIAnimation(Hero.jumpTextures).speed(0);
  }

  private roll() {
    if (this.state !== HeroState.Nuetral || !this.isOnGround) return;

    this.runForce = new Vector(0, 0);
    this.state = HeroState.Rolling;
    this.position = this.position.plus(Hero.rollPositionOffset);
    this.push(ROLL_FORCE.flippedHorizontally(this.isFacingLeft));

    this.animation =
      new PIXIAnimation(Hero.rollTextures)
        .speed(ROLL_ANIMATION_SPEED)
        .onLoop(() => {
          this.state = HeroState.Nuetral;
          this.position = this.position.minus(Hero.rollPositionOffset);
          this.continueRunning();
        });
  }

  private attack() {
    if (this.state !== HeroState.Nuetral) return;

    this.runForce = new Vector(0, 0);
    this.state = HeroState.Attacking;

    this.animation =
      new PIXIAnimation(Hero.punchTextures)
        .speed(PUNCH_ANIMATION_SPEED)
        .onFrameChange((currentFrame: number) => {
          if (currentFrame === 1) {
            this.addEntityToSystem(new HeroPunchAttack(
              this.position.plus(PUNCH_ATTACK_POSITION.flippedHorizontally(this.isFacingLeft)),
              this,
            ));
          }
        })
        .onLoop(() => {
          this.state = HeroState.Nuetral;
          this.continueRunning();
        });
  }

}
