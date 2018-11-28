import TGHero from "../../hero";
import TGWeapon, { TGWeaponType } from "../../weapon";
import { JUMP_FORCE, RUN_FORCE } from "../../constants";

export default class TGRouge extends TGHero {

  static get id() { return 'Rouge'; }

  get weapon() { return new TGWeapon(TGWeaponType.Crossbow); }
  get jumpForce() { return JUMP_FORCE.times(1.1); }
  get runForce() { return RUN_FORCE.times(1.2); }

  performAbility(abilityNum: number) {
    this.abilities[abilityNum]();
  }

  private abilities = [
    () => console.log('shoot crossbow'),
    () => console.log('backstab'),
    () => console.log('evasion'),
    () => console.log('idk...'),
    () => console.log('idk...'),
  ];
  
}
