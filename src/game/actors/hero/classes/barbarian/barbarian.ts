import TGHero from "../../hero";
import TGWeapon, { TGWeaponType } from "../../weapon";

export default class TGBarbarian extends TGHero {

  get weapon() { return new TGWeapon(TGWeaponType.Sword); }
  
}
