import { Vector, Rect, Direction, Collision } from '../physics';
import { Sprite, ObservablePoint } from 'pixi.js';

export default class Actor extends Rect {

  static assets: Array<string> = [];
  static size: Vector;
  static weight: number = 1;
  static isWall: boolean = false;
  static isWallBound: boolean = false; 
  static isGravityBound: boolean = false; 
  static isFriendly: boolean = false; 
  static isStatic: boolean = false; 

  get sprite() { return this._sprite; }
  protected _sprite: Sprite;

  public _isDead = false;
  public _newActors = [];
  public _touchingWallsInDirections = {};

  private get _subclassType() { return <typeof Actor>this.constructor; }

  constructor(
    sprite: Sprite | Function,
    position: Vector,
  ) {
    super(position, Actor.size);

    this._sprite = typeof sprite === 'function' ? sprite() : sprite;
    this._sprite.anchor = <ObservablePoint>{ x: 0.5, y: 0.5 };
    this._sprite.x = this.position.x;
    this._sprite.y = this.position.y;

    if (!Actor.size) {
      this.size = new Vector(this._sprite.width, this._sprite.height);
    }
  }

  afterTick() { }

  onCollision(otherActor: Actor, collision: Collision) { }

  get isWall(): boolean { return this._subclassType.isWall; }
  get isWallBound(): boolean { return this._subclassType.isWallBound; } 
  get isGravityBound(): boolean { return this._subclassType.isGravityBound; } 
  get isFriendly(): boolean { return this._subclassType.isFriendly; } 
  get isStatic(): boolean { return this._subclassType.isStatic; } 

  applyForce(force: Vector) {
    this.acceleration = this.acceleration.plus(force.scaled(1 / Actor.weight));
  }

  addActor(actor: Actor) {
    this._newActors.push(actor);
  }

  isTouchingWallInAnyDirection(directions: Array<Direction>): boolean {
    return directions.some(direction => this._touchingWallsInDirections[direction]);
  }

  isTouchingWallsInAllDirections(directions: Array<Direction>): boolean {
    return directions.every(direction => this._touchingWallsInDirections[direction]);
  }

  kill() {
    this._isDead = true;
  }

}
