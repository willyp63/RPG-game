import Vector from "../../../engine/core/vector";
import TextureHelper from "../../../engine/pixi/texture-helper";
import KeyListener from "../../../engine/interaction/key-listener";
import Direction from "../../../engine/core/direction";
import Helm, { HelmType } from "./equipment/helm";
import ChestPiece, { ChestPieceType } from "./equipment/chest-piece";
import LegGuards, { LegGuardType } from "./equipment/leg-guards";
import Weapon, { WeaponType, AttackType } from "./equipment/weapon";
import { EntityType } from "../../../engine/core/entity";
import SkeletalAnimatedPIXIEntity, { SkeletalSprite } from "../../../engine/pixi/skeletal-animated-pixi-entity";
import animations from "./animations";

const TEXTURES_FILE = 'public/imgs/man.json';

const MAX_HEALTH = 200;
const MAX_MANA = 100;
const MAX_ENERGY = 100;
const ENERGY_REGEN = 0.5;
const ROLL_ENERGY_COST = 25;
const SIZE = new Vector(15, 30);
const ROLLING_SIZE = new Vector(15, 20);
const RUN_FORCE = new Vector(0.25, 0);
const JUMP_FORCE = new Vector(0, -8);
const ROLL_FORCE = new Vector(12, 0);
const MID_AIR_RUN_SCALE = 0.333;

const CHEST_POSITION = new Vector(0, -2);
const CHEST_ANCHOR =  new Vector(0.5, 0.5);
const HEAD_POSITION = new Vector(0, -10);
const HEAD_ANCHOR =  new Vector(0.5, 0.5);
const BACK_LEG_POSITION = new Vector(1.5, 4);
const FRONT_LEG_POSITION = new Vector(-1.5, 4);
const UPPER_LEG_ANCHOR =  new Vector(0.5, 0);
const LOWER_LEG_POSITION = new Vector(0, 6);
const LOWER_LEG_ANCHOR =  new Vector(0.3125, 0);
const BACK_ARM_POSITION = new Vector(4, -4);
const FRONT_ARM_POSITION = new Vector(-4, -4);
const UPPER_ARM_ANCHOR =  new Vector(0, 0.5);
const LOWER_ARM_POSITION = new Vector(7, 0);
const LOWER_ARM_ANCHOR =  new Vector(0, 0.5);
const WEAPON_POSITION = new Vector(4, 0);

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

export default class Hero extends SkeletalAnimatedPIXIEntity {

  get type() { return EntityType.Friendly; }
  get size() { return this.state === HeroState.Rolling ? ROLLING_SIZE : SIZE; }
  get maxHealth() { return MAX_HEALTH; }
  get maxEnergy() { return MAX_ENERGY; }
  get maxMana() { return MAX_MANA; }
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

  private static helm = new Helm(HelmType.None);
  private static chestPiece = new ChestPiece(ChestPieceType.None);
  private static legGuards = new LegGuards(LegGuardType.Iron);
  private static mainHandWeapon = new Weapon(WeaponType.IronSword);
  private static offHandWeapon = new Weapon(WeaponType.RubyStaff);

  private keyListeners: Array<KeyListener> = [];
  private rightKeyDown = false;
  private leftKeyDown = false;
  private state = HeroState.Nuetral;
  private runState = HeroRunState.Standing;
  private runForce = new Vector(0, 0);
  private isOnGround = false;
  private isJumping = false;

  public energy = MAX_ENERGY;
  public mana = MAX_MANA;
  
  constructor(position: Vector) {
    super(
      position,
      [
        // BACK ARM
        new SkeletalSprite(
          'back-upper-arm',
          Hero.upperArmTexture,
          BACK_ARM_POSITION,
          UPPER_ARM_ANCHOR,
          [
            new SkeletalSprite(
              'back-lower-arm',
              Hero.lowerArmTexture,
              LOWER_ARM_POSITION,
              LOWER_ARM_ANCHOR,
              [
                new SkeletalSprite(
                  '',
                  Hero.chestPiece.lowerArmTexture,
                  new Vector(0, 0),
                  LOWER_ARM_ANCHOR,
                ),
                new SkeletalSprite(
                  'off-hand-weapon',
                  Hero.offHandWeapon.texture,
                  WEAPON_POSITION,
                  Hero.offHandWeapon.anchor,
                ),
              ],
            ),
            new SkeletalSprite(
              '',
              Hero.chestPiece.upperArmTexture,
              new Vector(0, 0),
              UPPER_ARM_ANCHOR,
            ),
          ],
        ),
        // BACK LEG
        new SkeletalSprite(
          'back-upper-leg',
          Hero.upperLegTexture,
          BACK_LEG_POSITION,
          UPPER_LEG_ANCHOR,
          [
            new SkeletalSprite(
              'back-lower-leg',
              Hero.lowerLegTexture,
              LOWER_LEG_POSITION,
              LOWER_LEG_ANCHOR,
              [
                new SkeletalSprite(
                  '',
                  Hero.legGuards.lowerLegTexture,
                  new Vector(0, 0),
                  LOWER_LEG_ANCHOR,
                ),
              ],
            ),
            new SkeletalSprite(
              '',
              Hero.legGuards.upperLegTexture,
              new Vector(0, 0),
              UPPER_LEG_ANCHOR,
            ),
          ],
        ),
        // CHEST
        new SkeletalSprite(
          'chest',
          Hero.chestTexture,
          CHEST_POSITION,
          CHEST_ANCHOR,
          [
            new SkeletalSprite(
              'chest-piece',
              Hero.chestPiece.texture,
              CHEST_POSITION,
              CHEST_ANCHOR,
            ),
          ]
        ),
        // HEAD
        new SkeletalSprite(
          'head',
          Hero.headTexture,
          HEAD_POSITION,
          HEAD_ANCHOR,
          [
            new SkeletalSprite(
              'helm',
              Hero.helm.texture,
              HEAD_POSITION,
              HEAD_ANCHOR,
            ),
          ],
        ),
        // FRONT LEG
        new SkeletalSprite(
          'front-upper-leg',
          Hero.upperLegTexture,
          FRONT_LEG_POSITION,
          UPPER_LEG_ANCHOR,
          [
            new SkeletalSprite(
              'front-lower-leg',
              Hero.lowerLegTexture,
              LOWER_LEG_POSITION,
              LOWER_LEG_ANCHOR,
              [
                new SkeletalSprite(
                  '',
                  Hero.legGuards.lowerLegTexture,
                  new Vector(0, 0),
                  LOWER_LEG_ANCHOR,
                ),
              ],
            ),
            new SkeletalSprite(
              '',
              Hero.legGuards.upperLegTexture,
              new Vector(0, 0),
              UPPER_LEG_ANCHOR,
            ),
          ],
        ),
        // FRONT ARM
        new SkeletalSprite(
          'front-upper-arm',
          Hero.upperArmTexture,
          FRONT_ARM_POSITION,
          UPPER_ARM_ANCHOR,
          [
            new SkeletalSprite(
              'front-lower-arm',
              Hero.lowerArmTexture,
              LOWER_ARM_POSITION,
              LOWER_ARM_ANCHOR,
              [
                new SkeletalSprite(
                  'main-hand-weapon',
                  Hero.mainHandWeapon.texture,
                  WEAPON_POSITION,
                  Hero.mainHandWeapon.anchor,
                ),
                new SkeletalSprite(
                  '',
                  Hero.lowerArmTexture,
                  new Vector(0, 0),
                  LOWER_ARM_ANCHOR,
                ),
                new SkeletalSprite(
                  '',
                  Hero.chestPiece.lowerArmTexture,
                  new Vector(0, 0),
                  LOWER_ARM_ANCHOR,
                ),
              ],
            ),
            new SkeletalSprite(
              '',
              Hero.chestPiece.upperArmTexture,
              new Vector(0, 0),
              UPPER_ARM_ANCHOR,
            ),
          ],
        ),
      ],
      animations.standing().frames[0],
    );

    setTimeout(() => {
      if (this._healthBar) this._healthBar.alpha = 0;
    }, 0);

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
    
    if (this.state === HeroState.Nuetral) {
      if (this.energy < this.maxEnergy) this.energy += ENERGY_REGEN;
      else this.energy =  this.maxEnergy;
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
      this.animation = animations.jumping().flippedHorizontally(true);
    } else {
      this.animation = animations.running().flippedHorizontally(true);
    }
  }

  private runRight() {
    this.rightKeyDown = true;
    this.runState = HeroRunState.RunningRight;

    if (this.state !== HeroState.Nuetral) return;

    this.runForce = RUN_FORCE;

    if (this.isJumping) {
      this.animation = animations.jumping().flippedHorizontally(false);
    } else {
      this.animation = animations.running().flippedHorizontally(false);
    }
  }

  private stopRunning() {
    this.rightKeyDown = this.leftKeyDown = false;
    this.runState = HeroRunState.Standing;

    if (this.state !== HeroState.Nuetral) return;

    this.runForce = new Vector(0, 0);

    if (!this.isJumping) this.animation = animations.standing();
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
    
    this.animation = animations.jumping();
  }

  private roll() {
    if (this.state !== HeroState.Nuetral || !this.isOnGround) return;

    if (this.energy < ROLL_ENERGY_COST) return;
    this.energy -= ROLL_ENERGY_COST;

    this.runForce = new Vector(0, 0);
    this.state = HeroState.Rolling;
    this.position = this.position.plus(Hero.rollPositionOffset);
    this.push(ROLL_FORCE.flippedHorizontally(this.isFacingLeft));

    this.isFacingLeft
      ? this.animation = animations.rollingLeft().onLoop(this.onRollComplete.bind(this))
      : this.animation = animations.rollingRight().onLoop(this.onRollComplete.bind(this));
  }

  private onRollComplete() {
    this.state = HeroState.Nuetral;
    this.position = this.position.minus(Hero.rollPositionOffset);
    this.continueRunning();
  }

  private attack(isOffHand = false) {
    if (this.state !== HeroState.Nuetral) return;

    const weapon = isOffHand ? Hero.offHandWeapon : Hero.mainHandWeapon;

    if (this.energy < weapon.energyCost || this.mana < weapon.manaCost) return;

    this.energy -= weapon.energyCost;
    this.mana -= weapon.manaCost;

    this.runForce = new Vector(0, 0);
    this.state = isOffHand ? HeroState.AttackingOffHand : HeroState.AttackingMainHand;

    switch(weapon.attackType) {
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
    const animation = isOffHand ? animations.slashingOffhand() : animations.slashing();
    this.animation = animation
      .onFrameChange(this.onSlashFrameChange.bind(this))
      .onLoop(this.onAttackComplete.bind(this));
  }

  private punch(isOffHand: boolean) {
    const animation = isOffHand ? animations.punchingOffhand() : animations.punching();
    this.animation = animation
      .onFrameChange(this.onPunchFrameChange.bind(this))
      .onLoop(this.onAttackComplete.bind(this));
  }

  private onPunchFrameChange(frameNum: number) {
    if (frameNum === 1) this.addAttack();
  }

  private onSlashFrameChange(frameNum: number) {
    if (frameNum === 1) this.addAttack();
  }

  private addAttack() {
    const isOffHand = this.state === HeroState.AttackingOffHand;
    const weapon = isOffHand ? Hero.offHandWeapon : Hero.mainHandWeapon;
    this.addEntityToSystem(weapon.getAttack(this, this.isFacingLeft));
  }

  private onAttackComplete() {
    this.state = HeroState.Nuetral;
    this.continueRunning();
  }

  private static get rollPositionOffset() {
    return SIZE.minus(ROLLING_SIZE).scaled(0.5);
  }

}
