import TGHero from "../../hero";
import TGWeapon, { TGWeaponType } from "../../weapon";
import { JUMP_FORCE, RUN_FORCE } from "../../constants";

export default class TGWarrior extends TGHero {

  static get id() { return 'Warrior'; }

  get weapon() { return new TGWeapon(TGWeaponType.Sword); }
  get jumpForce() { return JUMP_FORCE.times(1.0); }
  get runForce() { return RUN_FORCE.times(1.1); }

  performAbility(abilityNum: number) {
    this.abilities[abilityNum]();
  }

  private abilities = [
    () => console.log('slash'),
    () => console.log('whirlwind'),
    () => console.log('jump'),
    () => console.log('shields up'),
    () => console.log('idk...'),
  ];
  
}
