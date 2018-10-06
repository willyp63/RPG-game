import { Sprite, ObservablePoint } from "pixi.js";
import TextureHelper from "../../../../engine/pixi/texture-helper";
import Attack from "../../../../engine/core/attack";
import Vector from "../../../../engine/core/vector";
import Entity from "../../../../engine/core/entity";
import FireBall from "../attacks/fire-ball";

const TEXTURES_FILE = 'public/imgs/weapons.json';

export enum WeaponType {
  None,
  IronSword,
  RubyStaff,
};

export enum AttackType {
  Punch,
  Slash,
  Cast,
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

  public get attackType() {
    switch(this._type) {
      case WeaponType.IronSword:
        return AttackType.Slash;
      case WeaponType.RubyStaff:
        return AttackType.Cast;
      default:
        return AttackType.Punch;
    }
  }

  public getAttack(hero: Entity, isFacingLeft: boolean) {
    switch(this._type) {
      case WeaponType.RubyStaff:
        return new FireBall(
          hero.position.plus((new Vector(16, 2)).flippedHorizontally(isFacingLeft)),
          isFacingLeft,
        );
      case WeaponType.IronSword:
        return new Attack(
          hero.position.plus((new Vector(16, 2)).flippedHorizontally(isFacingLeft)),
          hero,
          24,
          new Vector(6, -3),
          20,
          true,
        );
      default:
        return new Attack(
          hero.position.plus((new Vector(12, 2)).flippedHorizontally(isFacingLeft)),
          hero,
          8,
          new Vector(2, -1),
          5,
          true,
        );
    }
  }

  constructor(private _type: WeaponType) { }

}
