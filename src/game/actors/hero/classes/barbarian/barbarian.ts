import TGHero from "../../hero";
import TGWeapon, { TGWeaponType } from "../../weapon";
import { JUMP_FORCE, RUN_FORCE } from "../../constants";

export default class TGBarbarian extends TGHero {

  get weapon() { return new TGWeapon(TGWeaponType.Sword); }
  get jumpForce() { return JUMP_FORCE.times(1.1); }
  get runForce() { return RUN_FORCE.times(1.1); }
  
}
