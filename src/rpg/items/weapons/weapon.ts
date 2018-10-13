import Item from "../item";
import Entity from "../../../engine/core/entity";

export enum WeaponAttackType {
  Punch,
  Slash,
};

export default abstract class Weapon extends Item {

  abstract get attackType(): WeaponAttackType;
  abstract get attackEnergyCost(): number;
  abstract get attackManaCost(): number;

  onAttack(hero: Entity, isFacingLeft: boolean) { }

}
