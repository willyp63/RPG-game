import { Application, loader } from "pixi.js";
import HPVector from "../physics/vector";
import HPStage from "./stage";
import HPAreaService from "../services/area-service";
import HPAreaData from "../services/data/area-data";
import HPActorFactory from "./actor-factory";

export default class HPApp {

  /** Underlying PIXI application */
  private app: Application;

  /** Element to render the app within */
  private element: HTMLElement;

  /** Main stage for actors */
  private stage: HPStage;
  
  constructor(
    viewSize: HPVector, // size of the app view in pixels
    elementSelector: string, // identifies the DOM element the app should be rendered within
    private actorFactory: HPActorFactory, // function that turns actor data into actors
    private assets: Array<string>, // all required assets
    private areaFile: string, // the file name of the starting area
    gravityForce: HPVector, // universal force applied to all actors each tick
    airFrictionCoefficient: number, // number from 0 to 1, the higher the number the more resistance actors will feel when moving
  ) {

    this.app = new Application({
      width: viewSize.x,
      height: viewSize.y,
      transparent: false, 
      antialias: false, // required for pixelated textures
      resolution: 3, // required for pixelated textures
    });

    this.element = document.body.querySelector(elementSelector) ||
      (() => { throw new Error(`Can't find element with selector: ${elementSelector}`) })();

    this.stage = new HPStage(this.app.stage, gravityForce, airFrictionCoefficient);

    this.addPIXICanvasToScreen();
  }

  async start() {
    await this.loadAssets();
    this.setAreaData(await this.loadAreaData()); 
    this.startGameLoop();
  }

  private addPIXICanvasToScreen() {
    this.element.appendChild(this.app.view);
    this.scaleToFitWithinElement();
    window.addEventListener('resize', this.scaleToFitWithinElement.bind(this));
  }

  private scaleToFitWithinElement() {
    const scaleX = window.innerWidth / this.app.view.offsetWidth;
    const scaleY = window.innerHeight / this.app.view.offsetHeight;
    const scale = Math.min(scaleX, scaleY);
    this.app.view.style.transform = `scale(${scale})`;
  }

  private loadAssets() {
    return new Promise(resolve => loader.add(this.assets).load(resolve));
  }

  private loadAreaData() {
    return HPAreaService.getAreaData(this.areaFile);
  }

  private setAreaData(areaData: HPAreaData) {
    this.stage.clearActors();
    areaData.actors.forEach(actorData => {
      this.stage.addActor(this.actorFactory.createFromData(actorData));
    });
  }

  private startGameLoop() {
    this.app.ticker.add(() => this.stage.onTick());
    this.app.start();
  }

}
