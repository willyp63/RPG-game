import PIXISystem from "../../engine/pixi/pixi-system";
import Warrior from "../actors/warrior";
import Wall from "../actors/walls/wall";
import PowerBar from "../ui-elements/power-bar";
import OscillatingWall from "../actors/walls/oscillating-wall";
import AbilityButton from "../ui-elements/ability-button";
import Ogre from "../actors/ogre";
import Vector from "../../engine/core/vector";
import Skeleton from "../actors/skeleton";
import RampWall from "../actors/walls/ramp-wall";
import Shape from "../../engine/core/shape";
import Slime, { SlimeSize } from "../actors/slime";

export default class CastleArea extends PIXISystem {

  get width() { return 512; };
  get height() { return 288; };

  get assets() {
    return (<Array<string>>[]).concat(
      Warrior.assets,
      Wall.assets,
      PowerBar.assets,
      OscillatingWall.assets,
      AbilityButton.assets,
      Ogre.assets,
      Skeleton.assets,
      Slime.assets,
    );
  }

  protected get foregroundAsset() { return 'public/imgs/castle-foreground.png'; }
  protected get backgroundAsset() { return 'public/imgs/castle-background.png'; }
  protected get backdropAsset() { return 'public/imgs/castle-backdrop.jpg'; }

  onInit() {
    super.onInit();

    /* --- WALLS ---  */

    // tower on the left
    this.addEntity(new Wall(new Vector(256, 490), new Vector(12, 150)));
    this.addEntity(new Wall(new Vector(256, 478), new Vector(128, 12)));
    this.addEntity(new Wall(new Vector(372, 490), new Vector(12, 90)));

    // castle floor
    this.addEntity(new Wall(new Vector(256, 640), new Vector(1808, 16)));

    // ramp to first elevator
    this.addEntity(new RampWall(new Vector(1888, 608), new Vector(32, 32), Shape.InclineRamp));
    this.addEntity(new Wall(new Vector(1920, 608), new Vector(32, 32)));

    // first elevator
    this.addEntity(new OscillatingWall(new Vector(1952, 624), new Vector(96, 16), new Vector(0, -1.5), 200));

    // castle 2nd floor
    this.addEntity(new Wall(new Vector(800, 512), new Vector(1152, 32)));
    this.addEntity(new Wall(new Vector(1920, 480), new Vector(32, 32)));

    // castle 3rd floor
    this.addEntity(new Wall(new Vector(800, 352), new Vector(1152, 32)));
    this.addEntity(new Wall(new Vector(1920, 320), new Vector(32, 32)));

    // ramp to second elevator
    this.addEntity(new Wall(new Vector(800, 320), new Vector(128, 32)));
    this.addEntity(new Wall(new Vector(832, 288), new Vector(32, 32)));
    this.addEntity(new Wall(new Vector(800, 304), new Vector(32, 16)));

    // second elevator
    this.addEntity(new OscillatingWall(new Vector(800, 288), new Vector(32, 16), new Vector(0, -0.75), 130));

    // castle 4th floor
    this.addEntity(new Wall(new Vector(832, 192), new Vector(1216, 32)));

    // castle walls
    this.addEntity(new Wall(new Vector(768, 0), new Vector(32, 544)));
    this.addEntity(new Wall(new Vector(800, 0), new Vector(1248, 32)));
    this.addEntity(new Wall(new Vector(2048, 0), new Vector(32, 640)));

    /* --- OGRES ---  */

    // second floor
    this.addEntity(new Ogre(new Vector(900, 450)));
    this.addEntity(new Ogre(new Vector(1700, 450)));

    // third floor
    this.addEntity(new Ogre(new Vector(1000, 288)));
    this.addEntity(new Ogre(new Vector(1400, 288)));
    this.addEntity(new Ogre(new Vector(1800, 288)));

    /* --- SKELETONS ---  */

    // first floor
    for (let i = 0; i < 4; i++) {
      this.addEntity(new Skeleton(new Vector(740 + Math.floor(Math.random() * 1000), 580)));
    }

    // third floor
    for (let i = 0; i < 4; i++) {
      this.addEntity(new Skeleton(new Vector(980 + Math.floor(Math.random() * 850), 280)));
    }

    /* --- SLIMES ---  */
    
    // first floor
    for (let i = 0; i < 4; i++) {
      let size = SlimeSize.Large;
      if (Math.random() < 0.5) size = SlimeSize.Medium;
      this.addEntity(new Slime(new Vector(540 + Math.floor(Math.random() * 1200), 580), size));
    }

    /* --- WARRIOR ---  */
    const warrior = new Warrior(new Vector(425, 540));
    this.addEntity(warrior);
    this.followEntity(warrior);
  }

}
