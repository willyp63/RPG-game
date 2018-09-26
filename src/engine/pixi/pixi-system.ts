import System from "../core/system";
import { Application, Sprite, settings, RenderTexture, loader } from "pixi.js";
import Entity from "../core/entity";
import UIElement from "./ui-element";
import scaleToWindow from "../misc/scale-to-window";
import PIXIEntity from "./pixi-entity";

export default abstract class PIXISystem extends System {

  protected get assets(): Array<string> { return []; }
  protected get foregroundAsset() { return ''; }
  protected get backgroundAsset() { return ''; }
  protected get backdropAsset() { return ''; }

  private _app: Application;
  private _entityToFollow?: Entity;
  private _backdropSprite?: Sprite;
  private _uiContainer: Sprite;
  private _uiElements: Array<UIElement> = [];

  constructor() {
    super();

    // Disable interpolation when scaling, will make texture be pixelated
    settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    // Create a Pixi Application
    this._app = new PIXI.Application({
      width: this.width,
      height: this.height,
      antialias: false, 
      transparent: false, 
      resolution: 3, // required for pixelated textures
    });

    // UI container
    this._uiContainer = new PIXI.Sprite(RenderTexture.create(this.width, this.height));

    // Add the canvas that Pixi automatically created for you to the HTML document
    const pixiAppContainer = document.body.querySelector('#pixi-app');
    if (!pixiAppContainer) throw 'Couldnt find pixi app container!!';
    pixiAppContainer.appendChild(this._app.view);

    // Scale the canvse to fit the window
    scaleToWindow(this._app.renderer.view);
    window.addEventListener("resize", () => scaleToWindow(this._app.renderer.view));

    // Start loading assets
    const assets =
      this.assets.concat([
        this.foregroundAsset,
        this.backgroundAsset,
        this.backdropAsset,
      ]);

    PIXI.loader
      .add(assets)
      .load(() => {
        this._backdropSprite = new PIXI.Sprite(loader.resources[this.backdropAsset].texture);
        this._app.stage.addChild(this._backdropSprite);
        this._app.stage.addChild(new PIXI.Sprite(loader.resources[this.backgroundAsset].texture));

        this.onInit();

        this._app.stage.addChild(new PIXI.Sprite(loader.resources[this.foregroundAsset].texture));
        this._app.stage.addChild(this._uiContainer);
      });
  }

  protected onInit() { }

  protected followEntity(entity: Entity) {
    this._entityToFollow = entity;
  }

  protected addUIElement(uiElement: UIElement) {
    this._uiElements.push(uiElement);
    this._uiContainer.addChild(uiElement.sprite);
  }

  /* --- overrides -- */
  addEntity(entity: Entity) {
    super.addEntity(entity);

    if (entity instanceof PIXIEntity) {
      this._app.stage.addChild(entity.sprite);
    }
  }

  removeEntityAt(i: number) {
    const entity = this.entities[i];
    if (entity instanceof PIXIEntity) {
      this._app.stage.removeChild(entity.sprite);
    }

    super.removeEntityAt(i);
  }

  onTick() {
    super.onTick();

    // follow entity
    if (this._entityToFollow) {
      this._app.stage.x = this.width / 2 - this._entityToFollow.position.x;
      this._app.stage.y = this.height / 2 - this._entityToFollow.position.y;

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
