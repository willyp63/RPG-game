import TextureHelper from "../../../../engine/pixi/texture-helper";
import InstantAttack from "../../../../engine/entities/instant-attack";
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

  static get assets() { return [TEXTURES_FILE]; }

  private static get ironSwordTexture() { return TextureHelper.get(TEXTURES_FILE, "iron-sword.png"); }
  private static get rubyStaffTexture() { return TextureHelper.get(TEXTURES_FILE, "ruby-staff.png"); }

  get texture() {
    switch(this._type) {
      case WeaponType.IronSword:
        return Weapon.ironSwordTexture;
      case WeaponType.RubyStaff:
        return Weapon.rubyStaffTexture;
      default:
        return undefined;
    }
  }

  get anchor() {
    switch(this._type) {
      case WeaponType.IronSword:
        return new Vector(0.0862, 0.5);
      case WeaponType.RubyStaff:
        return new Vector(0.25, 0.5);
      default:
        return Vector.zero;
    }
  }

  get attackType() {
    switch(this._type) {
      case WeaponType.IronSword:
        return AttackType.Slash;
      case WeaponType.RubyStaff:
        return AttackType.Cast;
      default:
        return AttackType.Punch;
    }
  }

  get energyCost() {
    switch(this._type) {
      case WeaponType.IronSword:
        return 30;
      case WeaponType.RubyStaff:
        return 20;
      default:
        return 20;
    }
  }

  get manaCost() {
    switch(this._type) {
      case WeaponType.IronSword:
        return 0;
      case WeaponType.RubyStaff:
        return 20;
      default:
        return 0;
    }
  }

  getAttack(hero: Entity, isFacingLeft: boolean) {
    switch(this._type) {
      case WeaponType.RubyStaff:
        return new FireBall(
          hero.position.plus((new Vector(16, 2)).flippedHorizontally(isFacingLeft)),
          isFacingLeft,
        );
      case WeaponType.IronSword:
        return new InstantAttack(
          hero.position.plus((new Vector(16, 2)).flippedHorizontally(isFacingLeft)),
          hero,
          24,
          new Vector(6, -3),
          20,
          true,
        );
      default:
        return new InstantAttack(
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
