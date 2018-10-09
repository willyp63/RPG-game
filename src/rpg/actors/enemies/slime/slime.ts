import AnimatedPIXIEntity, { PIXIAnimation } from "../../../../engine/pixi/animated-pixi-entity";
import Vector from "../../../../engine/core/vector";
import TextureHelper from "../../../../engine/pixi/texture-helper";
import Direction from "../../../../engine/core/direction";
import { EntityType } from "../../../../engine/core/entity";

const TEXTURES_FILE = 'public/imgs/slime.json';
const ANIMATION_SPEED = 0.14;

const SIZE = new Vector(20, 14);
const WEIGHT = 2;
const MAX_HEALTH = 30;
const CRAWL_FORCE = new Vector(0.08, 0);
const SPAWN_OFFSET = new Vector(4, -4);
const SPWAN_FORCE = new Vector(0.5, -1.5);
const ELASTICITY = 1;

export enum SlimeSize {
  Small,
  Medium,
  Large,
};

export default class Slime extends AnimatedPIXIEntity {
  get type() { return EntityType.Unfriendly; }
  get isGravityBound() { return true; }
  get isWallBound() { return true; }
  get isSolidBound() { return true; }
  get isSolid() { return this._size !== SlimeSize.Small; }
  get isFrictionBound() { return true; }

  get weight() { return WEIGHT * this._scale; }
  get size() { return SIZE.times(this._scale); }
  get elasticity() { return ELASTICITY; }
  get maxHealth() { return MAX_HEALTH * this._scale; }

  static get assets() { return [TEXTURES_FILE]; }

  static get _crawlTextures() { return [
    TextureHelper.get(TEXTURES_FILE, "slime_1.png"),
    TextureHelper.get(TEXTURES_FILE, "slime_2.png"),
    TextureHelper.get(TEXTURES_FILE, "slime_3.png"),
    TextureHelper.get(TEXTURES_FILE, "slime_2.png"),
  ]; }

  private _crawlForce = CRAWL_FORCE;
  private _scale: number;

  constructor(position: Vector, private _size: SlimeSize) {
    super(position, Slime._crawlTextures);

    this._scale = Slime._getScaleForSlimeSize(_size);
    this._sprite.scale.x = this._sprite.scale.y = this._scale;
  }

  init() {
    super.init();
    
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
      const spawn1 = new Slime(this.position.plus(SPAWN_OFFSET.times(this._scale)), SlimeSize.Medium);
      const spawn2 = new Slime(this.position.plus(SPAWN_OFFSET.times(this._scale).flippedHorizontally()), SlimeSize.Medium);
      spawn1.push(SPWAN_FORCE.times(this._scale));
      spawn2.push(SPWAN_FORCE.times(this._scale).flippedHorizontally());
      this.addEntityToSystem(spawn1);
      this.addEntityToSystem(spawn2);
    } else if (this._size === SlimeSize.Medium) {
      const spawn1 = new Slime(this.position.plus(SPAWN_OFFSET.times(this._scale)), SlimeSize.Small);
      const spawn2 = new Slime(this.position.plus(SPAWN_OFFSET.times(this._scale).flippedHorizontally()), SlimeSize.Small);
      spawn1.push(SPWAN_FORCE.times(this._scale));
      spawn2.push(SPWAN_FORCE.times(this._scale).flippedHorizontally());
      this.addEntityToSystem(spawn1);
      this.addEntityToSystem(spawn2);
    }
  }

  _crawlLeft() {
    this._crawlForce = CRAWL_FORCE.times(1 / this._scale).flippedHorizontally();

    this.animation =
      new PIXIAnimation(Slime._crawlTextures)
        .speed(ANIMATION_SPEED / this._scale)
        .flippedHorizontally();
  }

  _crawlRight() {
    this._crawlForce = CRAWL_FORCE.times(1 / this._scale);

    this.animation =
      new PIXIAnimation(Slime._crawlTextures)
        .speed(ANIMATION_SPEED / this._scale)
        .flippedHorizontally(false);
  }

  private static _getScaleForSlimeSize(size: SlimeSize) {
    if (size === SlimeSize.Medium) return 2;
    if (size === SlimeSize.Large) return 4;
    return 1;
  }

}