import scaleToWindow from '../misc/scale-to-window';
import { Application, settings, Sprite, RenderTexture } from 'pixi.js';
import Actor from './actor';
import { Vector, Collision, Direction } from '../physics';
import UIElement from './ui-element';

export default class Stage {

  protected static gravityForce = 0.333;
  protected static floorFrictionForce = 0.1333;
  protected static width: number;
  protected static height: number;
  protected static assets: Array<string> = [];

  private _app: Application;
  private _actors: Array<Actor> = [];
  private _actorToFollow: Actor;
  private _uiContainer: Sprite;
  private _uiElements: Array<UIElement> = [];
  
  private get _subclassType() { return <typeof Stage>this.constructor; }

  constructor() {

    // Disable interpolation when scaling, will make texture be pixelated
    settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    // Create a Pixi Application
    this._app = new PIXI.Application({
      width: this._subclassType.width,
      height: this._subclassType.height,
      antialias: false, 
      transparent: false, 
      resolution: 3, // required for pixelated textures
    });

    // UI container
    this._uiContainer = new PIXI.Sprite(RenderTexture.create(this._subclassType.width, this._subclassType.height));

    // Add the canvas that Pixi automatically created for you to the HTML document
    document.body.querySelector('#pixi-app').appendChild(this._app.view);

    // Scale the canvse to fit the window
    let scale = scaleToWindow(this._app.renderer.view);
    window.addEventListener("resize", () => { 
      scale = scaleToWindow(this._app.renderer.view);
    });

    // Start loading assets
    PIXI.loader
      .add(this._subclassType.assets)
      .load(() => {
        // Init game
        this._onInit();

        // Add UI container to stage
        this._app.stage.addChild(this._uiContainer);

        // Start game
        this._app.ticker.add(this._onTick.bind(this));
      });
  }

  _addActor(actor: Actor) {
    this._actors.push(actor);
    this._app.stage.addChild(actor.sprite)
  }

  _followActor(actor: Actor) {
    this._actorToFollow = actor;
  }

  _addUIElement(uiElement: UIElement) {
    this._uiElements.push(uiElement);
    this._uiContainer.addChild(uiElement.sprite);
  }
  
  _onInit() { }

  _onTick() {
    // move actors
    this._actors.forEach(actor => {
      if (actor.isStatic) return;
      actor.tick();
    });

    // wall physics
    for (let i = 0; i < this._actors.length; i++) {
      if (!this._actors[i].isWallBound) continue;

      const wallBoundActor = this._actors[i];
      let appliedFloorFriction = false;

      // reset touchingWalls
      wallBoundActor._touchingWallsInDirections = {};

      for (let j = 0; j < this._actors.length; j++) {
        if (i === j || !this._actors[j].isWall) continue;

        const wallActor = this._actors[j];
        const collision = new Collision(wallBoundActor, wallActor);

        if (collision.hit) {
          collision.recedeFirstRect();

          // add to touchingWalls
          wallBoundActor._touchingWallsInDirections[collision.direction] = true;

          // floor friction
          if (collision.direction === Direction.Down && !appliedFloorFriction) {
            wallBoundActor.applyForce(new Vector((wallActor.velocity.x - wallBoundActor.velocity.x) * this._subclassType.floorFrictionForce, 0));
            appliedFloorFriction = true;

            // remove bounce when an actor is standing on a wall that is moving down
            if (wallActor.velocity.y > 0 && wallBoundActor.velocity.y >= 0) {
              wallBoundActor.velocity = wallBoundActor.velocity.withNewY(wallActor.velocity.y);
            } else {
              // reset y velocity
              wallBoundActor.velocity = wallBoundActor.velocity.scaled(new Vector(1, 0));
            }
          }

          // bounce off ceiling
          if (collision.direction === Direction.Up) {
            let newVelocity = wallBoundActor.velocity.scaled(new Vector(1, -0.666));
            if (wallActor.velocity.y > 0) newVelocity = newVelocity.plus(new Vector(0, wallActor.velocity.y));
            wallBoundActor.velocity = newVelocity;
          }
        }
      }

      // squish
      if (wallBoundActor.isTouchingWallsInAllDirections([Direction.Up, Direction.Down]) ||
          wallBoundActor.isTouchingWallsInAllDirections([Direction.Left, Direction.Right])) {
        wallBoundActor.kill();     
      }
    }

    // gravity
    this._actors.forEach(actor => {
      if (actor.isGravityBound) {
        actor.applyForce(new Vector(0, this._subclassType.gravityForce));
      }
    });

    // collisions
    for (let i = 0; i < this._actors.length; i++) {
      for (let j = i + 1; j < this._actors.length; j++) {
        const actor1 = this._actors[i];
        const actor2 = this._actors[j];
        const collision = new Collision(actor1, actor2);

        if (!collision.hit) continue;

        // call with both actors in the primary position
        actor1.onCollision(actor2, collision);
        actor2.onCollision(actor1, collision);
      }
    }

    // actor updates
    this._actors.forEach(actor => actor.afterTick());

    // add new actors
    for (let i = 0; i < this._actors.length; i++) {
      if (this._actors[i]._newActors.length) {
        this._actors[i]._newActors.forEach(actor => this._addActor(actor));
        this._actors[i]._newActors = [];
      }
    }

    // reomve dead actors
    for (let i = 0; i < this._actors.length; i++) {
      if (this._actors[i]._isDead) {
        this._app.stage.removeChild(this._actors[i].sprite);
        this._actors.splice(i, 1);
      }
    }

    // move sprites
    this._actors.forEach(actor => {
      if (actor.isStatic) return;

      actor.sprite.x = actor.position.x;
      actor.sprite.y = actor.position.y;
    });

    // follow actor
    if (this._actorToFollow) {
      this._app.stage.x = this._subclassType.width / 2 - this._actorToFollow.position.x;
      this._app.stage.y = this._subclassType.height / 2 - this._actorToFollow.position.y;

      // make UI fixed
      this._uiContainer.x = this._app.stage.x * -1;
      this._uiContainer.y = this._app.stage.y * -1;
    }
  }
}
