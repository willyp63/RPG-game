import Attack from "../../../../engine/core/attack";
import Vector from "../../../../engine/core/vector";
import Hero from "../hero";

const SIZE = 12;
const ATTACK_FORCE = new Vector(6, -2);
const ATTACK_DAMAGE = 20;

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
