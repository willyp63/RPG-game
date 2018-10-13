import Weapon, { WeaponAttackType } from './weapon';
import Item from '../item';
import Vector from '../../../engine/core/vector';
import Entity from '../../../engine/core/entity';
import FireBall from '../../actors/hero/attacks/fire-ball';

const ATTACK_POSITION = new Vector(16, 2);

export default class RubyStaff extends Weapon {

  get texture() { return Item.getItemTexture('ruby-staff.png'); }
  get anchor() { return new Vector(0.25, 0.5); }
  get attackType() { return WeaponAttackType.Punch; }
  get attackEnergyCost() { return 20; }
  get attackManaCost() { return 10; }

  onAttack(hero: Entity, isFacingLeft: boolean) {
    hero.addEntityToSystem(new FireBall(
      hero.position.plus(ATTACK_POSITION.flippedHorizontally(isFacingLeft)),
      isFacingLeft,
    ));
  }

}
