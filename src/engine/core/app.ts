import { Application, loader, settings } from "pixi.js";
import HPVector from "../physics/vector";
import HPStage from "./stage";
import HPAreaService from "../services/area-service";
import HPAreaData from "../services/data/area-data";
import HPActorFactory from "./actor-factory";
import HPActor from "./actor";

const DEFAULTS = {
  viewSize: new HPVector(850, 550),
  textures: [],
  heroStart: HPVector.Zero,
  gravityForce: new HPVector(0, .667),
  airFrictionCoefficient: 0.033,
};

export default class HPApp {

  private app: Application;
  private element: HTMLElement;
  private stage: HPStage;

  private actorFactory: HPActorFactory;
  private textures: Array<string>;
  private areaFile: string;
  private hero: HPActor;
  private heroStart: HPVector;
  
  constructor(
    _options: {
      viewSize?: HPVector,
      elementSelector: string,
      actorFactory: HPActorFactory,
      textures?: Array<string>,
      areaFile: string,
      hero: HPActor,
      heroStart?: HPVector,
      gravityForce?: HPVector,
      airFrictionCoefficient?: number,
    },
  ) {
    const options = Object.assign({}, DEFAULTS, _options);

    this.actorFactory = options.actorFactory;
    this.textures = options.textures;
    this.areaFile = options.areaFile;
    this.hero = options.hero;
    this.heroStart = options.heroStart;

    // Disable interpolation when scaling, will make texture be pixelated
    settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    this.app = new Application({
      width: options.viewSize.x,
      height: options.viewSize.y,
      transparent: false,
      backgroundColor: 0xFFFFFF,
      antialias: false, // required for pixelated textures
      resolution: 3, // required for pixelated textures
    });

    this.element = document.body.querySelector(options.elementSelector) ||
      (() => { throw new Error(`Can't find element with selector: ${options.elementSelector}`) })();

    this.stage = new HPStage(
      options.viewSize,
      this.app.stage,
      this.hero,
      options.gravityForce,
      options.airFrictionCoefficient,
    );

    this.addPIXICanvasToScreen();
  }

  async start() {
    await this.loadTextures();
    this.setAreaData(await this.loadAreaData()); 
    this.addHero();
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

  private loadTextures() {
    return new Promise(resolve => loader.add(this.textures).load(resolve));
  }

  private loadAreaData() {
    return HPAreaService.getAreaData(this.areaFile);
  }

  private setAreaData(areaData: HPAreaData) {
    this.stage.size = HPVector.from(areaData.size);

    this.stage.clearActors();
    areaData.actors.forEach(data => {
      const actor = this.actorFactory[data.id](data);
      if (actor === undefined) throw new Error(`Actor factory failed to return actor for data: ${JSON.stringify(data)}`);
      this.stage.addActor(actor);
    });
  }

  private addHero() {
    this.hero.position = this.heroStart;
    this.stage.addActor(this.hero);
  }

  private startGameLoop() {
    this.app.ticker.add(() => this.stage.onTick());
    this.app.start();
  }

}
