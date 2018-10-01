import System from "../core/system";
import { Application, Sprite, settings, loader, Container, Text } from "pixi.js";
import Entity from "../core/entity";
import scaleToWindow from "../misc/scale-to-window";
import PIXIEntity from "./pixi-entity";
import UIEntity from "./ui-entity";

export default abstract class PIXISystem extends System {

  protected get screenWidth() { return 0; };
  protected get screenHeight() { return 0; };
  protected get assets(): Array<string> { return []; }
  protected get foregroundAsset() { return ''; }
  protected get backgroundAsset() { return ''; }
  protected get backdropAsset() { return ''; }

  private _app: Application;
  private _entityToFollow?: PIXIEntity;
  private _backdropSprite?: Sprite;
  private _entityContainer = new Container();
  private _uiContainer = new Container();
  private _loadingGraphic = new Text('Loading...', {fontFamily : 'Arial', fontSize: 24, fill : 0xFFFFFF, align : 'center'});

  constructor() {
    super();

    // Disable interpolation when scaling, will make texture be pixelated
    settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    // Create a Pixi Application
    this._app = new PIXI.Application({
      width: this.screenWidth,
      height: this.screenHeight,
      antialias: false, 
      transparent: false, 
      resolution: 3, // required for pixelated textures
    });

    // Add the canvas that Pixi automatically created for you to the HTML document
    const pixiAppContainer = document.body.querySelector('#pixi-app');
    if (!pixiAppContainer) throw 'Couldnt find pixi app container!!';
    pixiAppContainer.appendChild(this._app.view);

    // Scale the canvse to fit the window
    scaleToWindow(this._app.renderer.view);
    window.addEventListener("resize", () => scaleToWindow(this._app.renderer.view));
  }

  protected clearAreaAndShowLoadingScreen() {
    this.entities.forEach(entity => entity.kill());
    this.entities = [];
    this._app.stage.removeChildren();
    this._entityContainer.removeChildren();
    this._uiContainer.removeChildren();
    
    this._app.stage.addChild(this._loadingGraphic);
  }

  protected load(addEntitiesHook: () => void) {

    this._app.stage.removeChild(this._loadingGraphic);

    const assets =
      this.assets.concat([
        this.foregroundAsset,
        this.backgroundAsset,
        this.backdropAsset,
      ]).filter(asset => !loader.resources[asset]);

    PIXI.loader
      .add(assets)
      .load(() => {
        this._backdropSprite = new PIXI.Sprite(loader.resources[this.backdropAsset].texture);
        this._app.stage.addChild(this._backdropSprite);
        this._app.stage.addChild(new PIXI.Sprite(loader.resources[this.backgroundAsset].texture));
        this._app.stage.addChild(this._entityContainer);
        this._app.stage.addChild(new PIXI.Sprite(loader.resources[this.foregroundAsset].texture));
        this._app.stage.addChild(this._uiContainer);

        addEntitiesHook();
      });
  }

  protected followEntity(entity: PIXIEntity) {
    this._entityToFollow = entity;
  }

  /* --- overrides -- */
  addEntity(entity: Entity) {
    super.addEntity(entity);

    if (entity instanceof PIXIEntity) {
      this._entityContainer.addChild(entity.container);
    }
  }

  addUIEntity(entity: UIEntity) {
    this._uiContainer.addChild(entity.sprite);
  }

  removeEntityAt(i: number) {
    const entity = this.entities[i];
    if (entity instanceof PIXIEntity) {
      this._entityContainer.removeChild(entity.container);
    }

    super.removeEntityAt(i);
  }

  onTick() {
    super.onTick();

    // follow entity
    if (this._entityToFollow) {

      let stageX = this.screenWidth / 2 - this._entityToFollow.cameraPosition.x;
      stageX = Math.min(stageX, 0);
      stageX = Math.max(stageX, this.screenWidth - this.width);

      let stageY = this.screenHeight / 2 - this._entityToFollow.cameraPosition.y;
      stageY = Math.min(stageY, 0);
      stageY = Math.max(stageY, this.screenHeight - this.height);

      this._app.stage.x = stageX;
      this._app.stage.y = stageY;

      // backdrop img
      if (this._backdropSprite) {
        this._backdropSprite.x = stageX * -0.2;
        this._backdropSprite.y = stageY * -0.2;
      }

      // keep UI fixed
      this._uiContainer.x = stageX * -1;
      this._uiContainer.y = stageY * -1;
    }
  }
}
