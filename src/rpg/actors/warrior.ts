import { loader, extras } from "pixi.js";
import KeyListener from "../../engine/interaction/key-listener";
import StabAttack from "./stab-attack";
import PIXIEntity from "../../engine/pixi/pixi-entity";
import Vector from "../../engine/core/vector";
import Direction from "../../engine/core/direction";

const TEXTURES_FILE = "public/imgs/warrior.json";

export default class Warrior extends PIXIEntity {

  static assets = [TEXTURES_FILE];

  get size() { return new Vector(16, 35); }
  get isGravityBound() { return true; }
  get isWallBound() { return true; }

  static get _textures() {
    const textures = loader.resources[TEXTURES_FILE].textures;
    if (!textures) throw "Can't find textures for Warrior!!";
    return textures;
  }

  static get _runTextures() { return [
    Warrior._textures["run_1.png"],
    Warrior._textures["run_2.png"],
    Warrior._textures["run_3.png"],
    Warrior._textures["run_2.png"],
  ]; }

  static get _stabTextures() { return [
    Warrior._textures["stab_1.png"],
    Warrior._textures["stab_2.png"],
  ]; }

  private _leftDown = false;
  private _rightDown = false;
  private _isStabbing = false;
  private _isOnGround = false;
  private _runForce = new Vector(0, 0);

  get sprite() { return <extras.AnimatedSprite>this._sprite; }

  constructor(position: Vector) {
    super(
      new extras.AnimatedSprite(Warrior._runTextures),
      position,
    );

    this.sprite.animationSpeed = 0.1;
    this.sprite.gotoAndStop(1);

    new KeyListener(37 /* left arrow */,
      () => {
        this._goLeft();
        this._leftDown = true;
      },
      () => {
        this._rightDown ? this._goRight() : this._stop();
        this._leftDown = false;
      },
    );

    new KeyListener(39 /* right arrow */,
      () => {
        this._goRight();
        this._rightDown = true;
      },
      () => {
        this._leftDown ? this._goLeft() : this._stop();
        this._rightDown = false;
      },
    );

    new KeyListener(38 /* up arrow */,
      () => this._jump(),
    );

    new KeyListener(65 /* `a` */,
      () => this.stab(),
    );
  }

  afterTick() {
    if (this.isTouchingWallsInAllDirections([Direction.Down])) {
      this.push(this._runForce);

      this._isOnGround = true;
    } else {
      if (Math.abs(this.velocity.x) < 2) {
        this.push(this._runForce.scaled(0.333));
      }

      this._isOnGround = false;
    }
  }

  _goLeft() {
    if (this._isStabbing) return;

    this._runForce = new Vector(-0.25, 0);
    this.sprite.scale.x = -1;
    this.sprite.gotoAndPlay(0);
  }

  _goRight() {
    if (this._isStabbing) return;

    this._runForce = new Vector(0.25, 0);
    this.sprite.scale.x = 1;
    this.sprite.gotoAndPlay(0);
  }

  _stop() {
    if (this._isStabbing) return;

    this._runForce = new Vector(0, 0);
    this.sprite.gotoAndStop(1);
  }

  _jump() {
    if (this._isStabbing) return;

    if (this._isOnGround) this.push(new Vector(0, -7));
  }

  stab() {
    if (this._isStabbing) return;
    this._isStabbing = true;

    this._runForce = new Vector(0, 0);

    this.sprite.textures = Warrior._stabTextures;
    this.sprite.loop = false;
    this.sprite.onComplete = () => {
      this._isStabbing = false;

      const stabAttack = new StabAttack(
        new Vector(
          this.sprite.scale.x === 1 ? this.position.x + 24 : this.position.x - 24,
          this.position.y + 2,
        ),
      );
      this.addEntityToSystem(stabAttack);

      this.sprite.textures = Warrior._runTextures;
      this.sprite.loop = true;
      this.sprite.onComplete = () => {};

      if (this._rightDown) {
        this._goRight();
      } else if (this._leftDown) {
        this._goLeft();
      } else {
        this._stop();
      }
    };
    this.sprite.play();
  }

}