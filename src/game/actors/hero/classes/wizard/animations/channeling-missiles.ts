import { HPSkeletalAnimation } from "../../../../../../engine/actors/skeletal-actor";
import CHANNELING_MISSILES_1 from "../frames/channeling-missiles-1";
import CHANNELING_MISSILES_2 from "../frames/channeling-missiles-2";
import { ARCANE_MISSILE_SHOOT_INTERVAL } from "../constants";

const CHANNELING_MISSILES_ANIMATION: HPSkeletalAnimation = {
  frames: [
    CHANNELING_MISSILES_1,
    CHANNELING_MISSILES_2,
  ],
  speed: 2 / ARCANE_MISSILE_SHOOT_INTERVAL,
};

export default CHANNELING_MISSILES_ANIMATION;
