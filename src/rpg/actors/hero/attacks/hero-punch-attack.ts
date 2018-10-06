import Attack from "../../../../engine/core/attack";
import Vector from "../../../../engine/core/vector";
import Hero from "../hero";

const SIZE = 8;
const ATTACK_FORCE = new Vector(3, -1);
const ATTACK_DAMAGE = 5;

export default class HeroPunchAttack extends Attack {

  constructor(
    position: Vector,
    hero: Hero,
  ) {
    super(
      position,
      hero,
      SIZE,
      ATTACK_FORCE,
      ATTACK_DAMAGE,
      true,
    );
  }
}
