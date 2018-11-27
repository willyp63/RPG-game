import TGHero from "../../hero";
import TGWeapon, { TGWeaponType } from "../../weapon";
import { JUMP_FORCE, RUN_FORCE } from "../../constants";

export default class TGWizard extends TGHero {

  get weapon() { return new TGWeapon(TGWeaponType.Staff); }
  get jumpForce() { return JUMP_FORCE.times(0.9); }
  get runForce() { return RUN_FORCE.times(0.9); }
  
}
