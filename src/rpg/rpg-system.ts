import PIXISystem from "../engine/pixi/pixi-system";
import getJson from "./util/get-json";
import Vector from "../engine/core/vector";
import MessageBox from "./ui/message-box";
import Hero from "./actors/hero/hero";
import Helm from "./actors/hero/equipment/helm";
import ChestPiece from "./actors/hero/equipment/chest-piece";
import LegGuards from "./actors/hero/equipment/leg-guards";
import Weapon from "./actors/hero/equipment/weapon";
import FireBall from "./actors/hero/attacks/fire-ball";
import Skeleton from "./actors/enemies/skeleton/skeleton";
import Ogre from "./actors/enemies/ogre/ogre";
import Slime from "./actors/enemies/slime/slime";
import SignPost from "./actors/misc/sign-post";
import OscillatingWall from "./actors/misc/oscillating-wall";
import Wall from "../engine/entities/wall";
import Door from "./actors/misc/door";
import StatusBar from "./ui/status-bar";
import setTicksOut from "../engine/util/set-ticks-out";

const SCREEN_WIDTH = 512;
const SCREEN_HEIGHT = 288;
const MESSAGE_BOX_HEIGHT = 64;
const STATUS_BAR_HEIGHT = 16;

export default class RPGSystem extends PIXISystem {

  protected get screenWidth() { return SCREEN_WIDTH; };
  protected get screenHeight() { return SCREEN_HEIGHT; };

  get assets() {
    return (<Array<string>>[]).concat(
      Hero.assets,
      Skeleton.assets,
      Ogre.assets,
      Slime.assets,
      SignPost.assets,
      OscillatingWall.assets,
      Helm.assets,
      ChestPiece.assets,
      LegGuards.assets,
      Weapon.assets,
      FireBall.assets,
    );
  }

  protected get foregroundAsset() { return this._foregroundAsset; }
  protected get backgroundAsset() { return this._backgroundAsset; }
  protected get backdropAsset() { return this._backdropAsset; }

  private messageBox = new MessageBox(new Vector(0, 0), new Vector(SCREEN_WIDTH * 2 / 3, MESSAGE_BOX_HEIGHT));
  private manaBar = new StatusBar(new Vector(SCREEN_WIDTH * 5 / 6, STATUS_BAR_HEIGHT * 5 / 2 + 8), new Vector(SCREEN_WIDTH / 3 - 16, STATUS_BAR_HEIGHT), 0, 0x0000FF, 0x000088);
  private energyBar = new StatusBar(new Vector(SCREEN_WIDTH * 5 / 6, STATUS_BAR_HEIGHT * 3 / 2 + 8), new Vector(SCREEN_WIDTH / 3 - 16, STATUS_BAR_HEIGHT), 0, 0xFFDE00, 0x806F00);
  private healthBar = new StatusBar(new Vector(SCREEN_WIDTH * 5 / 6, STATUS_BAR_HEIGHT / 2 + 8), new Vector(SCREEN_WIDTH / 3 - 16, STATUS_BAR_HEIGHT), 0, 0x00FF00, 0xFF0000);
  private hero?: Hero;

  get width() { return this._width; };
  get height() { return this._height; };

  private _foregroundAsset = '';
  private _backgroundAsset = '';
  private _backdropAsset = '';
  private _width = 0;
  private _height = 0;

  constructor(areaFile: string, heroStart: Vector) {
    super();

    this._loadArea(areaFile, heroStart);
  }

  _updateStatusBars() {
    if (!this.hero) return;
    this.healthBar.setValue(this.hero.health);
    this.energyBar.setValue(this.hero.energy);
    this.manaBar.setValue(this.hero.mana);
    setTicksOut(this._updateStatusBars.bind(this), 10);
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
            } else if (entity.class === 'SignPost') {
              this.addEntity(
                new SignPost(
                  new Vector(entity.position[0], entity.position[1]),
                  () => {
                    this.messageBox.showMessage(entity.message);
                  },
                  () => {
                    this.messageBox.hide();
                  },
                )
              );
            } else if (entity.class === 'OscillatingWall') {
              this.addEntity(
                new OscillatingWall(
                  new Vector(entity.position[0], entity.position[1]),
                  new Vector(entity.size[0], entity.size[1]),
                  new Vector(entity.velocity[0], entity.velocity[1]),
                  entity.period,
                )
              );
            }
          });

          // add hero
          this.hero = new Hero(heroStart);
          this.addEntity(this.hero);
          this.followEntity(this.hero);

          // add ui elements
          this.addUIEntity(this.messageBox);
          this.healthBar.maxValue = this.hero.maxHealth;
          this.energyBar.maxValue = this.hero.maxEnergy;
          this.manaBar.maxValue = this.hero.maxMana;
          this.addUIEntity(this.healthBar);
          this.addUIEntity(this.energyBar);
          this.addUIEntity(this.manaBar);
          this._updateStatusBars();
        });
      }
    });
  }

}
