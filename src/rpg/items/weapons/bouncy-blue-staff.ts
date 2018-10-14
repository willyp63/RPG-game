import Weapon, { WeaponAttackType } from './weapon';
import Item from '../item';
import Vector from '../../../engine/core/vector';
import Entity from '../../../engine/core/entity';
import BouncyBlueBall from '../../actors/hero/attacks/bouncy-blue-ball';

const ATTACK_POSITION = new Vector(16, 2);

export default class BouncyBlueStaff extends Weapon {

  get texture() { return Item.getItemTexture('bouncy-blue-staff.png'); }
  get anchor() { return new Vector(0.25, 0.5); }
  get attackType() { return WeaponAttackType.Punch; }
  get attackEnergyCost() { return 20; }
  get attackManaCost() { return 5; }

  onAttack(hero: Entity, isFacingLeft: boolean) {
    hero.addEntityToSystem(new BouncyBlueBall(
      hero.position.plus(ATTACK_POSITION.flippedHorizontally(isFacingLeft)),
      isFacingLeft,
    ));
  }

}
