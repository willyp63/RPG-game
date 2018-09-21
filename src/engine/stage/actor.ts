import { Vector, Rect, Direction, Collision } from '../physics';
import { Sprite, ObservablePoint } from 'pixi.js';

export default class Actor {

  static assets: Array<string> = [];
  static size: Vector;
  static weight = 1;
  static maxAcceleration = 16;
  static isWall = false;
  static isWallBound = false; 
  static isGravityBound = false; 
  static isFriendly = false; 
  static isStatic = false; 

  get sprite() { return this._sprite; }
  protected _sprite: Sprite;

  get bounds() { return this._bounds; }
  protected _bounds: Rect;

  public _isDead = false;
  public _newActors: Array<Actor> = [];
  public _touchingWallsInDirections: {
    [Direction.Up]?: Actor,
    [Direction.Down]?: Actor,
    [Direction.Right]?: Actor,
    [Direction.Left]?: Actor,
  } = {};

  private get _subclassType() { return <typeof Actor>this.constructor; }

  constructor(
    sprite: Sprite | Function,
    position: Vector,
  ) {
    this._sprite = typeof sprite === 'function' ? sprite() : sprite;
    this._sprite.anchor = <ObservablePoint>{ x: 0.5, y: 0.5 };
    this._bounds = new Rect(position, this._subclassType.size || new Vector(this._sprite.width, this._sprite.height));
    this._sprite.x = this.bounds.position.x;
    this._sprite.y = this.bounds.position.y;
  }

  tick() {
    this.bounds.velocity = this.bounds.velocity.plus(this.bounds.acceleration.capped(this._subclassType.maxAcceleration));
    this.bounds.position = this.bounds.position.plus(this.bounds.velocity);
    this.bounds.acceleration = new Vector(0, 0);
  }

  afterTick() { }

  onCollision(otherActor: Actor, collision: Collision) { }

  get isWall(): boolean { return this._subclassType.isWall; }
  get isWallBound(): boolean { return this._subclassType.isWallBound; } 
  get isGravityBound(): boolean { return this._subclassType.isGravityBound; } 
  get isFriendly(): boolean { return this._subclassType.isFriendly; } 
  get isStatic(): boolean { return this._subclassType.isStatic; } 

  applyForce(force: Vector) {
    this.bounds.acceleration = this.bounds.acceleration.plus(force.scaled(1 / this._subclassType.weight));
  }

  addActor(actor: Actor) {
    this._newActors.push(actor);
  }

  isTouchingWallInAnyDirection(directions: Array<Direction>): boolean {
    return directions.some(direction => this._touchingWallsInDirections[direction] !== undefined);
  }

  isTouchingWallsInAllDirections(directions: Array<Direction>): boolean {
    return directions.every(direction => this._touchingWallsInDirections[direction] !== undefined);
  }

  kill() {
    this._isDead = true;
  }

}
