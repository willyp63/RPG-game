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
import EquipmentInventory from './ui/equipment-inventory';
import Button from "./ui/button";
import Item from "./items/item";
import VikingHelm from "./items/helms/viking-helm";
import IronChestPiece from "./items/chest-pieces/iron-chest-piece";
import IronLegGuards from "./items/leg-guards/iron-leg-guards";
import IronSword from "./items/weapons/iron-sword";
import RubyStaff from "./items/weapons/ruby-staff";
import WizardLegGuards from "./items/leg-guards/wizard-leg-guards";
import WizardChestPiece from "./items/chest-pieces/wizard-chest-piece";
import WizardHood from "./items/helms/wizard-hood";
import BlessedTwig from "./items/weapons/blessed-twig";
import GreatSword from "./items/weapons/great-sword";
import RobinHoodHat from "./items/helms/robin-hood-hat";
import BouncyBlueStaff from "./items/weapons/bouncy-blue-staff";
import BouncyBlueBall from "./actors/hero/attacks/bouncy-blue-ball";

const SCREEN_WIDTH = 512;
const SCREEN_HEIGHT = 288;
const MESSAGE_BOX_HEIGHT = 64;
const STATUS_BAR_HEIGHT = 16;

const STARTING_ITEMS = [
  new RubyStaff(),
  new BouncyBlueStaff(),
  new IronSword(),
  new IronSword(),
  new BlessedTwig(),
  new GreatSword(),
  new GreatSword(),
  new IronLegGuards(),
  new IronChestPiece(),
  new VikingHelm(),
  new WizardLegGuards(),
  new WizardChestPiece(),
  new WizardHood(),
  new RobinHoodHat(),
];

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
      BouncyBlueBall.assets,
    );
  }
  get foregroundAsset() { return this._foregroundAsset; }
  get backgroundAsset() { return this._backgroundAsset; }
  get backdropAsset() { return this._backdropAsset; }

  // hero
  private hero = new Hero(
    Vector.zero,
    undefined,
    undefined,
    new IronLegGuards(),
    new IronSword(),
    undefined,
  );

  // UI
  private equipmentInventoryButton = new Button(new Vector(SCREEN_WIDTH - 48, SCREEN_HEIGHT - 48), new Vector(48, 48), 'Inv.');
  private equipmentInventory = new EquipmentInventory(new Vector(SCREEN_WIDTH - EquipmentInventory.size.x, MESSAGE_BOX_HEIGHT));
  private messageBox = new MessageBox(Vector.zero, new Vector(SCREEN_WIDTH * 2 / 3, MESSAGE_BOX_HEIGHT));
  private manaBar = new StatusBar(new Vector(SCREEN_WIDTH * 5 / 6, STATUS_BAR_HEIGHT * 5 / 2 + 8), new Vector(SCREEN_WIDTH / 3 - 16, STATUS_BAR_HEIGHT), this.hero.maxMana, 0x4488FF, 0x000088);
  private energyBar = new StatusBar(new Vector(SCREEN_WIDTH * 5 / 6, STATUS_BAR_HEIGHT * 3 / 2 + 8), new Vector(SCREEN_WIDTH / 3 - 16, STATUS_BAR_HEIGHT), this.hero.maxEnergy, 0xFFDE00, 0x664400);
  private healthBar = new StatusBar(new Vector(SCREEN_WIDTH * 5 / 6, STATUS_BAR_HEIGHT / 2 + 8), new Vector(SCREEN_WIDTH / 3 - 16, STATUS_BAR_HEIGHT), this.hero.maxHealth, 0x00FF00, 0xFF0000);
  private isShowingEquipmentInventory = false;
  
  // area
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
    this.addUIElements();
    this.addEventListeners();
    this.loadArea(this.areaFile, this.heroStart, this.onFirstAreaLoad.bind(this));
  }

  onTick() {
    super.onTick();
    this.updateStatusBars();
  }

  private addUIElements() {
    this.addUIEntity(this.messageBox);
    this.addUIEntity(this.healthBar);
    this.addUIEntity(this.energyBar);
    this.addUIEntity(this.manaBar);
    this.addUIEntity(this.equipmentInventoryButton);
    this.addUIEntity(this.equipmentInventory);
    this.equipmentInventory.hide();
  }

  private addEventListeners() {
    // show/hide inventory
    this.equipmentInventoryButton.onClick(() => {
      this.isShowingEquipmentInventory = !this.isShowingEquipmentInventory;
      this.isShowingEquipmentInventory
        ? this.equipmentInventory.show()
        : this.equipmentInventory.hide();
    });

    // swap hero's equipment
    this.equipmentInventory.onHelmChange(() => {
      this.hero.helm = this.equipmentInventory.helm;
    });
    this.equipmentInventory.onChestPieceChange(() => {
      this.hero.chestPiece = this.equipmentInventory.chestPiece;
    });
    this.equipmentInventory.onLegGuardsChange(() => {
      this.hero.legGuards = this.equipmentInventory.legGuards;
    });
    this.equipmentInventory.onMainHandWeaponChange(() => {
      this.hero.mainHandWeapon = this.equipmentInventory.mainHandWeapon;
    });
    this.equipmentInventory.onOffHandWeaponChange(() => {
      this.hero.offHandWeapon = this.equipmentInventory.offHandWeapon;
    });
  }

  private updateStatusBars() {
    this.healthBar.setValue(this.hero.health);
    this.energyBar.setValue(this.hero.energy);
    this.manaBar.setValue(this.hero.mana);
  }

  private loadArea(areaFile: string, heroStart: Vector, onLoad?: Function) {
    this.clearEntities();

    getJson(areaFile, (err: any, areaData: any) => {
      if (err === null) {
        // update area props
        this._width = areaData.width;
        this._height = areaData.height;
        this._foregroundAsset = areaData.foreground;
        this._backgroundAsset = areaData.background;
        this._backdropAsset = areaData.backdrop;

        // load area
        this.load(() => {
          this.addAreaEntities(areaData, heroStart);
          if (onLoad) onLoad();
        });
      } else {
        console.warn('Error loading area JSON', err);
      }
    });
  }

  private onFirstAreaLoad() {
    // add starting items to inventory
    STARTING_ITEMS.forEach(item => {
      this.equipmentInventory.addItemToInventory(item);
    })

    // add starting equipment
    this.equipmentInventory.setHelm(this.hero.helm);
    this.equipmentInventory.setChestPiece(this.hero.chestPiece);
    this.equipmentInventory.setLegGuards(this.hero.legGuards);
    this.equipmentInventory.setMainHandWeapon(this.hero.mainHandWeapon);
    this.equipmentInventory.setOffHandWeapon(this.hero.offHandWeapon);
  }

  private addAreaEntities(areaData: any, heroStart: Vector) {
    areaData.entities.forEach((entity: any) => {
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

    // add hero & perserve health/mana
    const oldHealth = this.hero.health
    const oldMana = this.hero.mana;
    this.addEntity(this.hero);
    this.followEntity(this.hero);
    if (oldHealth) {
      this.hero.health = oldHealth;
      this.hero.mana = oldMana;
    }
    this.hero.position = heroStart;
  }

}
