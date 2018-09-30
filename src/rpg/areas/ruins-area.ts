import PIXISystem from "../../engine/pixi/pixi-system";
import Warrior from "../actors/warrior";
import Wall from "../actors/walls/wall";
import Vector from "../../engine/core/vector";
import Skeleton from "../actors/skeleton";

export default class RuinsArea extends PIXISystem {

  get width() { return 640; };
  get height() { return 288; };
  protected get screenWidth() { return 512; };
  protected get screenHeight() { return 288; };

  get assets() {
    return (<Array<string>>[]).concat(
      Warrior.assets,
      Wall.assets,
      Skeleton.assets,
    );
  }

  protected get foregroundAsset() { return 'public/imgs/ruins-1__foreground.png'; }
  protected get backgroundAsset() { return 'public/imgs/ruins-1__background.png'; }
  protected get backdropAsset() { return 'public/imgs/castle-backdrop.jpg'; }

  onInit() {
    super.onInit();

    /* --- WALLS ---  */

    // floor
    this.addEntity(new Wall(new Vector(0, 256), new Vector(640, 32)));

    // room on the left
    this.addEntity(new Wall(new Vector(16, 128), new Vector(16, 128)));
    this.addEntity(new Wall(new Vector(128, 128), new Vector(16, 102)));
    this.addEntity(new Wall(new Vector(32, 128), new Vector(96, 16)));

    // wall on the right
    this.addEntity(new Wall(new Vector(592, 106), new Vector(32, 150)));

    /* --- SKELETON ---  */
    this.addEntity(new Skeleton(new Vector(575, 228), true));

    /* --- WARRIOR ---  */
    const warrior = new Warrior(new Vector(190, 218));
    this.addEntity(warrior);
    this.followEntity(warrior);
  }

}
