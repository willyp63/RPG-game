import { Sprite, ObservablePoint } from "pixi.js";
import TextureHelper from "../../../../engine/pixi/texture-helper";

const TEXTURES_FILE = 'public/imgs/weapons.json';

export enum WeaponType {
  None,
  IronSword,
  RubyStaff,
};

export default class Weapon {

  static assets = [TEXTURES_FILE];

  private static get ironSwordTexture() { return TextureHelper.get(TEXTURES_FILE, "iron-sword.png"); }
  private static get rubyStaffTexture() { return TextureHelper.get(TEXTURES_FILE, "ruby-staff.png"); }

  public getSprite() {
    let sprite;
    switch(this._type) {
      case WeaponType.IronSword:
        sprite = new Sprite(Weapon.ironSwordTexture);
        sprite.anchor = <ObservablePoint>{ x: 0.0862, y: 0.5 };
        return sprite;
      case WeaponType.RubyStaff:
        sprite = new Sprite(Weapon.rubyStaffTexture);
        sprite.anchor = <ObservablePoint>{ x: 0.25, y: 0.5 };
        return sprite;
      default:
        return new Sprite();
    }
    
  }

  constructor(private _type: WeaponType) { }

}
