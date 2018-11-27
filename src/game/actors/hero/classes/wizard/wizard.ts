import TGHero from "../../hero";
import TGWeapon, { TGWeaponType } from "../../weapon";

export default class TGWizard extends TGHero {

  get weapon() { return new TGWeapon(TGWeaponType.Staff); }
  
}
