import TGHero from "../../hero";
import TGWeapon, { TGWeaponType } from "../../weapon";
import { JUMP_FORCE, RUN_FORCE } from "../../constants";
import TGFireBall from "./projectiles/fire-ball";

const FIRE_BALL_SHOOT_FORCE = 20;

export default class TGWizard extends TGHero {

  static get id() { return 'Wizard'; }

  get weapon() { return new TGWeapon(TGWeaponType.Staff); }
  get jumpForce() { return JUMP_FORCE.times(0.9); }
  get runForce() { return RUN_FORCE.times(0.9); }

  performAbility(abilityNum: number) {
    this.abilities[abilityNum]();
  }

  private abilities = [
    () => console.log('arcane missiles'),
    () => this.shootFireBall(),
    () => console.log('blink'),
    () => console.log('frost nova'),
    () => console.log('idk...'),
  ];

  private shootFireBall() {
    const fireBall = new TGFireBall(this.position);
    fireBall.push(this.targetUnitVector.times(FIRE_BALL_SHOOT_FORCE))
    this.newBornActors.push(fireBall);
  }
  
}
