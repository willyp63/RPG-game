import PIXISystem from "../engine/pixi/pixi-system";
import getJson from "./util/get-json";
import Vector from "../engine/core/vector";
import MessageBox from "./ui/message-box";
import Hero from "./actors/hero/hero";
import FireBall from "./actors/hero/attacks/fire-ball";
import Skeleton from "./actors/enemies/skeleton/skeleton";
import Ogre from "./actors/enemies/ogre/ogre";
import Slime from "./actors/enemies/slime/slime";
import SignPost from "./actors/misc/sign-post";
import OscillatingWall from "./actors/misc/oscillating-wall";
import Wall from "../engine/entities/wall";
import Door from "./actors/misc/door";
import StatusBar from "./ui/status-bar";
import Inventory from "./ui/inventory";
import Equipment from "./ui/equipment";
import Button from "./ui/button";
import Item from "./items/item";
import VikingHelm from "./items/helms/viking-helm";
import IronChestPiece from "./items/chest-pieces/iron-chest-piece";
import IronLegGuards from "./items/leg-guards/iron-leg-guards";
import IronSword from "./items/weapons/iron-sword";
import RubyStaff from "./items/weapons/ruby-staff";

const SCREEN_WIDTH = 512;
const SCREEN_HEIGHT = 288;
const MESSAGE_BOX_HEIGHT = 64;
const STATUS_BAR_HEIGHT = 16;

export default class RPGSystem extends PIXISystem {

  get width() { return this._width; };
  get height() { return this._height; };
  get screenWidth() { return SCREEN_WIDTH; };
  get screenHeight() { return SCREEN_HEIGHT; };
  get assets() {
    return (<Array<string>>[]).concat(
      Hero.assets,
      Skeleton.assets,
      Ogre.assets,
      Slime.assets,
      SignPost.assets,
      OscillatingWall.assets,
      Item.assets,
      FireBall.assets,
    );
  }
  get foregroundAsset() { return this._foregroundAsset; }
  get backgroundAsset() { return this._backgroundAsset; }
  get backdropAsset() { return this._backdropAsset; }

  private inventoryButton = new Button(new Vector(SCREEN_WIDTH - 48, SCREEN_HEIGHT - 32), new Vector(48, 32), 'Inv');
  private inventory = new Inventory(new Vector(SCREEN_WIDTH - Inventory.size.x, MESSAGE_BOX_HEIGHT));
  private equipment = new Equipment(new Vector(SCREEN_WIDTH - Inventory.size.x - Equipment.size.x, MESSAGE_BOX_HEIGHT));
  private messageBox = new MessageBox(Vector.zero, new Vector(SCREEN_WIDTH * 2 / 3, MESSAGE_BOX_HEIGHT));
  private manaBar = new StatusBar(new Vector(SCREEN_WIDTH * 5 / 6, STATUS_BAR_HEIGHT * 5 / 2 + 8), new Vector(SCREEN_WIDTH / 3 - 16, STATUS_BAR_HEIGHT), 0, 0x4488FF, 0x000088);
  private energyBar = new StatusBar(new Vector(SCREEN_WIDTH * 5 / 6, STATUS_BAR_HEIGHT * 3 / 2 + 8), new Vector(SCREEN_WIDTH / 3 - 16, STATUS_BAR_HEIGHT), 0, 0xFFDE00, 0x664400);
  private healthBar = new StatusBar(new Vector(SCREEN_WIDTH * 5 / 6, STATUS_BAR_HEIGHT / 2 + 8), new Vector(SCREEN_WIDTH / 3 - 16, STATUS_BAR_HEIGHT), 0, 0x00FF00, 0xFF0000);
  private hero?: Hero;
  private isShowingInventory = false;

  private _foregroundAsset = '';
  private _backgroundAsset = '';
  private _backdropAsset = '';
  private _width = 0;
  private _height = 0;

  constructor(
    private areaFile: string,
    private heroStart: Vector
  ) {
    super();
  }

  init() {
    super.init();

    this.loadArea(this.areaFile, this.heroStart);
  }

  onTick() {
    super.onTick();

    this.updateStatusBars();
  }

  private updateStatusBars() {
    if (!this.hero) return;
    this.healthBar.setValue(this.hero.health);
    this.energyBar.setValue(this.hero.energy);
    this.manaBar.setValue(this.hero.mana);
  }

  private loadArea(areaFile: string, heroStart: Vector) {

    this.clearEntities();

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
                    this.loadArea(entity.area, new Vector(entity.start[0], entity.start[1]));
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
          this.hero = new Hero(
            heroStart,
            new VikingHelm(),
            new IronChestPiece(),
            new IronLegGuards(),
            new IronSword(),
            new RubyStaff(),
          );
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
          this.addUIEntity(this.inventoryButton);
          this.addUIEntity(this.inventory);
          this.addUIEntity(this.equipment);
          this.inventory.hide();
          this.equipment.hide();
          this.updateStatusBars();

          // event listeners
          this.inventoryButton.onClick(() => {
            this.isShowingInventory = !this.isShowingInventory;
            if (this.isShowingInventory) {
              this.inventory.show();
              this.equipment.show();
            } else {
              this.inventory.hide();
              this.equipment.hide();
            }
          });
        });
      }
    });
  }

}
