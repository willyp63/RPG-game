import PIXISystem from "../../engine/pixi/pixi-system";
import Warrior from "../actors/warrior";
import Wall from "../actors/wall";
import Slime from "../actors/slime";
import PowerBar from "../ui-elements/power-bar";
import OscillatingWall from "../actors/oscillating-wall";
import AbilityButton from "../ui-elements/ability-button";
import Ogre from "../actors/ogre";
import Vector from "../../engine/core/vector";
import RampWall from "../actors/ramp-wall";
import Shape from "../../engine/core/shape";

export default class TestArea extends PIXISystem {

  get width() { return 455; };
  get height() { return 256; };

  get assets() {
    return (<Array<string>>[]).concat(
      Warrior.assets,
      Wall.assets,
      Slime.assets,
      PowerBar.assets,
      OscillatingWall.assets,
      AbilityButton.assets,
      Ogre.assets,
    );
  }

  protected get foregroundAsset() { return 'public/imgs/castle-foreground.png'; }
  protected get backgroundAsset() { return 'public/imgs/castle-background.png'; }
  protected get backdropAsset() { return 'public/imgs/castle-backdrop.jpg'; }

  onInit() {
    super.onInit();

    // Warrior
    const warrior = new Warrior(new Vector(1600, 50));
    this.addEntity(warrior);
    this.followEntity(warrior);

    // Walls
    this.addEntity(new Wall(new Vector(300, 351), new Vector(864, 32)));
    this.addEntity(new Wall(new Vector(300, 201), new Vector(12, 150)));
    this.addEntity(new Wall(new Vector(416, 201), new Vector(12, 90)));

    this.addEntity(new RampWall(new Vector(1164, 223), new Vector(192, 128), Shape.InclineRamp));
    this.addEntity(new Wall(new Vector(1356, 223), new Vector(768, 32)));

    this.addEntity(new Wall(new Vector(2092, 0), new Vector(32, 223)));
    this.addEntity(new Wall(new Vector(812, 222), new Vector(352, 32)));
    this.addEntity(new Wall(new Vector(812, 0), new Vector(32, 224)));

    // // Slime
    // for (let i = 0; i < 4; i++) {
    //   const dx = Math.random() * 600;
    //   this.addEntity(new Slime(new Vector(1475 + dx, 60)));
    // }

    // Ogre
    this.addEntity(new Ogre(new Vector(2000, 50)));

    this.addEntity(new OscillatingWall(new Vector(1068, 192), new Vector(96, 16), new Vector(1, 0), 200));
    this.addEntity(new OscillatingWall(new Vector(1468, 182), new Vector(96, 16), new Vector(0, -1), 70));
    
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
    super.onTick();
  }
  
}
