import { loader, extras } from "pixi.js";
import PIXIEntity from "../../engine/pixi/pixi-entity";
import Vector from "../../engine/core/vector";
import Direction from "../../engine/core/direction";
import Entity from "../../engine/core/entity";
import Collision from "../../engine/core/collision";
import EntityType from "../../engine/core/entity-type";

const TEXTURES_FILE = "public/imgs/slime.json";

export default class Slime extends PIXIEntity {

  static assets = [TEXTURES_FILE];

  get type() { return EntityType.Unfriendly; }
  get size() { return new Vector(22, 16); }
  get elasticity() { return 1; }
  get isGravityBound() { return true; }
  get isWallBound() { return true; }

  static get _textures() {
    const textures = loader.resources[TEXTURES_FILE].textures;
    if (!textures) throw "Can't find textures for Slime!!";
    return textures;
  }

  static get _slimeTextures() { return [
    Slime._textures["slime_1.png"],
    Slime._textures["slime_2.png"],
    Slime._textures["slime_3.png"],
  ]; }

  private _crawlForce: Vector;
  private _recharging: boolean = false;

  get sprite() { return <extras.AnimatedSprite>this._sprite; }

  constructor(position: Vector) {
    super(
      new extras.AnimatedSprite(Slime._slimeTextures),
      position,
    );

    this.sprite.animationSpeed = 0.1;
    this.sprite.gotoAndPlay(0);

    this._crawlForce = new Vector(0.05, 0);
    if (Math.random() < 0.5) this._turnLeft();
  }

  afterTick() {
    super.afterTick();

    if (this.isTouchingWallsInAllDirections([Direction.Right])) {
      this._turnLeft();
    }

    if (this.isTouchingWallsInAllDirections([Direction.Left])) {
      this._turnRight();
    }

    if (this.isTouchingWallsInAllDirections([Direction.Down])) {
      this.push(this._crawlForce);
    }
  }

  onCollision(otherEntity: Entity, collision: Collision) {
    super.onCollision(otherEntity, collision);

    if (collision.hit) {
      if (!this._recharging && otherEntity.type === EntityType.Friendly) {

        if (this.position.x < otherEntity.position.x) {
          otherEntity.push(new Vector(2, -1));
        } else {
          otherEntity.push(new Vector(-2, -1));
        }
  
        this._recharging = true;
        setTimeout(() => this._recharging = false, 100);
      }
    }
  }

  _turnRight() {
    this._crawlForce = new Vector(0.05, 0);
    this.sprite.scale.x = 1;
  }

  _turnLeft() {
    this._crawlForce = new Vector(-0.05, 0);
    this.sprite.scale.x = -1;
  }

}
