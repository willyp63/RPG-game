import AnimatedPIXIEntity, { PIXIAnimation } from "../../../../engine/pixi/animated-pixi-entity";
import Vector from "../../../../engine/core/vector";
import Direction from "../../../../engine/core/direction";
import TextureHelper from "../../../../engine/pixi/texture-helper";
import Entity, { EntityType } from "../../../../engine/core/entity";
import Collision from "../../../../engine/core/collision";
import WhelpFireball from './attacks/whelp-fireball';
import setTicksOut from "../../../../engine/util/set-ticks-out";

const TEXTURES_FILE = "public/imgs/whelp.json";
const FLY_ANIMATION_SPEED = 0.05;
const ATTACK_ANIMATION_SPEED = 0.1;

const FLY_FORCE = new Vector(0.0333, 0);
const SIZE = new Vector(40, 34);
const MAX_HEALTH = 80;

const ATTACK_ALERT_DISTANCE = 200;
const ATTACK_PROJECTILE_FORCE = 5;
const ATTACK_RECHARGE_TICKS = 60;

export default class Whelp extends AnimatedPIXIEntity {

  get type() { return EntityType.Unfriendly; }
  get size() { return SIZE; }
  get maxHealth() { return MAX_HEALTH; }
  get isWallBound() { return true; }
  get isSolidBound() { return true; }
  get isFrictionBound() { return true; }

  static get assets() { return [TEXTURES_FILE]; }

  static get flyTextures() { return [
    TextureHelper.get(TEXTURES_FILE, "whelp__flying-1.png"),
    TextureHelper.get(TEXTURES_FILE, "whelp__flying-2.png"),
  ]; }

  private flyForce = Vector.zero;
  private isAttacking = false;
  private isRecharging = false;

  constructor(position: Vector) {
    super(position, Whelp.flyTextures);
  }

  init() {
    super.init();

    Math.random() < 0.5 ? this.flyLeft() : this.flyRight();
  }

  afterTick() {
    super.afterTick();

    if (this.isTouchingWallsInAllDirections([Direction.Right])) {
      this.flyLeft();
    } else if (this.isTouchingWallsInAllDirections([Direction.Left])) {
      this.flyRight();
    }

    this.push(this.flyForce);
  }

  onCollision(otherEntity: Entity, collision: Collision) {
    super.onCollision(otherEntity, collision);

    if (otherEntity.type === EntityType.Friendly) {

      const distanceToOtherEntity = this.position.minus(otherEntity.position).length;
      if (this.isFacingOtherEntity(otherEntity) && distanceToOtherEntity < ATTACK_ALERT_DISTANCE) {
        this.attack(otherEntity);
      }
    }
  }

  private flyRight() {
    if (this.isAttacking) return;

    this.flyForce = FLY_FORCE;

    this.animation =
      new PIXIAnimation(Whelp.flyTextures)
        .speed(FLY_ANIMATION_SPEED)
        .flippedHorizontally(false);
  }

  private flyLeft() {
    if (this.isAttacking) return;

    this.flyForce = FLY_FORCE.flippedHorizontally();

    this.animation =
      new PIXIAnimation(Whelp.flyTextures)
        .speed(FLY_ANIMATION_SPEED)
        .flippedHorizontally();
  }

  private attack(target: Entity) {
    if (this.isRecharging || this.isAttacking) return;
    
    this.flyForce = Vector.zero;
    this.isAttacking = true;
    this.isRecharging = true;
    setTicksOut(() => this.isRecharging = false, ATTACK_RECHARGE_TICKS);

    this.animation =
      new PIXIAnimation(Whelp.flyTextures)
        .speed(ATTACK_ANIMATION_SPEED)
        .onLoop(() => this.onAttackComplete(target));
  }

  private onAttackComplete(target: Entity) {
    if (this.isFacingOtherEntity(target)) {
      const fireball = new WhelpFireball(this.position);
      fireball.push(target.position.minus(this.position).toUnitVector().times(ATTACK_PROJECTILE_FORCE));
      this.addEntityToSystem(fireball);
    }

    this.isAttacking = false;
    if (this.isFacingLeft) this.flyLeft();
    else this.flyRight();
  }

}
