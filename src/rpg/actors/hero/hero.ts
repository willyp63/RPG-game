import Vector from "../../../engine/core/vector";
import TextureHelper from "../../../engine/pixi/texture-helper";
import KeyListener from "../../../engine/interaction/key-listener";
import Direction from "../../../engine/core/direction";
import { EntityType } from "../../../engine/core/entity";
import SkeletalAnimatedPIXIEntity, { SkeletalSprite } from "../../../engine/pixi/skeletal-animated-pixi-entity";
import animations from "./animations";
import Helm from "../../items/helms/helm";
import ChestPiece from "../../items/chest-pieces/chest-piece";
import LegGuards from "../../items/leg-guards/leg-guards";
import Weapon, { WeaponAttackType } from "../../items/weapons/weapon";

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

  static get assets() { return [TEXTURES_FILE]; }
  private static get headTexture() { return TextureHelper.get(TEXTURES_FILE, "man__head.png"); }
  private static get chestTexture() { return TextureHelper.get(TEXTURES_FILE, "man__chest.png"); }
  private static get upperArmTexture() { return TextureHelper.get(TEXTURES_FILE, "man__upper-arm.png"); }
  private static get lowerArmTexture() { return TextureHelper.get(TEXTURES_FILE, "man__lower-arm.png"); }
  private static get upperLegTexture() { return TextureHelper.get(TEXTURES_FILE, "man__upper-leg.png"); }
  private static get lowerLegTexture() { return TextureHelper.get(TEXTURES_FILE, "man__lower-leg.png"); }

  private keyListeners: Array<KeyListener> = [];
  private rightKeyDown = false;
  private leftKeyDown = false;
  private state = HeroState.Nuetral;
  private runState = HeroRunState.Standing;
  private runForce = Vector.zero;
  private isOnGround = false;
  private isJumping = false;

  public energy = MAX_ENERGY;
  public mana = MAX_MANA;
  
  constructor(
    position: Vector,
    private _helm: Helm,
    private _chestPiece: ChestPiece,
    private _legGuards: LegGuards,
    private _mainHandWeapon: Weapon,
    private _offHandWeapon: Weapon,
  ) {
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
                  _chestPiece.lowerArmTexture,
                  Vector.zero,
                  _chestPiece.lowerArmAnchor,
                ),
                new SkeletalSprite(
                  'off-hand-weapon',
                  _offHandWeapon.texture,
                  WEAPON_POSITION,
                  _offHandWeapon.anchor,
                ),
              ],
            ),
            new SkeletalSprite(
              '',
              _chestPiece.upperArmTexture,
              Vector.zero,
              _chestPiece.upperArmAnchor,
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
                  _legGuards.lowerLegTexture,
                  Vector.zero,
                  _legGuards.lowerLegAnchor,
                ),
              ],
            ),
            new SkeletalSprite(
              '',
              _legGuards.upperLegTexture,
              Vector.zero,
              _legGuards.upperLegAnchor,
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
              _chestPiece.texture,
              Vector.zero,
              _chestPiece.anchor,
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
              _helm.texture,
              Vector.zero,
              _helm.anchor,
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
                  _legGuards.lowerLegTexture,
                  Vector.zero,
                  _legGuards.lowerLegAnchor,
                ),
              ],
            ),
            new SkeletalSprite(
              '',
              _legGuards.upperLegTexture,
              Vector.zero,
              _legGuards.upperLegAnchor,
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
                  _mainHandWeapon.texture,
                  WEAPON_POSITION,
                  _mainHandWeapon.anchor,
                ),
                new SkeletalSprite(
                  '',
                  Hero.lowerArmTexture,
                  Vector.zero,
                  LOWER_ARM_ANCHOR,
                ),
                new SkeletalSprite(
                  '',
                  _chestPiece.lowerArmTexture,
                  Vector.zero,
                  _chestPiece.lowerArmAnchor,
                ),
              ],
            ),
            new SkeletalSprite(
              '',
              _chestPiece.upperArmTexture,
              Vector.zero,
              _chestPiece.upperArmAnchor,
            ),
          ],
        ),
      ],
      animations.standing().frames[0],
    );
  }

  init() {
    super.init();

    this.hideHealthBar();
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
      this.push(this.runForce.times(MID_AIR_RUN_SCALE));
    }
    
    if (this.state === HeroState.Nuetral) {
      if (this.energy < this.maxEnergy) this.energy += ENERGY_REGEN;
      else this.energy =  this.maxEnergy;
    }
  }

  destroy() {
    super.destroy();

    this.keyListeners.forEach(keyListener => keyListener.destroy());
  }

  set helm(helm: Helm) {
    this._helm = helm;
    console.log(this._helm);
    // TODO
  }

  set chestPiece(chestPiece: ChestPiece) {
    this._chestPiece = chestPiece;
    console.log(this._chestPiece);
    // TODO
  }

  set legGuards(legGuards: LegGuards) {
    this._legGuards = legGuards;
    console.log(this._legGuards);
    // TODO
  }

  set mainHandWeapon(mainHandWeapon: Weapon) {
    this._mainHandWeapon = mainHandWeapon;
    console.log(this._mainHandWeapon);
    // TODO
  }

  set offHandWeapon(offHandWeapon: Weapon) {
    this._offHandWeapon = offHandWeapon;
    console.log(this._offHandWeapon);
    // TODO
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

    this.runForce = Vector.zero;

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

    this.runForce = Vector.zero;
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

    const weapon = isOffHand ? this._offHandWeapon : this._mainHandWeapon;

    if (this.energy < weapon.attackEnergyCost || this.mana < weapon.attackManaCost) return;

    this.energy -= weapon.attackEnergyCost;
    this.mana -= weapon.attackManaCost;

    this.runForce = Vector.zero;
    this.state = isOffHand ? HeroState.AttackingOffHand : HeroState.AttackingMainHand;

    switch(weapon.attackType) {
      case WeaponAttackType.Slash:
        this.slash(isOffHand);
        break;
      case WeaponAttackType.Punch:
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
    const weapon = isOffHand ? this._offHandWeapon : this._mainHandWeapon;
    weapon.onAttack(this, this.isFacingLeft);
  }

  private onAttackComplete() {
    this.state = HeroState.Nuetral;
    this.continueRunning();
  }

  private static get rollPositionOffset() {
    return SIZE.minus(ROLLING_SIZE).times(0.5);
  }

}
