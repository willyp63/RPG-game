import TGHero from "../../hero";
import TGWeapon, { TGWeaponType } from "../../weapon";
import { JUMP_FORCE, RUN_FORCE } from "../../constants";
import TGFireBall from "./projectiles/fire-ball";
import TGArcaneMissile from "./projectiles/arcane-missile";
import { setTicksInterval, clearTicksInterval } from "../../../../../engine/util/set-ticks-out";

const FIRE_BALL_SHOOT_FORCE = 16;
const ARCANE_MISSILE_SHOOT_FORCE = 16;
const ARCANE_MISSILE_SHOOT_INTERVAL = 32;

export default class TGWizard extends TGHero {

  static get id() { return 'Wizard'; }

  get weapon() { return new TGWeapon(TGWeaponType.Staff); }
  get jumpForce() { return JUMP_FORCE.times(0.9); }
  get runForce() { return RUN_FORCE.times(0.9); }

  performAbility(abilityNum: number) {
    const func = this.performAbilities[abilityNum];
    if (func) func();
  }

  endAbility(abilityNum: number) {
    const func = this.endAbilities[abilityNum];
    if (func) func();
  }

  private performAbilities = [
    () => this.channelArcaneMissiles(),
    () => this.channelFireBall(),
    () => console.log('blink'),
    () => console.log('frost nova'),
    () => console.log('idk...'),
  ];

  private endAbilities = [
    () => this.stopChannelingArcaneMissiles(),
    () => this.shootFireBall(),
    undefined,
    undefined,
    undefined,
  ];

  private arcaneMissileTicksOut?: () => void = undefined;
  private fireBall?: TGFireBall;

  private channelArcaneMissiles() {
    this.arcaneMissileTicksOut = setTicksInterval(() => {
      this.shootArcaneMissile();
    }, ARCANE_MISSILE_SHOOT_INTERVAL);
  }

  private shootArcaneMissile() {
    const missile = new TGArcaneMissile(this.position);
    missile.push(this.targetUnitVector.times(ARCANE_MISSILE_SHOOT_FORCE))
    this.newBornActors.push(missile);
  }

  private stopChannelingArcaneMissiles() {
    if (this.arcaneMissileTicksOut) clearTicksInterval(this.arcaneMissileTicksOut);
  }

  private channelFireBall() {
    this.fireBall = new TGFireBall(this.position);
    this.fireBall.channel();
    this.newBornActors.push(this.fireBall);
  }

  private shootFireBall() {
    if (!this.fireBall) return;

    this.fireBall.stopChanneling();
    this.fireBall.push(this.targetUnitVector.times(FIRE_BALL_SHOOT_FORCE))
  }
  
}
