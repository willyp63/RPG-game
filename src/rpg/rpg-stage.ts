import { Stage } from "../engine/stage";
import Warrior from "./actors/warrior";
import Wall from "./actors/wall";
import Slime from "./actors/slime";
import { Vector } from "../engine/physics";
import PowerBar from "./ui-elements/power-bar";
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
  );

  _onInit() {
    super._onInit();

    // Warrior
    const warrior = new Warrior(new Vector(128, 192));
    this._addActor(warrior);
    this._followActor(warrior);

    // Slime
    for (let i = 0; i < 16; i++) {
      this._addActor(new Slime(new Vector(Math.random() * 256, 0)));
    }

    // Walls
    this._addActor(new Wall(new Vector(0, 128), new Vector(256, 48)));
    this._addActor(new Wall(new Vector(-768, 256), new Vector(768 * 2 + 256, 32)));

    this._addActor(new OscillatingWall(new Vector(-256, 220), new Vector(96, 24), new Vector(1, 0), 3000));
    this._addActor(new OscillatingWall(new Vector(288, 240), new Vector(96, 12), new Vector(0, -1), 3000));

    this._addActor(new Wall(new Vector(-288, 224), new Vector(32, 32)));

    // UI
    const healthBar = new PowerBar(new Vector(0, 0), 0xFF0000);
    const energyBar = new PowerBar(new Vector(0, 0), 0xdccf00);
    energyBar.position =  new Vector(4, RPGStage.height - energyBar.height - 4);
    healthBar.position =  new Vector(4, energyBar.position.y - healthBar.height - 2);
    this._addUIElement(energyBar);
    this._addUIElement(healthBar);

    const aAbilityButton = new AbilityButton(new Vector(0, 0), 65, 'a', () => warrior.stab());
    const sAbilityButton = new AbilityButton(new Vector(0, 0), 83, 's', () => console.log('s key clicked'));
    const zAbilityButton = new AbilityButton(new Vector(0, 0), 90, 'z', () => console.log('z key clicked'));
    const xAbilityButton = new AbilityButton(new Vector(0, 0), 88, 'x', () => console.log('x key clicked'));
    aAbilityButton.position = new Vector(RPGStage.width - (aAbilityButton.width + 4) * 2, RPGStage.height - (aAbilityButton.height + 4) * 2 + 6);
    sAbilityButton.position = new Vector(RPGStage.width - (aAbilityButton.width + 4) * 1, RPGStage.height - (aAbilityButton.height + 4) * 2 + 6);
    zAbilityButton.position = new Vector(RPGStage.width - (aAbilityButton.width + 4) * 5 / 2, RPGStage.height - (aAbilityButton.height + 4) * 1);
    xAbilityButton.position = new Vector(RPGStage.width - (aAbilityButton.width + 4) * 3 / 2, RPGStage.height - (aAbilityButton.height + 4) * 1);
    this._addUIElement(aAbilityButton);
    this._addUIElement(sAbilityButton);
    this._addUIElement(zAbilityButton);
    this._addUIElement(xAbilityButton);
  }

  _onTick() {
    super._onTick();
  }
  
}
