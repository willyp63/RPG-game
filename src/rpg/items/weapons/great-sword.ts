import Weapon, { WeaponAttackType } from './weapon';
import Item from '../item';
import Vector from '../../../engine/core/vector';
import Entity from '../../../engine/core/entity';
import InstantAttack from '../../../engine/entities/instant-attack';

const ATTACK_POSITION = new Vector(32, 2);
const ATTACK_SIZE = 60;
const ATTACK_FORCE = new Vector(10, -5);
const ATTACK_DAMAGE = 40;

export default class GreatSword extends Weapon {

  get texture() { return Item.getItemTexture('great-sword.png'); }
  get anchor() { return new Vector(0.0656, 0.5); }
  get attackType() { return WeaponAttackType.Slash; }
  get attackEnergyCost() { return 50; }
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
