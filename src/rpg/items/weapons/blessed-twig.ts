import Weapon, { WeaponAttackType } from './weapon';
import Item from '../item';
import Vector from '../../../engine/core/vector';
import Entity from '../../../engine/core/entity';

const HEAL_AMOUNT = 50;

export default class BlessedTwig extends Weapon {

  get texture() { return Item.getItemTexture('blessed-twig.png'); }
  get anchor() { return new Vector(0.214, 0.5); }
  get attackType() { return WeaponAttackType.Punch; }
  get attackEnergyCost() { return 10; }
  get attackManaCost() { return 10; }

  onAttack(hero: Entity, isFacingLeft: boolean) {
    hero.heal(HEAL_AMOUNT);
  }

}
