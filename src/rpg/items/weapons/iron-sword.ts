import Weapon, { WeaponAttackType } from './weapon';
import Item from '../item';
import Vector from '../../../engine/core/vector';
import Entity from '../../../engine/core/entity';
import InstantAttack from '../../../engine/entities/instant-attack';

const ATTACK_POSITION = new Vector(16, 2);
const ATTACK_SIZE = 24;
const ATTACK_FORCE = new Vector(6, -3);
const ATTACK_DAMAGE = 20;

export default class IronSword extends Weapon {

  get texture() { return Item.getItemTexture('iron-sword.png'); }
  get anchor() { return new Vector(0.0862, 0.5); }
  get attackType() { return WeaponAttackType.Slash; }
  get attackEnergyCost() { return 30; }
  get attackManaCost() { return 0; }

  onAttack(hero: Entity, isFacingLeft: boolean) {
    hero.addEntityToSystem(new InstantAttack(
      hero.position.plus(ATTACK_POSITION.flippedHorizontally(isFacingLeft)),
      hero,
      ATTACK_SIZE,
      ATTACK_FORCE,
      ATTACK_DAMAGE,
      true,
    ));
  }

}
