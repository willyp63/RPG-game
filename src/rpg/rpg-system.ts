import PIXISystem from "../engine/pixi/pixi-system";
import Warrior from "./actors/warrior";
import Wall from "./actors/walls/wall";
import Skeleton from "./actors/skeleton";
import Door from "./actors/door";
import getJson from "./util/get-json";
import Vector from "../engine/core/vector";
import Ogre from "./actors/ogre";
import Slime from "./actors/slime";
import RampWall from "./actors/walls/ramp-wall";

const SCREEN_WIDTH = 512;
const SCREEN_HEIGHT = 288;

export default class RPGSystem extends PIXISystem {

  protected get screenWidth() { return SCREEN_WIDTH; };
  protected get screenHeight() { return SCREEN_HEIGHT; };

  get assets() {
    return (<Array<string>>[]).concat(
      Warrior.assets,
      Wall.assets,
      Skeleton.assets,
      Door.assets,
      Ogre.assets,
      Slime.assets,
      RampWall.assets,
    );
  }

  protected get foregroundAsset() { return this._foregroundAsset; }
  protected get backgroundAsset() { return this._backgroundAsset; }
  protected get backdropAsset() { return this._backdropAsset; }

  private _foregroundAsset = '';
  private _backgroundAsset = '';
  private _backdropAsset = '';

  get width() { return this._width; };
  get height() { return this._height; };

  private _width = 0;
  private _height = 0;

  constructor(areaFile: string, heroStart: Vector) {
    super();

    this._loadArea(areaFile, heroStart);
  }

  _loadArea(areaFile: string, heroStart: Vector) {

    this.clearAreaAndShowLoadingScreen();

    getJson(areaFile, (err: any, data: any) => {
      if (err !== null) {
        console.log('Error loading area data', err);
      } else {
        this._width = data.width;
        this._height = data.height;
        this._foregroundAsset = data.foreground;
        this._backgroundAsset = data.background;
        this._backdropAsset = data.backdrop;

        this.load(() => {

          data.entities.forEach((entity: any) => {
            if (entity.class === 'Wall') {
              this.addEntity(
                new Wall(
                  new Vector(entity.position[0], entity.position[1]),
                  new Vector(entity.size[0], entity.size[1]),
                )
              );
            } else if (entity.class === 'RampWall') {
              this.addEntity(
                new RampWall(
                  new Vector(entity.position[0], entity.position[1]),
                  new Vector(entity.size[0], entity.size[1]),
                  entity.shape
                )
              );
            } else if (entity.class === 'Door') {
              this.addEntity(
                new Door(
                  new Vector(entity.position[0], entity.position[1]),
                  new Vector(entity.size[0], entity.size[1]),
                  () => {
                    this._loadArea(entity.area, new Vector(entity.start[0], entity.start[1]));
                  },
                )
              );
            } else if (entity.class === 'Skeleton') {
              this.addEntity(
                new Skeleton(
                  new Vector(entity.position[0], entity.position[1]),
                  entity.dead,
                )
              );
            } else if (entity.class === 'Ogre') {
              this.addEntity(
                new Ogre(
                  new Vector(entity.position[0], entity.position[1]),
                )
              );
            } else if (entity.class === 'Slime') {
              this.addEntity(
                new Slime(
                  new Vector(entity.position[0], entity.position[1]),
                  entity.size,
                )
              );
            }
          });

          const hero = new Warrior(heroStart);
          this.addEntity(hero);
          this.followEntity(hero);
        });
      }
    });
  }

}
