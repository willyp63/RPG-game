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
import InstantAttack from "../../../engine/entities/instant-attack";

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

const PUNCH_ENERGY_COST = 10;
const PUNCH_POSITION = new Vector(12, 2);
const PUNCH_SIZE = 8;
const PUNCH_FORCE = new Vector(2, 0);
const PUNCH_DAMAGE = 5;

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
    private _helm: Helm | undefined,
    private _chestPiece: ChestPiece | undefined,
    private _legGuards: LegGuards | undefined,
    private _mainHandWeapon: Weapon | undefined,
    private _offHandWeapon: Weapon | undefined,
  ) {
    super(position);
  }

  init() {
    super.init();

    this.setupAnimation(
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
                  'chest-piece-back-lower-arm',
                  this._chestPiece ? this._chestPiece.lowerArmTexture : undefined,
                  Vector.zero,
                  this._chestPiece ? this._chestPiece.lowerArmAnchor : Vector.zero,
                ),
                new SkeletalSprite(
                  'off-hand-weapon',
                  this._offHandWeapon ? this._offHandWeapon.texture : undefined,
                  WEAPON_POSITION,
                  this._offHandWeapon ? this._offHandWeapon.anchor : Vector.zero,
                ),
              ],
            ),
            new SkeletalSprite(
              'chest-piece-back-upper-arm',
              this._chestPiece ? this._chestPiece.upperArmTexture : undefined,
              Vector.zero,
              this._chestPiece ? this._chestPiece.upperArmAnchor : Vector.zero,
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
                  'leg-guards-back-lower-leg',
                  this._legGuards ? this._legGuards.lowerLegTexture : undefined,
                  Vector.zero,
                  this._legGuards ? this._legGuards.lowerLegAnchor : Vector.zero,
                ),
              ],
            ),
            new SkeletalSprite(
              'leg-guards-back-upper-leg',
              this._legGuards ? this._legGuards.upperLegTexture : undefined,
              Vector.zero,
              this._legGuards ? this._legGuards.upperLegAnchor : Vector.zero,
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
              this._chestPiece ? this._chestPiece.texture : undefined,
              Vector.zero,
              this._chestPiece ? this._chestPiece.anchor : Vector.zero,
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
              this._helm ? this._helm.texture : undefined,
              Vector.zero,
              this._helm ? this._helm.anchor : Vector.zero,
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
                  'leg-guards-front-lower-leg',
                  this._legGuards ? this._legGuards.lowerLegTexture : undefined,
                  Vector.zero,
                  this._legGuards ? this._legGuards.lowerLegAnchor : Vector.zero,
                ),
              ],
            ),
            new SkeletalSprite(
              'leg-guards-front-upper-leg',
              this._legGuards ? this._legGuards.upperLegTexture : undefined,
              Vector.zero,
              this._legGuards ? this._legGuards.upperLegAnchor : Vector.zero,
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
                  this._mainHandWeapon ? this._mainHandWeapon.texture : undefined,
                  WEAPON_POSITION,
                  this._mainHandWeapon ? this._mainHandWeapon.anchor : Vector.zero,
                ),
                new SkeletalSprite(
                  '',
                  Hero.lowerArmTexture,
                  Vector.zero,
                  LOWER_ARM_ANCHOR,
                ),
                new SkeletalSprite(
                  'chest-piece-front-lower-arm',
                  this._chestPiece ? this._chestPiece.lowerArmTexture : undefined,
                  Vector.zero,
                  this._chestPiece ? this._chestPiece.lowerArmAnchor : Vector.zero,
                ),
              ],
            ),
            new SkeletalSprite(
              'chest-piece-front-upper-arm',
              this._chestPiece ? this._chestPiece.upperArmTexture : undefined,
              Vector.zero,
              this._chestPiece ? this._chestPiece.upperArmAnchor : Vector.zero,
            ),
          ],
        ),
      ],
      animations.standing().frames[0],
    );

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

  set helm(helm: Helm | undefined) {
    this._helm = helm;
    this.updateSprite('helm', this._helm ? this._helm.texture : undefined, this._helm ? this._helm.anchor : Vector.zero);
  }

  set chestPiece(chestPiece: ChestPiece | undefined) {
    this._chestPiece = chestPiece;
    this.updateSprite('chest-piece', this._chestPiece ? this._chestPiece.texture : undefined, this._chestPiece ? this._chestPiece.anchor : Vector.zero);
    this.updateSprite('chest-piece-back-upper-arm', this._chestPiece ? this._chestPiece.upperArmTexture : undefined, this._chestPiece ? this._chestPiece.upperArmAnchor : Vector.zero);
    this.updateSprite('chest-piece-front-upper-arm', this._chestPiece ? this._chestPiece.upperArmTexture : undefined, this._chestPiece ? this._chestPiece.upperArmAnchor : Vector.zero);
    this.updateSprite('chest-piece-back-lower-arm', this._chestPiece ? this._chestPiece.lowerArmTexture : undefined, this._chestPiece ? this._chestPiece.lowerArmAnchor : Vector.zero);
    this.updateSprite('chest-piece-front-lower-arm', this._chestPiece ? this._chestPiece.lowerArmTexture : undefined, this._chestPiece ? this._chestPiece.lowerArmAnchor : Vector.zero);
  }

  set legGuards(legGuards: LegGuards | undefined) {
    this._legGuards = legGuards;
    this.updateSprite('leg-guards-back-upper-leg', this._legGuards ? this._legGuards.upperLegTexture : undefined, this._legGuards ? this._legGuards.upperLegAnchor : Vector.zero);
    this.updateSprite('leg-guards-front-upper-leg', this._legGuards ? this._legGuards.upperLegTexture : undefined, this._legGuards ? this._legGuards.upperLegAnchor : Vector.zero);
    this.updateSprite('leg-guards-back-lower-leg', this._legGuards ? this._legGuards.lowerLegTexture : undefined, this._legGuards ? this._legGuards.lowerLegAnchor : Vector.zero);
    this.updateSprite('leg-guards-front-lower-leg', this._legGuards ? this._legGuards.lowerLegTexture : undefined, this._legGuards ? this._legGuards.lowerLegAnchor : Vector.zero);
  }

  set mainHandWeapon(mainHandWeapon: Weapon | undefined) {
    this._mainHandWeapon = mainHandWeapon;
    this.updateSprite('main-hand-weapon', this._mainHandWeapon ? this._mainHandWeapon.texture : undefined, this._mainHandWeapon ? this._mainHandWeapon.anchor : Vector.zero);
  }

  set offHandWeapon(offHandWeapon: Weapon | undefined) {
    this._offHandWeapon = offHandWeapon;
    this.updateSprite('off-hand-weapon', this._offHandWeapon ? this._offHandWeapon.texture : undefined, this._offHandWeapon ? this._offHandWeapon.anchor : Vector.zero);
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

    if (weapon) {
      if (this.energy < weapon.attackEnergyCost || this.mana < weapon.attackManaCost) return;

      this.runForce = Vector.zero;
      this.state = isOffHand ? HeroState.AttackingOffHand : HeroState.AttackingMainHand;

      this.energy -= weapon.attackEnergyCost;
      this.mana -= weapon.attackManaCost;

      switch(weapon.attackType) {
        case WeaponAttackType.Slash:
          this.slash(isOffHand);
          break;
        case WeaponAttackType.Punch:
        default:
          this.punch(isOffHand);
          break;
      }
    } else {
      if (this.energy < PUNCH_ENERGY_COST) return;

      this.runForce = Vector.zero;
      this.state = isOffHand ? HeroState.AttackingOffHand : HeroState.AttackingMainHand;

      this.energy -= PUNCH_ENERGY_COST;
      
      this.punch(isOffHand);
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

    if (weapon) {
      weapon.onAttack(this, this.isFacingLeft);
    } else {
      this.addEntityToSystem(new InstantAttack(
        this.position.plus(PUNCH_POSITION.flippedHorizontally(this.isFacingLeft)),
        this,
        PUNCH_SIZE,
        PUNCH_FORCE,
        PUNCH_DAMAGE,
        true,
      ));
    }
  }

  private onAttackComplete() {
    this.state = HeroState.Nuetral;
    this.continueRunning();
  }

  private static get rollPositionOffset() {
    return SIZE.minus(ROLLING_SIZE).times(0.5);
  }

}
