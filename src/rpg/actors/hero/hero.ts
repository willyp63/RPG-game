import Vector from "../../../engine/core/vector";
import TextureHelper from "../../../engine/pixi/texture-helper";
import KeyListener from "../../../engine/interaction/key-listener";
import Direction from "../../../engine/core/direction";
import PIXIEntity from "../../../engine/pixi/pixi-entity";
import { Sprite, ObservablePoint } from "pixi.js";
import Helm, { HelmType } from "./equipment/helm";
import ChestPiece, { ChestPieceType } from "./equipment/chest-piece";
import setTicksOut, { clearTicksOut } from "../../../engine/util/set-ticks-out";
import LegGuards, { LegGuardType } from "./equipment/leg-guards";
import Weapon, { WeaponType, AttackType } from "./equipment/weapon";
import { EntityType } from "../../../engine/core/entity";

const TEXTURES_FILE = 'public/imgs/man.json';

const SIZE = new Vector(15, 30);
const ROLLING_SIZE = new Vector(15, 20);

const MAX_HEALTH = 200;

const RUN_FORCE = new Vector(0.25, 0);
const JUMP_FORCE = new Vector(0, -8);
const ROLL_FORCE = new Vector(12, 0);

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
  AttackingMainHand,
  AttackingOffHand,
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
  PunchingOffHand1,
  PunchingOffHand2,
  Slashing1,
  Slashing2,
  SlashingOffHand1,
  SlashingOffHand2,
  Casting1,
  Casting2,
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
  private headSprite = new Sprite(Hero.headTexture);
  private chestSprite = new Sprite(Hero.chestTexture);
  private backUpperArmSprite = new Sprite(Hero.upperArmTexture);
  private frontUpperArmSprite = new Sprite(Hero.upperArmTexture);
  private backLowerArmSprite = new Sprite(Hero.lowerArmTexture);
  private frontLowerArmSprite = new Sprite(Hero.lowerArmTexture);
  private backUpperLegSprite = new Sprite(Hero.upperLegTexture);
  private frontUpperLegSprite = new Sprite(Hero.upperLegTexture);
  private backLowerLegSprite = new Sprite(Hero.lowerLegTexture);
  private frontLowerLegSprite = new Sprite(Hero.lowerLegTexture);

  // armor
  private helm = new Helm(HelmType.Viking);
  private chestPiece = new ChestPiece(ChestPieceType.Wizard);
  private legGuards = new LegGuards(LegGuardType.Wizard);

  // weapons
  private mainHandWeapon = new Weapon(WeaponType.IronSword);
  private mainHandWeaponSprite = this.mainHandWeapon.getSprite();
  private offHandWeapon = new Weapon(WeaponType.IronSword);
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
    this.backUpperArmSprite.x = BACK_ARM_POSITION.x;
    this.backUpperArmSprite.y = BACK_ARM_POSITION.y;
    this.backUpperArmSprite.anchor = UPPER_ARM_ANCHOR;
    this._sprite.addChild(this.backUpperArmSprite);
    this.backLowerArmSprite.x = LOWER_ARM_POSITION.x;
    this.backLowerArmSprite.y = LOWER_ARM_POSITION.y;
    this.backLowerArmSprite.anchor = LOWER_ARM_ANCHOR;
    this.backUpperArmSprite.addChild(this.backLowerArmSprite);

    // chest piece arm
    const backChestPieceUpperArmSprite = this.chestPiece.getUpperArmSprite();
    const backChestPieceLowerArmSprite = this.chestPiece.getLowerArmSprite();
    backChestPieceUpperArmSprite.anchor = UPPER_ARM_ANCHOR;
    backChestPieceLowerArmSprite.anchor = LOWER_ARM_ANCHOR;
    this.backUpperArmSprite.addChild(backChestPieceUpperArmSprite);
    this.backLowerArmSprite.addChild(backChestPieceLowerArmSprite);

    // off hand weapon
    this.offHandWeaponSprite = this.offHandWeapon.getSprite();
    this.offHandWeaponSprite.x = WEAPON_POSITION.x;
    this.offHandWeaponSprite.y = WEAPON_POSITION.y;
    this.backLowerArmSprite.addChild(this.offHandWeaponSprite);

    // back leg
    this.backUpperLegSprite.x = BACK_LEG_POSITION.x;
    this.backUpperLegSprite.y = BACK_LEG_POSITION.y;
    this.backUpperLegSprite.anchor = UPPER_LEG_ANCHOR;
    this._sprite.addChild(this.backUpperLegSprite);
    this.backLowerLegSprite.x = LOWER_LEG_POSITION.x;
    this.backLowerLegSprite.y = LOWER_LEG_POSITION.y;
    this.backLowerLegSprite.anchor = LOWER_LEG_ANCHOR;
    this.backUpperLegSprite.addChild(this.backLowerLegSprite);

    // leg guards
    const backUpperLegGuardSprite = this.legGuards.getUpperLegSprite();
    const backLowerLegGuardSprite = this.legGuards.getLowerLegSprite();
    backUpperLegGuardSprite.anchor = UPPER_LEG_ANCHOR;
    backLowerLegGuardSprite.anchor = LOWER_LEG_ANCHOR;
    this.backUpperLegSprite.addChild(backUpperLegGuardSprite);
    this.backLowerLegSprite.addChild(backLowerLegGuardSprite);

    // chest
    this.chestSprite.x = CHEST_POSITION.x;
    this.chestSprite.y = CHEST_POSITION.y;
    this.chestSprite.anchor = CHEST_ANCHOR;
    this._sprite.addChild(this.chestSprite);

    // chest piece
    const chestPieceSprite = this.chestPiece.getSprite();
    chestPieceSprite.anchor = CHEST_ANCHOR;
    this.chestSprite.addChild(chestPieceSprite);

    // head
    this.headSprite.x = HEAD_POSITION.x;
    this.headSprite.y = HEAD_POSITION.y;
    this.headSprite.anchor = HEAD_ANCHOR;
    this._sprite.addChild(this.headSprite);

    // helm
    const helmSprite = this.helm.getSprite();
    helmSprite.anchor = <ObservablePoint>{ x: 0.5, y: 0.5 };
    this.headSprite.addChild(helmSprite);

    // front leg
    this.frontUpperLegSprite.x = FRONT_LEG_POSITION.x;
    this.frontUpperLegSprite.y = FRONT_LEG_POSITION.y;
    this.frontUpperLegSprite.anchor = UPPER_LEG_ANCHOR;
    this._sprite.addChild(this.frontUpperLegSprite);
    this.frontLowerLegSprite.x = LOWER_LEG_POSITION.x;
    this.frontLowerLegSprite.y = LOWER_LEG_POSITION.y;
    this.frontLowerLegSprite.anchor = LOWER_LEG_ANCHOR;
    this.frontUpperLegSprite.addChild(this.frontLowerLegSprite);

    // leg guards
    const frontUpperLegGuardSprite = this.legGuards.getUpperLegSprite();
    const frontLowerLegGuardSprite = this.legGuards.getLowerLegSprite();
    frontUpperLegGuardSprite.anchor = UPPER_LEG_ANCHOR;
    frontLowerLegGuardSprite.anchor = LOWER_LEG_ANCHOR;
    this.frontUpperLegSprite.addChild(frontUpperLegGuardSprite);
    this.frontLowerLegSprite.addChild(frontLowerLegGuardSprite);

    // front arm
    this.frontUpperArmSprite.x = FRONT_ARM_POSITION.x;
    this.frontUpperArmSprite.y = FRONT_ARM_POSITION.y;
    this.frontUpperArmSprite.anchor = UPPER_ARM_ANCHOR;
    this._sprite.addChild(this.frontUpperArmSprite);
    this.frontLowerArmSprite.x = LOWER_ARM_POSITION.x;
    this.frontLowerArmSprite.y = LOWER_ARM_POSITION.y;
    this.frontLowerArmSprite.anchor = LOWER_ARM_ANCHOR;
    this.frontUpperArmSprite.addChild(this.frontLowerArmSprite);

    // main hand weapon
    this.mainHandWeaponSprite = this.mainHandWeapon.getSprite();
    this.mainHandWeaponSprite.x = WEAPON_POSITION.x;
    this.mainHandWeaponSprite.y = WEAPON_POSITION.y;
    this.frontLowerArmSprite.addChild(this.mainHandWeaponSprite);

    // dup lower front arm
    //
    // we need this so that the arm sits on top of the weapon
    const dupLowerArmSprite = new Sprite(Hero.lowerArmTexture);
    dupLowerArmSprite.anchor = LOWER_ARM_ANCHOR;
    this.frontLowerArmSprite.addChild(dupLowerArmSprite);

    // chest piece arm
    const frontChestPieceUpperArmSprite = this.chestPiece.getUpperArmSprite();
    const frontChestPieceLowerArmSprite = this.chestPiece.getLowerArmSprite();
    frontChestPieceUpperArmSprite.anchor = UPPER_ARM_ANCHOR;
    frontChestPieceLowerArmSprite.anchor = LOWER_ARM_ANCHOR;
    this.frontUpperArmSprite.addChild(frontChestPieceUpperArmSprite);
    this.frontLowerArmSprite.addChild(frontChestPieceLowerArmSprite);
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

    this.keyListeners.push(new KeyListener(67 /* `c` */,
      () => this.roll(),
    ));

    this.keyListeners.push(new KeyListener(90 /* `z` */,
      () => this.attack(),
    ));

    this.keyListeners.push(new KeyListener(88 /* `x` */,
      () => this.attack(true),
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
      this.animatePoses([HeroPose.Running2, HeroPose.Running3, HeroPose.Running2, HeroPose.Running1], 1, undefined, undefined, true);
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
      this.animatePoses([HeroPose.Running2, HeroPose.Running3, HeroPose.Running2, HeroPose.Running1], 1, undefined, undefined, false);
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
      ? this.animatePoses([HeroPose.Rolling2, HeroPose.Rolling1], 1, undefined, this.onRollComplete.bind(this))
      : this.animatePoses([HeroPose.Rolling1, HeroPose.Rolling2], 1, undefined, this.onRollComplete.bind(this));
  }

  private onRollComplete() {
    this.state = HeroState.Nuetral;
    this.position = this.position.minus(Hero.rollPositionOffset);
    this.continueRunning();
  }

  private attack(isOffHand = false) {
    if (this.state !== HeroState.Nuetral) return;

    this.runForce = new Vector(0, 0);
    this.state = isOffHand ? HeroState.AttackingOffHand : HeroState.AttackingMainHand;

    switch(isOffHand ? this.offHandWeapon.attackType : this.mainHandWeapon.attackType) {
      case AttackType.Slash:
        this.slash(isOffHand);
        break;
      case AttackType.Cast:
      case AttackType.Punch:
      default:
        this.punch(isOffHand);
        break;
    }
  }

  private slash(isOffHand: boolean) {
    const poses = isOffHand ? [HeroPose.SlashingOffHand1, HeroPose.SlashingOffHand2] : [HeroPose.Slashing1, HeroPose.Slashing2];
    this.animatePoses(poses, 1, this.onSlashFrameChange.bind(this), this.onAttackComplete.bind(this));
  }

  private punch(isOffHand: boolean) {
    const poses = isOffHand ? [HeroPose.PunchingOffHand1, HeroPose.PunchingOffHand2] : [HeroPose.Punching1, HeroPose.Punching2];
    this.animatePoses(poses, 1, this.onPunchFrameChange.bind(this), this.onAttackComplete.bind(this));
  }

  private onPunchFrameChange(frameNum: number) {
    if (frameNum === 1) this.addAttack();
  }

  private onSlashFrameChange(frameNum: number) {
    if (frameNum === 1) this.addAttack();
  }

  private addAttack() {
    const isOffHand = this.state === HeroState.AttackingOffHand;
    const weapon = isOffHand ? this.offHandWeapon : this.mainHandWeapon;
    this.addEntityToSystem(weapon.getAttack(this, this.isFacingLeft));
  }

  private onAttackComplete() {
    this.state = HeroState.Nuetral;
    this.continueRunning();
  }

  private pose(pose: HeroPose, flippedHorizontally?: boolean) {
    this.cancelAnimation();
    this.flipSprite(flippedHorizontally);
    switch(pose) {
      case HeroPose.Running1:
        this.frontUpperArmSprite.rotation = Math.PI * 2 / 3;
        this.frontLowerArmSprite.rotation = Math.PI / -2;
        this.mainHandWeaponSprite.rotation = Math.PI / -2;
        this.backUpperArmSprite.rotation = Math.PI / 3;
        this.backLowerArmSprite.rotation = Math.PI / -2;
        this.offHandWeaponSprite.rotation = Math.PI / -2;
        this.frontUpperLegSprite.rotation = Math.PI / -3;
        this.frontLowerLegSprite.rotation = Math.PI / 3;
        this.backUpperLegSprite.rotation = Math.PI / 3;
        this.backLowerLegSprite.rotation = Math.PI / 3;
        this.sprite.rotation = 0;
        break;
      case HeroPose.Jumping:
      case HeroPose.Running3:
        this.frontUpperArmSprite.rotation = Math.PI / 3;
        this.frontLowerArmSprite.rotation = Math.PI / -2;
        this.mainHandWeaponSprite.rotation = Math.PI / -2;
        this.backUpperArmSprite.rotation = Math.PI * 2 / 3;
        this.backLowerArmSprite.rotation = Math.PI / -2;
        this.offHandWeaponSprite.rotation = Math.PI / -2;
        this.frontUpperLegSprite.rotation = Math.PI / 3;
        this.frontLowerLegSprite.rotation = Math.PI / 3;
        this.backUpperLegSprite.rotation = Math.PI / -3;
        this.backLowerLegSprite.rotation = Math.PI / 3;
        this.sprite.rotation = 0;
        break;
      case HeroPose.Rolling1:
        this.frontUpperArmSprite.rotation = Math.PI / 2;
        this.frontLowerArmSprite.rotation = Math.PI / -2;
        this.mainHandWeaponSprite.rotation = Math.PI / -2;
        this.backUpperArmSprite.rotation = Math.PI / 2;
        this.backLowerArmSprite.rotation = Math.PI / -2;
        this.offHandWeaponSprite.rotation = Math.PI / -2;
        this.frontUpperLegSprite.rotation = Math.PI * -2 / 3;
        this.frontLowerLegSprite.rotation = 0;
        this.backUpperLegSprite.rotation = Math.PI * -2 / 3;
        this.backLowerLegSprite.rotation = 0;
        this.sprite.rotation = Math.PI * 2 / 3;
        break;
      case HeroPose.Rolling2:
        this.frontUpperArmSprite.rotation = Math.PI / 2;
        this.frontLowerArmSprite.rotation = Math.PI / -2;
        this.mainHandWeaponSprite.rotation = Math.PI / -2;
        this.backUpperArmSprite.rotation = Math.PI / 2;
        this.backLowerArmSprite.rotation = Math.PI / -2;
        this.offHandWeaponSprite.rotation = Math.PI / -2;
        this.frontUpperLegSprite.rotation = Math.PI * -2 / 3;
        this.frontLowerLegSprite.rotation = 0;
        this.backUpperLegSprite.rotation = Math.PI * -2 / 3;
        this.backLowerLegSprite.rotation = 0;
        this.sprite.rotation = Math.PI * -2 / 3;
        break;
      case HeroPose.Punching1:
        this.frontUpperArmSprite.rotation = Math.PI * 2 / 3;
        this.frontLowerArmSprite.rotation = Math.PI * -2 / 3;
        this.mainHandWeaponSprite.rotation = Math.PI / -6;
        this.backUpperArmSprite.rotation = Math.PI / 3;
        this.backLowerArmSprite.rotation = Math.PI / -3;
        this.offHandWeaponSprite.rotation = Math.PI / -2;
        this.frontUpperLegSprite.rotation = 0;
        this.frontLowerLegSprite.rotation = 0;
        this.backUpperLegSprite.rotation = 0;
        this.backLowerLegSprite.rotation = 0;
        this.sprite.rotation = 0;
        break;
      case HeroPose.Punching2:
        this.frontUpperArmSprite.rotation = Math.PI / 9;
        this.frontLowerArmSprite.rotation = Math.PI / -9;
        this.mainHandWeaponSprite.rotation = Math.PI / -6;
        this.backUpperArmSprite.rotation = Math.PI * 2 / 3;
        this.backLowerArmSprite.rotation = Math.PI * -2 / 3;
        this.offHandWeaponSprite.rotation = Math.PI / -2;
        this.frontUpperLegSprite.rotation = 0;
        this.frontLowerLegSprite.rotation = 0;
        this.backUpperLegSprite.rotation = 0;
        this.backLowerLegSprite.rotation = 0;
        this.sprite.rotation = 0;
        break;
      case HeroPose.PunchingOffHand1:
        this.frontUpperArmSprite.rotation = Math.PI / 3;
        this.frontLowerArmSprite.rotation = Math.PI / -3;
        this.mainHandWeaponSprite.rotation = Math.PI / -2;
        this.backUpperArmSprite.rotation = Math.PI * 2 / 3;
        this.backLowerArmSprite.rotation = Math.PI * -2 / 3;
        this.offHandWeaponSprite.rotation = Math.PI / -6;
        this.frontUpperLegSprite.rotation = 0;
        this.frontLowerLegSprite.rotation = 0;
        this.backUpperLegSprite.rotation = 0;
        this.backLowerLegSprite.rotation = 0;
        this.sprite.rotation = 0;
        break;
      case HeroPose.PunchingOffHand2:
        this.frontUpperArmSprite.rotation = Math.PI * 2 / 3;
        this.frontLowerArmSprite.rotation = Math.PI * -2 / 3;
        this.mainHandWeaponSprite.rotation = Math.PI / -2;
        this.backUpperArmSprite.rotation = Math.PI / 9;
        this.backLowerArmSprite.rotation = Math.PI / -9;
        this.offHandWeaponSprite.rotation = Math.PI / -6;
        this.frontUpperLegSprite.rotation = 0;
        this.frontLowerLegSprite.rotation = 0;
        this.backUpperLegSprite.rotation = 0;
        this.backLowerLegSprite.rotation = 0;
        this.sprite.rotation = 0;
        break;
      case HeroPose.Slashing1:
        this.frontUpperArmSprite.rotation = 0;
        this.frontLowerArmSprite.rotation = Math.PI / -2;
        this.mainHandWeaponSprite.rotation = Math.PI / -3;
        this.backUpperArmSprite.rotation = Math.PI / 2;
        this.backLowerArmSprite.rotation = 0;
        this.offHandWeaponSprite.rotation = Math.PI / -2;
        this.frontUpperLegSprite.rotation = 0;
        this.frontLowerLegSprite.rotation = 0;
        this.backUpperLegSprite.rotation = 0;
        this.backLowerLegSprite.rotation = 0;
        this.sprite.rotation = 0;
        break;
      case HeroPose.Slashing2:
        this.frontUpperArmSprite.rotation = Math.PI / 3;
        this.frontLowerArmSprite.rotation = 0;
        this.mainHandWeaponSprite.rotation = Math.PI / -3;
        this.backUpperArmSprite.rotation = Math.PI / 2;
        this.backLowerArmSprite.rotation = 0;
        this.offHandWeaponSprite.rotation = Math.PI / -2;
        this.frontUpperLegSprite.rotation = 0;
        this.frontLowerLegSprite.rotation = 0;
        this.backUpperLegSprite.rotation = 0;
        this.backLowerLegSprite.rotation = 0;
        this.sprite.rotation = 0;
        break;
      case HeroPose.SlashingOffHand1:
        this.frontUpperArmSprite.rotation = Math.PI / 2;
        this.frontLowerArmSprite.rotation = 0;
        this.mainHandWeaponSprite.rotation = Math.PI / -2;
        this.backUpperArmSprite.rotation = 0;
        this.backLowerArmSprite.rotation = Math.PI / -2;
        this.offHandWeaponSprite.rotation = Math.PI / -3;
        this.frontUpperLegSprite.rotation = 0;
        this.frontLowerLegSprite.rotation = 0;
        this.backUpperLegSprite.rotation = 0;
        this.backLowerLegSprite.rotation = 0;
        this.sprite.rotation = 0;
        break;
      case HeroPose.SlashingOffHand2:
        this.frontUpperArmSprite.rotation = Math.PI / 2;
        this.frontLowerArmSprite.rotation = 0;
        this.mainHandWeaponSprite.rotation = Math.PI / -2;
        this.backUpperArmSprite.rotation = Math.PI / 3;
        this.backLowerArmSprite.rotation = 0;
        this.offHandWeaponSprite.rotation = Math.PI / -3;
        this.frontUpperLegSprite.rotation = 0;
        this.frontLowerLegSprite.rotation = 0;
        this.backUpperLegSprite.rotation = 0;
        this.backLowerLegSprite.rotation = 0;
        this.sprite.rotation = 0;
        break;
      case HeroPose.Running2:
      case HeroPose.Standing:
      default:
        this.frontUpperArmSprite.rotation = Math.PI / 2;
        this.frontLowerArmSprite.rotation = 0;
        this.mainHandWeaponSprite.rotation = Math.PI / -2;
        this.backUpperArmSprite.rotation = Math.PI / 2;
        this.backLowerArmSprite.rotation = 0;
        this.offHandWeaponSprite.rotation = Math.PI / -2;
        this.frontUpperLegSprite.rotation = 0;
        this.frontLowerLegSprite.rotation = 0;
        this.backUpperLegSprite.rotation = 0;
        this.backLowerLegSprite.rotation = 0;
        this.sprite.rotation = 0;
        break;
    }
  }

  private animatePoses(poses: Array<HeroPose>, animationSpeed: number, onFrameChange?: (frameNum: number) => void, onLoop?: () => void, flippedHorizontally?: boolean) {
    this.cancelAnimation();
    this.animatePoseAtIndex(0, poses, animationSpeed, onFrameChange, onLoop, flippedHorizontally);
  }

  private animatePoseAtIndex(poseIndex: number, poses: Array<HeroPose>, animationSpeed: number, onFrameChange?: (frameNum: number) => void, onLoop?: () => void, flippedHorizontally?: boolean) {
    this.pose(poses[poseIndex], flippedHorizontally);

    let nextPoseIndex = poseIndex + 1;
    if (nextPoseIndex >= poses.length) nextPoseIndex = 0;

    this.animationTicksOut = setTicksOut(() => {
      this.animatePoseAtIndex(nextPoseIndex, poses, animationSpeed,  onFrameChange, onLoop, flippedHorizontally);
      if (onFrameChange) onFrameChange(nextPoseIndex);
      if (nextPoseIndex === 0 && onLoop) onLoop();
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
