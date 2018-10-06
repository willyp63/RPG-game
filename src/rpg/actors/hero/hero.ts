import Vector from "../../../engine/core/vector";
import TextureHelper from "../../../engine/pixi/texture-helper";
import KeyListener from "../../../engine/interaction/key-listener";
import Direction from "../../../engine/core/direction";
import EntityType from "../../../engine/core/entity-type";
import PIXIEntity from "../../../engine/pixi/pixi-entity";
import { Sprite, ObservablePoint } from "pixi.js";
import Helm, { HelmType } from "./equipment/helm";
import ChestPiece, { ChestPieceType } from "./equipment/chest-piece";
import setTicksOut, { clearTicksOut } from "../../../engine/core/set-ticks-out";
import HeroPunchAttack from "./attacks/hero-punch-attack";
import LegGuards, { LegGuardType } from "./equipment/leg-guards";
import Weapon, { WeaponType, AttackType } from "./equipment/weapon";
import HeroSlashAttack from "./attacks/hero-slash-attack";

const TEXTURES_FILE = 'public/imgs/man.json';

const SIZE = new Vector(15, 30);
const ROLLING_SIZE = new Vector(15, 20);

const MAX_HEALTH = 200;

const RUN_FORCE = new Vector(0.25, 0);
const JUMP_FORCE = new Vector(0, -8);
const ROLL_FORCE = new Vector(12, 0);

const PUNCH_ATTACK_POSITION = new Vector(12, 2);
const SLASH_ATTACK_POSITION = new Vector(16, 2);

// Chest
const CHEST_POSITION = new Vector(0, -2);
const CHEST_ANCHOR = <ObservablePoint>{ x: 0.5, y: 0.5 };

// Head
const HEAD_POSITION = new Vector(0, -10);
const HEAD_ANCHOR = <ObservablePoint>{ x: 0.5, y: 0.5 };

// Legs
const BACK_LEG_POSITION = new Vector(1.5, 4);
const FRONT_LEG_POSITION = new Vector(-1.5, 4);
const UPPER_LEG_ANCHOR = <ObservablePoint>{ x: 0.5, y: 0 };
const LOWER_LEG_POSITION = new Vector(0, 6);
const LOWER_LEG_ANCHOR = <ObservablePoint>{ x: 0.3125, y: 0 };

// Arms
const BACK_ARM_POSITION = new Vector(4, -4);
const FRONT_ARM_POSITION = new Vector(-4, -4);
const UPPER_ARM_ANCHOR = <ObservablePoint>{ x: 0, y: 0.5 };
const LOWER_ARM_POSITION = new Vector(7, 0);
const LOWER_ARM_ANCHOR = <ObservablePoint>{ x: 0, y: 0.5 };

// Weapons
const WEAPON_POSITION = new Vector(4, 0);

const DEFAULT_ANIMATION_TICK_DELAY = 12;

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

enum HeroPose {
  Standing,
  Running1,
  Running2,
  Running3,
  Jumping,
  Rolling1,
  Rolling2,
  Punching1,
  Punching2,
  Slashing1,
  Slashing2,
}

export default class Hero extends PIXIEntity {

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
  private static get headTexture() { return TextureHelper.get(TEXTURES_FILE, "man__head.png"); }
  private static get chestTexture() { return TextureHelper.get(TEXTURES_FILE, "man__chest.png"); }
  private static get upperArmTexture() { return TextureHelper.get(TEXTURES_FILE, "man__upper-arm.png"); }
  private static get lowerArmTexture() { return TextureHelper.get(TEXTURES_FILE, "man__lower-arm.png"); }
  private static get upperLegTexture() { return TextureHelper.get(TEXTURES_FILE, "man__upper-leg.png"); }
  private static get lowerLegTexture() { return TextureHelper.get(TEXTURES_FILE, "man__lower-leg.png"); }

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

  // body parts
  private head = new Sprite(Hero.headTexture);
  private chest = new Sprite(Hero.chestTexture);
  private backUpperArm = new Sprite(Hero.upperArmTexture);
  private frontUpperArm = new Sprite(Hero.upperArmTexture);
  private backLowerArm = new Sprite(Hero.lowerArmTexture);
  private frontLowerArm = new Sprite(Hero.lowerArmTexture);
  private backUpperLeg = new Sprite(Hero.upperLegTexture);
  private frontUpperLeg = new Sprite(Hero.upperLegTexture);
  private backLowerLeg = new Sprite(Hero.lowerLegTexture);
  private frontLowerLeg = new Sprite(Hero.lowerLegTexture);

  // armor
  private helm = new Helm(HelmType.Wizard);
  private chestPiece = new ChestPiece(ChestPieceType.Wizard);
  private legGuards = new LegGuards(LegGuardType.Wizard);

  // weapons
  private mainHandWeapon = new Weapon(WeaponType.RubyStaff);
  private mainHandWeaponSprite = this.mainHandWeapon.getSprite();
  private offHandWeapon = new Weapon(WeaponType.None);
  private offHandWeaponSprite = this.offHandWeapon.getSprite();

  private animationTicksOut?: Function;

  constructor(position: Vector) {
    super(
      new Sprite(),
      position,
    );

    this.assembleSprite();
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

  private assembleSprite() {
    // back arm
    this.backUpperArm.x = BACK_ARM_POSITION.x;
    this.backUpperArm.y = BACK_ARM_POSITION.y;
    this.backUpperArm.anchor = UPPER_ARM_ANCHOR;
    this._sprite.addChild(this.backUpperArm);
    this.backLowerArm.x = LOWER_ARM_POSITION.x;
    this.backLowerArm.y = LOWER_ARM_POSITION.y;
    this.backLowerArm.anchor = LOWER_ARM_ANCHOR;
    this.backUpperArm.addChild(this.backLowerArm);

    // chest piece arm
    const backChestPieceUpperArmSprite = this.chestPiece.getUpperArmSprite();
    const backChestPieceLowerArmSprite = this.chestPiece.getLowerArmSprite();
    backChestPieceUpperArmSprite.anchor = UPPER_ARM_ANCHOR;
    backChestPieceLowerArmSprite.anchor = LOWER_ARM_ANCHOR;
    this.backUpperArm.addChild(backChestPieceUpperArmSprite);
    this.backLowerArm.addChild(backChestPieceLowerArmSprite);

    // off hand weapon
    this.offHandWeaponSprite = this.offHandWeapon.getSprite();
    this.offHandWeaponSprite.x = WEAPON_POSITION.x;
    this.offHandWeaponSprite.y = WEAPON_POSITION.y;
    this.backLowerArm.addChild(this.offHandWeaponSprite);

    // back leg
    this.backUpperLeg.x = BACK_LEG_POSITION.x;
    this.backUpperLeg.y = BACK_LEG_POSITION.y;
    this.backUpperLeg.anchor = UPPER_LEG_ANCHOR;
    this._sprite.addChild(this.backUpperLeg);
    this.backLowerLeg.x = LOWER_LEG_POSITION.x;
    this.backLowerLeg.y = LOWER_LEG_POSITION.y;
    this.backLowerLeg.anchor = LOWER_LEG_ANCHOR;
    this.backUpperLeg.addChild(this.backLowerLeg);

    // leg guards
    const backUpperLegGuardSprite = this.legGuards.getUpperLegSprite();
    const backLowerLegGuardSprite = this.legGuards.getLowerLegSprite();
    backUpperLegGuardSprite.anchor = UPPER_LEG_ANCHOR;
    backLowerLegGuardSprite.anchor = LOWER_LEG_ANCHOR;
    this.backUpperLeg.addChild(backUpperLegGuardSprite);
    this.backLowerLeg.addChild(backLowerLegGuardSprite);

    // chest
    this.chest.x = CHEST_POSITION.x;
    this.chest.y = CHEST_POSITION.y;
    this.chest.anchor = CHEST_ANCHOR;
    this._sprite.addChild(this.chest);

    // chest piece
    const chestPieceSprite = this.chestPiece.getSprite();
    chestPieceSprite.anchor = CHEST_ANCHOR;
    this.chest.addChild(chestPieceSprite);

    // head
    this.head.x = HEAD_POSITION.x;
    this.head.y = HEAD_POSITION.y;
    this.head.anchor = HEAD_ANCHOR;
    this._sprite.addChild(this.head);

    // front leg
    this.frontUpperLeg.x = FRONT_LEG_POSITION.x;
    this.frontUpperLeg.y = FRONT_LEG_POSITION.y;
    this.frontUpperLeg.anchor = UPPER_LEG_ANCHOR;
    this._sprite.addChild(this.frontUpperLeg);
    this.frontLowerLeg.x = LOWER_LEG_POSITION.x;
    this.frontLowerLeg.y = LOWER_LEG_POSITION.y;
    this.frontLowerLeg.anchor = LOWER_LEG_ANCHOR;
    this.frontUpperLeg.addChild(this.frontLowerLeg);

    // leg guards
    const frontUpperLegGuardSprite = this.legGuards.getUpperLegSprite();
    const frontLowerLegGuardSprite = this.legGuards.getLowerLegSprite();
    frontUpperLegGuardSprite.anchor = UPPER_LEG_ANCHOR;
    frontLowerLegGuardSprite.anchor = LOWER_LEG_ANCHOR;
    this.frontUpperLeg.addChild(frontUpperLegGuardSprite);
    this.frontLowerLeg.addChild(frontLowerLegGuardSprite);

    // front arm
    this.frontUpperArm.x = FRONT_ARM_POSITION.x;
    this.frontUpperArm.y = FRONT_ARM_POSITION.y;
    this.frontUpperArm.anchor = UPPER_ARM_ANCHOR;
    this._sprite.addChild(this.frontUpperArm);
    this.frontLowerArm.x = LOWER_ARM_POSITION.x;
    this.frontLowerArm.y = LOWER_ARM_POSITION.y;
    this.frontLowerArm.anchor = LOWER_ARM_ANCHOR;
    this.frontUpperArm.addChild(this.frontLowerArm);

    // chest piece arm
    const frontChestPieceUpperArmSprite = this.chestPiece.getUpperArmSprite();
    const frontChestPieceLowerArmSprite = this.chestPiece.getLowerArmSprite();
    frontChestPieceUpperArmSprite.anchor = UPPER_ARM_ANCHOR;
    frontChestPieceLowerArmSprite.anchor = LOWER_ARM_ANCHOR;
    this.frontUpperArm.addChild(frontChestPieceUpperArmSprite);
    this.frontLowerArm.addChild(frontChestPieceLowerArmSprite);

    // main hand weapon
    this.mainHandWeaponSprite = this.mainHandWeapon.getSprite();
    this.mainHandWeaponSprite.x = WEAPON_POSITION.x;
    this.mainHandWeaponSprite.y = WEAPON_POSITION.y;
    this.frontLowerArm.addChild(this.mainHandWeaponSprite);

    // helm
    const helmSprite = this.helm.getSprite();
    helmSprite.anchor = <ObservablePoint>{ x: 0.5, y: 0.5 };
    this.head.addChild(helmSprite);
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
      this.pose(HeroPose.Jumping, true);
    } else {
      this.animatePoses([HeroPose.Running2, HeroPose.Running3, HeroPose.Running2, HeroPose.Running1], 1, true);
    }
  }

  private runRight() {
    this.rightKeyDown = true;
    this.runState = HeroRunState.RunningRight;

    if (this.state !== HeroState.Nuetral) return;

    this.runForce = RUN_FORCE;

    if (this.isJumping) {
      this.pose(HeroPose.Jumping, false);
    } else {
      this.animatePoses([HeroPose.Running2, HeroPose.Running3, HeroPose.Running2, HeroPose.Running1], 1, false);
    }
  }

  private stopRunning() {
    this.rightKeyDown = this.leftKeyDown = false;
    this.runState = HeroRunState.Standing;

    if (this.state !== HeroState.Nuetral) return;

    this.runForce = new Vector(0, 0);

    if (!this.isJumping) this.pose(HeroPose.Standing);
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
    this.pose(HeroPose.Jumping);
  }

  private roll() {
    if (this.state !== HeroState.Nuetral || !this.isOnGround) return;

    this.runForce = new Vector(0, 0);
    this.state = HeroState.Rolling;
    this.position = this.position.plus(Hero.rollPositionOffset);
    this.push(ROLL_FORCE.flippedHorizontally(this.isFacingLeft));

    this.isFacingLeft
      ? this.animatePoses([HeroPose.Rolling2, HeroPose.Rolling1], 1)
      : this.animatePoses([HeroPose.Rolling1, HeroPose.Rolling2], 1);
    setTicksOut(() => {
      this.state = HeroState.Nuetral;
      this.position = this.position.minus(Hero.rollPositionOffset);
      this.continueRunning();
    }, DEFAULT_ANIMATION_TICK_DELAY * 2);
  }

  private attack() {
    if (this.state !== HeroState.Nuetral) return;

    this.runForce = new Vector(0, 0);
    this.state = HeroState.Attacking;

    switch(this.mainHandWeapon.attackType) {
      case AttackType.Cast:
      case AttackType.Slash:
        this.slash();
        break;
      case AttackType.Punch:
      default:
        this.punch();
        break;
    }
  }

  private slash() {
    this.animatePoses([HeroPose.Slashing1, HeroPose.Slashing2], 1);
    setTicksOut(() => {
      this.addEntityToSystem(new HeroSlashAttack(
        this.position.plus(SLASH_ATTACK_POSITION.flippedHorizontally(this.isFacingLeft)),
        this,
      ));
    }, DEFAULT_ANIMATION_TICK_DELAY);
    setTicksOut(() => {
      this.state = HeroState.Nuetral;
      this.continueRunning();
    }, DEFAULT_ANIMATION_TICK_DELAY * 2 - 1);
  }

  private punch() {
    this.animatePoses([HeroPose.Punching1, HeroPose.Punching2], 1);
    setTicksOut(() => {
      this.addEntityToSystem(new HeroPunchAttack(
        this.position.plus(PUNCH_ATTACK_POSITION.flippedHorizontally(this.isFacingLeft)),
        this,
      ));
    }, DEFAULT_ANIMATION_TICK_DELAY);
    setTicksOut(() => {
      this.state = HeroState.Nuetral;
      this.continueRunning();
    }, DEFAULT_ANIMATION_TICK_DELAY * 2 - 1);
  }

  private pose(pose: HeroPose, flippedHorizontally?: boolean) {
    this.cancelAnimation();
    this.flipSprite(flippedHorizontally);
    switch(pose) {
      case HeroPose.Running1:
        this.frontUpperArm.rotation = Math.PI * 2 / 3;
        this.frontLowerArm.rotation = Math.PI / -2;
        this.mainHandWeaponSprite.rotation = Math.PI / -2;
        this.backUpperArm.rotation = Math.PI / 3;
        this.backLowerArm.rotation = Math.PI / -2;
        this.offHandWeaponSprite.rotation = Math.PI / -2;
        this.frontUpperLeg.rotation = Math.PI / -3;
        this.frontLowerLeg.rotation = Math.PI / 3;
        this.backUpperLeg.rotation = Math.PI / 3;
        this.backLowerLeg.rotation = Math.PI / 3;
        this.sprite.rotation = 0;
        break;
      case HeroPose.Jumping:
      case HeroPose.Running3:
        this.frontUpperArm.rotation = Math.PI / 3;
        this.frontLowerArm.rotation = Math.PI / -2;
        this.mainHandWeaponSprite.rotation = Math.PI / -2;
        this.backUpperArm.rotation = Math.PI * 2 / 3;
        this.backLowerArm.rotation = Math.PI / -2;
        this.offHandWeaponSprite.rotation = Math.PI / -2;
        this.frontUpperLeg.rotation = Math.PI / 3;
        this.frontLowerLeg.rotation = Math.PI / 3;
        this.backUpperLeg.rotation = Math.PI / -3;
        this.backLowerLeg.rotation = Math.PI / 3;
        this.sprite.rotation = 0;
        break;
      case HeroPose.Rolling1:
        this.frontUpperArm.rotation = Math.PI / 2;
        this.frontLowerArm.rotation = Math.PI / -2;
        this.mainHandWeaponSprite.rotation = Math.PI / -2;
        this.backUpperArm.rotation = Math.PI / 2;
        this.backLowerArm.rotation = Math.PI / -2;
        this.offHandWeaponSprite.rotation = Math.PI / -2;
        this.frontUpperLeg.rotation = Math.PI * -2 / 3;
        this.frontLowerLeg.rotation = 0;
        this.backUpperLeg.rotation = Math.PI * -2 / 3;
        this.backLowerLeg.rotation = 0;
        this.sprite.rotation = Math.PI * 2 / 3;
        break;
      case HeroPose.Rolling2:
        this.frontUpperArm.rotation = Math.PI / 2;
        this.frontLowerArm.rotation = Math.PI / -2;
        this.mainHandWeaponSprite.rotation = Math.PI / -2;
        this.backUpperArm.rotation = Math.PI / 2;
        this.backLowerArm.rotation = Math.PI / -2;
        this.offHandWeaponSprite.rotation = Math.PI / -2;
        this.frontUpperLeg.rotation = Math.PI * -2 / 3;
        this.frontLowerLeg.rotation = 0;
        this.backUpperLeg.rotation = Math.PI * -2 / 3;
        this.backLowerLeg.rotation = 0;
        this.sprite.rotation = Math.PI * -2 / 3;
        break;
      case HeroPose.Punching1:
        this.frontUpperArm.rotation = Math.PI * 2 / 3;
        this.frontLowerArm.rotation = Math.PI * -2 / 3;
        this.mainHandWeaponSprite.rotation = Math.PI / -2;
        this.backUpperArm.rotation = Math.PI / 3;
        this.backLowerArm.rotation = Math.PI / -3;
        this.offHandWeaponSprite.rotation = Math.PI / -2;
        this.frontUpperLeg.rotation = 0;
        this.frontLowerLeg.rotation = 0;
        this.backUpperLeg.rotation = 0;
        this.backLowerLeg.rotation = 0;
        this.sprite.rotation = 0;
        break;
      case HeroPose.Punching2:
        this.frontUpperArm.rotation = Math.PI / 9;
        this.frontLowerArm.rotation = Math.PI / -9;
        this.mainHandWeaponSprite.rotation = Math.PI / -2;
        this.backUpperArm.rotation = Math.PI * 2 / 3;
        this.backLowerArm.rotation = Math.PI * -2 / 3;
        this.offHandWeaponSprite.rotation = Math.PI / -2;
        this.frontUpperLeg.rotation = 0;
        this.frontLowerLeg.rotation = 0;
        this.backUpperLeg.rotation = 0;
        this.backLowerLeg.rotation = 0;
        this.sprite.rotation = 0;
        break;
      case HeroPose.Slashing1:
        this.frontUpperArm.rotation = 0;
        this.frontLowerArm.rotation = Math.PI / -2;
        this.mainHandWeaponSprite.rotation = Math.PI / -3;
        this.backUpperArm.rotation = Math.PI / 2;
        this.backLowerArm.rotation = 0;
        this.offHandWeaponSprite.rotation = Math.PI / -2;
        this.frontUpperLeg.rotation = 0;
        this.frontLowerLeg.rotation = 0;
        this.backUpperLeg.rotation = 0;
        this.backLowerLeg.rotation = 0;
        this.sprite.rotation = 0;
        break;
      case HeroPose.Slashing2:
        this.frontUpperArm.rotation = Math.PI / 3;
        this.frontLowerArm.rotation = 0;
        this.mainHandWeaponSprite.rotation = Math.PI / -3;
        this.backUpperArm.rotation = Math.PI / 2;
        this.backLowerArm.rotation = 0;
        this.offHandWeaponSprite.rotation = Math.PI / -2;
        this.frontUpperLeg.rotation = 0;
        this.frontLowerLeg.rotation = 0;
        this.backUpperLeg.rotation = 0;
        this.backLowerLeg.rotation = 0;
        this.sprite.rotation = 0;
        break;
      case HeroPose.Running2:
      case HeroPose.Standing:
      default:
        this.frontUpperArm.rotation = Math.PI / 2;
        this.frontLowerArm.rotation = 0;
        this.mainHandWeaponSprite.rotation = Math.PI / -2;
        this.backUpperArm.rotation = Math.PI / 2;
        this.backLowerArm.rotation = 0;
        this.offHandWeaponSprite.rotation = Math.PI / -2;
        this.frontUpperLeg.rotation = 0;
        this.frontLowerLeg.rotation = 0;
        this.backUpperLeg.rotation = 0;
        this.backLowerLeg.rotation = 0;
        this.sprite.rotation = 0;
        break;
    }
  }

  private animatePoses(poses: Array<HeroPose>, animationSpeed: number, flippedHorizontally?: boolean) {
    this.cancelAnimation();
    this.animatePoseAtIndex(0, poses, animationSpeed, flippedHorizontally);
  }

  private animatePoseAtIndex(poseIndex: number, poses: Array<HeroPose>, animationSpeed: number, flippedHorizontally?: boolean) {
    this.pose(poses[poseIndex], flippedHorizontally);

    let nextPoseIndex = poseIndex + 1;
    if (nextPoseIndex >= poses.length) nextPoseIndex = 0;

    this.animationTicksOut = setTicksOut(() => {
      this.animatePoseAtIndex(nextPoseIndex, poses, animationSpeed, flippedHorizontally);
    }, DEFAULT_ANIMATION_TICK_DELAY / animationSpeed);
  }

  private cancelAnimation() {
    if (this.animationTicksOut) clearTicksOut(this.animationTicksOut);
  }

  private flipSprite(flippedHorizontally?: boolean) {
    if (flippedHorizontally === undefined) return;
    this.sprite.scale.x = flippedHorizontally ? Math.abs(this.sprite.scale.x) * -1 : Math.abs(this.sprite.scale.x);
  }

  private get isFacingLeft() {
    return this.sprite.scale.x < 0;
  }

}
