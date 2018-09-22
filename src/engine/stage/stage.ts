import scaleToWindow from '../misc/scale-to-window';
import { Application, settings, Sprite, RenderTexture, loader } from 'pixi.js';
import Actor from './actor';
import { Vector, Collision, Direction } from '../physics';
import UIElement from './ui-element';

export default class Stage {

  protected static gravityForce = 0.333;
  protected static floorFrictionForce = 0.1333;
  protected static width: number;
  protected static height: number;
  protected static assets: Array<string> = [];
  protected static foregroundAsset: string = '';
  protected static backgroundAsset: string = '';
  protected static backdropAsset: string = '';

  private _app: Application;
  private _actors: Array<Actor> = [];
  private _actorToFollow?: Actor;
  private _backdropSprite?: Sprite;
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
    const pixiAppContainer = document.body.querySelector('#pixi-app');
    if (!pixiAppContainer) throw 'Couldnt find pixi app container';
    pixiAppContainer.appendChild(this._app.view);

    // Scale the canvse to fit the window
    scaleToWindow(this._app.renderer.view);
    window.addEventListener("resize", () => { 
      scaleToWindow(this._app.renderer.view);
    });

    // Start loading assets
    const assets = this._subclassType.assets.concat([this._subclassType.foregroundAsset, this._subclassType.backgroundAsset, this._subclassType.backdropAsset]);
    PIXI.loader
      .add(assets)
      .load(() => {
        this._backdropSprite = new PIXI.Sprite(loader.resources[this._subclassType.backdropAsset].texture);
        this._app.stage.addChild(this._backdropSprite);
        this._app.stage.addChild(new PIXI.Sprite(loader.resources[this._subclassType.backgroundAsset].texture));

        this._onInit();

        this._app.stage.addChild(new PIXI.Sprite(loader.resources[this._subclassType.foregroundAsset].texture));
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

      // reset touchingWalls
      wallBoundActor._touchingWallsInDirections = {};

      for (let j = 0; j < this._actors.length; j++) {
        if (i === j || !this._actors[j].isWall) continue;

        const wallActor = this._actors[j];
        const collision = Collision.between(wallBoundActor.bounds, wallActor.bounds, true);

        // add to touchingWalls
        if (collision.hit && collision.direction !== undefined) {
          wallBoundActor._touchingWallsInDirections[collision.direction] = wallActor;
        }
      }

      const upWallActor = wallBoundActor._touchingWallsInDirections[Direction.Up];
      const rightWallActor = wallBoundActor._touchingWallsInDirections[Direction.Right];
      const downWallActor = wallBoundActor._touchingWallsInDirections[Direction.Down];
      const leftWallActor = wallBoundActor._touchingWallsInDirections[Direction.Left];

      // squish
      if ((downWallActor && upWallActor) || (rightWallActor && leftWallActor)) {
        wallBoundActor.kill();
        break;   
      }

      // floor friction
      if (downWallActor !== undefined) {
        if (Math.abs(wallBoundActor.bounds.velocity.x) < 0.001) {
          wallBoundActor.bounds.velocity = wallBoundActor.bounds.velocity.withNewX(0);
        } else {
          wallBoundActor.applyForce(new Vector((downWallActor.bounds.velocity.x - wallBoundActor.bounds.velocity.x) * this._subclassType.floorFrictionForce, 0));
        }
      }

      // floor push up
      if (downWallActor !== undefined) {
        // remove bounce when an actor is standing on a wall that is moving down
        if (downWallActor.bounds.velocity.y > 0 && wallBoundActor.bounds.velocity.y >= 0) {
          wallBoundActor.bounds.velocity = wallBoundActor.bounds.velocity.withNewY(downWallActor.bounds.velocity.y);
        } else {
          wallBoundActor.bounds.velocity = wallBoundActor.bounds.velocity.withNewY(Math.min(wallBoundActor.bounds.velocity.y, downWallActor.bounds.velocity.y));
        }
      }

      // floor push left
      if (leftWallActor !== undefined) {
        wallBoundActor.bounds.velocity = wallBoundActor.bounds.velocity.withNewX(Math.max(wallBoundActor.bounds.velocity.x, leftWallActor.bounds.velocity.x));
      }

      // floor push right
      if (rightWallActor !== undefined) {
        wallBoundActor.bounds.velocity = wallBoundActor.bounds.velocity.withNewX(Math.min(wallBoundActor.bounds.velocity.x, rightWallActor.bounds.velocity.x));
      }

      // bounce off ceiling
      if (upWallActor !== undefined) {
        wallBoundActor.bounds.velocity = wallBoundActor.bounds.velocity.withNewY(wallBoundActor.bounds.velocity.y * -0.666);
        if (upWallActor.bounds.velocity.y > 0) wallBoundActor.bounds.velocity = wallBoundActor.bounds.velocity.plus(new Vector(0, upWallActor.bounds.velocity.y));
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
        const collision = Collision.between(actor1.bounds, actor2.bounds);

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

      actor.sprite.x = actor.bounds.position.x;
      actor.sprite.y = actor.bounds.position.y;
    });

    // follow actor
    if (this._actorToFollow) {
      this._app.stage.x = this._subclassType.width / 2 - this._actorToFollow.bounds.position.x;
      this._app.stage.y = this._subclassType.height / 2 - this._actorToFollow.bounds.position.y;

      // backdrop img
      if (this._backdropSprite) {
        this._backdropSprite.x = this._app.stage.x * -0.2;
        this._backdropSprite.y = this._app.stage.y * -0.2;
      }

      // make UI fixed
      this._uiContainer.x = this._app.stage.x * -1;
      this._uiContainer.y = this._app.stage.y * -1;
    }
  }
}
