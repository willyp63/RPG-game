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
import Skeleton from "../actors/skeleton";

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
      Skeleton.assets,
    );
  }

  protected get foregroundAsset() { return 'public/imgs/castle-foreground.png'; }
  protected get backgroundAsset() { return 'public/imgs/castle-background.png'; }
  protected get backdropAsset() { return 'public/imgs/castle-backdrop.jpg'; }

  onInit() {
    super.onInit();

    // Walls
    this.addEntity(new Wall(new Vector(300, 351), new Vector(1056, 32)));
    this.addEntity(new Wall(new Vector(300, 201), new Vector(12, 150)));
    this.addEntity(new Wall(new Vector(416, 201), new Vector(12, 90)));

    this.addEntity(new RampWall(new Vector(1164, 223), new Vector(192, 128), Shape.InclineRamp));
    this.addEntity(new Wall(new Vector(1356, 223), new Vector(768, 32)));

    this.addEntity(new Wall(new Vector(2092, 0), new Vector(32, 223)));
    this.addEntity(new Wall(new Vector(812, 222), new Vector(352, 32)));
    this.addEntity(new Wall(new Vector(812, 0), new Vector(32, 224)));

    this.addEntity(new OscillatingWall(new Vector(1068, 192), new Vector(96, 16), new Vector(1, 0), 120));
    this.addEntity(new OscillatingWall(new Vector(1468, 182), new Vector(96, 16), new Vector(0, -1), 60));

    // Warrior
    const warrior = new Warrior(new Vector(966, 300));
    this.addEntity(warrior);
    this.followEntity(warrior);

    // Slimes
    // for (let i = 0; i < 4; i++) {
    //   const dx = Math.random() * 360;
    //   this.addEntity(new Slime(new Vector(440 + dx, 200)));
    // }

    // Skeletons
    for (let i = 0; i < 8; i++) {
      const dx = Math.random() * 360;
      this.addEntity(new Skeleton(new Vector(440 + dx, 200)));
    }

    // Ogres
    this.addEntity(new Ogre(new Vector(2000, 50)));
    this.addEntity(new Ogre(new Vector(880, 50)));
  }

}
