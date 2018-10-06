import { Sprite, ObservablePoint } from "pixi.js";
import TextureHelper from "../../../../engine/pixi/texture-helper";

const TEXTURES_FILE = 'public/imgs/weapons.json';

export default class Weapon {

  static assets = [TEXTURES_FILE];

  private static get ironSwordTexture() { return TextureHelper.get(TEXTURES_FILE, "iron-sword.png"); }

  public getSprite() {
    const sprite = new Sprite(Weapon.ironSwordTexture);
    sprite.anchor = <ObservablePoint>{ x: 0.0862, y: 0.5 };
    return sprite;
  }

  constructor() { }

}
