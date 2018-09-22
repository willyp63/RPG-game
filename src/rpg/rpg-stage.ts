import { Stage } from "../engine/stage";
import Warrior from "./actors/warrior";
import Wall from "./actors/wall";
import Slime from "./actors/slime";
import { Vector } from "../engine/physics";
import PowerBar from "./ui-elements/power-bar";
import RampWall from "./actors/ramp-wall";
import { RampOrientation } from "../engine/physics/ramp";
import AbilityButton from "./ui-elements/ability-button";
import OscillatingWall from "./actors/oscillating-wall";

export default class RPGStage extends Stage {

  protected static gravityForce = 0.333;
  protected static floorFrictionForce = 0.1333;
  protected static width = 455;
  protected static height = 256;
  protected static assets = (<Array<string>>[]).concat(
    Warrior.assets,
    Wall.assets,
    Slime.assets,
    PowerBar.assets,
    OscillatingWall.assets,
    AbilityButton.assets,
  );
  protected static foregroundAsset = 'public/imgs/castle-foreground.png';
  protected static backgroundAsset = 'public/imgs/castle-background.png';
  protected static backdropAsset = 'public/imgs/castle-backdrop.jpg';

  _onInit() {
    super._onInit();

    // Warrior
    const warrior = new Warrior(new Vector(500, 280));
    this._addActor(warrior);
    this._followActor(warrior);

    // Walls
    this._addActor(new Wall(new Vector(300, 351), new Vector(864, 32)));
    this._addActor(new Wall(new Vector(300, 201), new Vector(12, 150)));
    this._addActor(new Wall(new Vector(416, 201), new Vector(12, 90)));

    this._addActor(new RampWall(new Vector(1164, 223), new Vector(192, 128), RampOrientation.TopRightToBottomLeft));
    this._addActor(new Wall(new Vector(1356, 223), new Vector(768, 32)));

    this._addActor(new Wall(new Vector(2092, 0), new Vector(32, 223)));
    this._addActor(new Wall(new Vector(812, 222), new Vector(352, 32)));
    this._addActor(new Wall(new Vector(812, 0), new Vector(32, 224)));

    // // Slime
    for (let i = 0; i < 24; i++) {
      const dx = Math.random() * 600;
      this._addActor(new Slime(new Vector(1475 + dx, 60)));
    }

    this._addActor(new OscillatingWall(new Vector(1068, 192), new Vector(96, 16), new Vector(1, 0), 150));
    this._addActor(new OscillatingWall(new Vector(1468, 182), new Vector(96, 16), new Vector(0, -1), 100));
    
    // UI
    // const healthBar = new PowerBar(new Vector(0, 0), 0xFF0000);
    // const energyBar = new PowerBar(new Vector(0, 0), 0xdccf00);
    // energyBar.position =  new Vector(4, RPGStage.height - energyBar.height - 4);
    // healthBar.position =  new Vector(4, energyBar.position.y - healthBar.height - 2);
    // this._addUIElement(energyBar);
    // this._addUIElement(healthBar);

    // const aAbilityButton = new AbilityButton(new Vector(0, 0), 65, 'a', () => warrior.stab());
    // const sAbilityButton = new AbilityButton(new Vector(0, 0), 83, 's', () => console.log('s key clicked'));
    // const zAbilityButton = new AbilityButton(new Vector(0, 0), 90, 'z', () => console.log('z key clicked'));
    // const xAbilityButton = new AbilityButton(new Vector(0, 0), 88, 'x', () => console.log('x key clicked'));
    // aAbilityButton.position = new Vector(RPGStage.width - (aAbilityButton.width + 4) * 2, RPGStage.height - (aAbilityButton.height + 4) * 2 + 6);
    // sAbilityButton.position = new Vector(RPGStage.width - (aAbilityButton.width + 4) * 1, RPGStage.height - (aAbilityButton.height + 4) * 2 + 6);
    // zAbilityButton.position = new Vector(RPGStage.width - (aAbilityButton.width + 4) * 5 / 2, RPGStage.height - (aAbilityButton.height + 4) * 1);
    // xAbilityButton.position = new Vector(RPGStage.width - (aAbilityButton.width + 4) * 3 / 2, RPGStage.height - (aAbilityButton.height + 4) * 1);
    // this._addUIElement(aAbilityButton);
    // this._addUIElement(sAbilityButton);
    // this._addUIElement(zAbilityButton);
    // this._addUIElement(xAbilityButton);
  }

  _onTick() {
    super._onTick();
  }
  
}
