import System from "../core/system";
import { Application, Sprite, settings, loader, Container } from "pixi.js";
import Entity from "../core/entity";
import scaleToWindow from "../misc/scale-to-window";
import PIXIEntity from "./pixi-entity";
import UIEntity from "./ui-entity";

export default abstract class PIXISystem extends System {

  get screenWidth() { return 0; };
  get screenHeight() { return 0; };
  get assets(): Array<string> { return []; }
  get foregroundAsset() { return ''; }
  get backgroundAsset() { return ''; }
  get backdropAsset() { return ''; }

  private app = new Application();
  private backdropSprite = new Sprite();
  private entityContainer = new Container();
  private uiContainer = new Container();
  private entityToFollow?: PIXIEntity;

  constructor() {
    super();
  }

  init() {
    super.init();

    // Disable interpolation when scaling, will make texture be pixelated
    settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    // Create a Pixi Application
    this.app = new Application({
      width: this.screenWidth,
      height: this.screenHeight,
      antialias: false, 
      transparent: false, 
      resolution: 3, // required for pixelated textures
    });

    // Add the canvas that Pixi automatically created for you to the HTML document
    const pixiAppContainer = document.body.querySelector('#pixi-app');
    if (!pixiAppContainer) throw 'Couldnt find pixi app container!!';
    pixiAppContainer.appendChild(this.app.view);

    // Scale the canvse to fit the window
    scaleToWindow(this.app.renderer.view);
    window.addEventListener("resize", () => scaleToWindow(this.app.renderer.view));
  }

  load(onLoadComplete: () => void) {

    const assets =
      this.assets.concat([
        this.foregroundAsset,
        this.backgroundAsset,
        this.backdropAsset,
      ]).filter(asset => !loader.resources[asset]);

    PIXI.loader
      .add(assets)
      .load(() => {
        this.backdropSprite = new PIXI.Sprite(loader.resources[this.backdropAsset].texture);
        this.app.stage.addChild(this.backdropSprite);
        this.app.stage.addChild(new PIXI.Sprite(loader.resources[this.backgroundAsset].texture));
        this.app.stage.addChild(this.entityContainer);
        this.app.stage.addChild(new PIXI.Sprite(loader.resources[this.foregroundAsset].texture));
        this.app.stage.addChild(this.uiContainer);

        onLoadComplete();
      });
  }

  followEntity(entity: PIXIEntity) {
    this.entityToFollow = entity;
  }

  addEntity(entity: Entity) {
    super.addEntity(entity);

    if (entity instanceof PIXIEntity) {
      this.entityContainer.addChild(entity.sprite);
    }
  }

  addUIEntity(entity: UIEntity) {
    this.uiContainer.addChild(entity.sprite);
  }

  removeEntityAt(i: number) {
    const entity = this.entities[i];
    if (entity instanceof PIXIEntity) {
      this.entityContainer.removeChild(entity.sprite);
    }

    super.removeEntityAt(i);
  }

  onTick() {
    super.onTick();

    // follow entity
    if (this.entityToFollow) {

      let stageX = this.screenWidth / 2 - this.entityToFollow.cameraPosition.x;
      stageX = Math.min(stageX, 0);
      stageX = Math.max(stageX, this.screenWidth - this.width);

      let stageY = this.screenHeight / 2 - this.entityToFollow.cameraPosition.y;
      stageY = Math.min(stageY, 0);
      stageY = Math.max(stageY, this.screenHeight - this.height);

      this.app.stage.x = stageX;
      this.app.stage.y = stageY;

      // backdrop img
      this.backdropSprite.x = stageX * -0.2;
      this.backdropSprite.y = stageY * -0.2;

      // keep UI fixed
      this.uiContainer.x = stageX * -1;
      this.uiContainer.y = stageY * -1;
    }
  }
}
