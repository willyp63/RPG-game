import AnimatedPIXIEntity from "../../../engine/pixi/animated-pixi-entity";
import EntityType from "../../../engine/core/entity-type";
import Vector from "../../../engine/core/vector";
import TextureHelper from "../../../engine/pixi/texture-helper";
import Direction from "../../../engine/core/direction";
import PIXIAnimation from "../../../engine/pixi/pixi-animation";
import { HEALTH_BAR_Y_POSITION_PERCENT } from "../../../engine/pixi/pixi-entity";

const TEXTURES_FILE = 'public/imgs/slime.json';
const ANIMATION_SPEED = 0.14;

const SIZE = new Vector(20, 14);
const WEIGHT = 1;
const MAX_HEALTH = 30;
const CRAWL_FORCE = new Vector(0.08, 0);

export enum SlimeSize {
  Small,
  Medium,
  Large,
};

export default class Slime extends AnimatedPIXIEntity {
  get type() { return EntityType.Unfriendly; }
  get isGravityBound() { return true; }
  get isWallBound() { return true; }

  get weight() { return WEIGHT * Slime._getScaleForSlimeSize(this._size); }
  get size() { return SIZE.scaled(Slime._getScaleForSlimeSize(this._size)); }
  get maxHealth() { return MAX_HEALTH * Slime._getScaleForSlimeSize(this._size); }

  static assets = [TEXTURES_FILE];

  static get _crawlTextures() { return [
    TextureHelper.get(TEXTURES_FILE, "slime_1.png"),
    TextureHelper.get(TEXTURES_FILE, "slime_2.png"),
    TextureHelper.get(TEXTURES_FILE, "slime_3.png"),
    TextureHelper.get(TEXTURES_FILE, "slime_2.png"),
  ]; }

  private _crawlForce = CRAWL_FORCE;

  constructor(position: Vector, private _size: SlimeSize) {
    super(position, Slime._crawlTextures);

    this._sprite.scale.x = this._sprite.scale.y = Slime._getScaleForSlimeSize(_size);
    if (this._healthBar) {
      this._healthBar.position.y = this.size.y * -HEALTH_BAR_Y_POSITION_PERCENT;
      this._healthBar.maxHealth = this.maxHealth;
      this.heal(this.maxHealth);
    }

    Math.random() < 0.5 ? this._crawlLeft() : this._crawlRight();
  }

  afterTick() {
    super.afterTick();

    if (this.isTouchingWallsInAllDirections([Direction.Right])) {
      this._crawlLeft();
    }

    if (this.isTouchingWallsInAllDirections([Direction.Left])) {
      this._crawlRight();
    }

    if (this.isTouchingWallsInAllDirections([Direction.Down])) {
      this.push(this._crawlForce);
    }
  }

  kill() {
    super.kill();

    if (this._size === SlimeSize.Large) {
      this.addEntityToSystem(new Slime(this.position.plus(new Vector(-8, 0)), SlimeSize.Medium));
      this.addEntityToSystem(new Slime(this.position.plus(new Vector(8, 0)), SlimeSize.Medium));
    } else if (this._size === SlimeSize.Medium) {
      this.addEntityToSystem(new Slime(this.position.plus(new Vector(-4, 0)), SlimeSize.Small));
      this.addEntityToSystem(new Slime(this.position.plus(new Vector(4, 0)), SlimeSize.Small));
    }
  }

  _crawlLeft() {
    this._crawlForce = CRAWL_FORCE.scaled(1 / Slime._getScaleForSlimeSize(this._size)).flippedHorizontally();

    this.animation =
      new PIXIAnimation(Slime._crawlTextures)
        .speed(ANIMATION_SPEED / Slime._getScaleForSlimeSize(this._size))
        .flippedHorizontally();
  }

  _crawlRight() {
    this._crawlForce = CRAWL_FORCE.scaled(1 / Slime._getScaleForSlimeSize(this._size));

    this.animation =
      new PIXIAnimation(Slime._crawlTextures)
        .speed(ANIMATION_SPEED / Slime._getScaleForSlimeSize(this._size))
        .flippedHorizontally(false);
  }

  private static _getScaleForSlimeSize(size: SlimeSize) {
    if (size === SlimeSize.Medium) return 2;
    if (size === SlimeSize.Large) return 4;
    return 1;
  }

}