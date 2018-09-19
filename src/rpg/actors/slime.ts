import { Actor } from "../../engine/stage";
import { loader, extras } from "pixi.js";
import { Vector, Collision, Direction } from "../../engine/physics";

export default class Slime extends Actor {

  static assets = ["imgs/slime.json"];
  static isWallBound = true;
  static isGravityBound = true;

  static get _textures() {
    const textures = loader.resources["imgs/slime.json"].textures;
    if (!textures) throw "Can't find textures for Slime";
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
    if (this.isTouchingWallsInAllDirections([Direction.Right])) {
      this._turnLeft();
    }

    if (this.isTouchingWallsInAllDirections([Direction.Left])) {
      this._turnRight();
    }

    if (this.isTouchingWallsInAllDirections([Direction.Down])) {
      this.applyForce(this._crawlForce);
    }
  }

  onCollision(otherActor: Actor, collision: Collision) {
    super.onCollision(otherActor, collision);

    if (otherActor.isFriendly && !this._recharging) {
      let attackForce = otherActor.position.minus(this.position).toUnitVector().scaled(new Vector(4, 1));
      if (attackForce.x === 0) attackForce = attackForce.withNewX(2);
      else if (attackForce.x < 2) attackForce = attackForce.x > 0 ? attackForce.withNewX(2) : attackForce.withNewX(-2);
      otherActor.applyForce(attackForce);

      this._recharging = true;
      setTimeout(() => this._recharging = false, 250);
    }
  }

  _turnRight() {
    this.velocity = this.velocity.scaled(new Vector(0, 1));
    this._crawlForce = new Vector(0.05, 0);
    this.sprite.scale.x = 1;
  }

  _turnLeft() {
    this.velocity = this.velocity.scaled(new Vector(0, 1));
    this._crawlForce = new Vector(-0.05, 0);
    this.sprite.scale.x = -1;
  }

}
