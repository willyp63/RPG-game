import { HPSkeletalBone } from "../../../engine/actors/skeletal-actor";
import {
  BACK_UPPER_ARM_ID,
  BACK_LOWER_ARM_ID,
  BACK_UPPER_LEG_ID,
  BACK_LOWER_LEG_ID,
  CHEST_ID,
  HEAD_ID,
  FRONT_UPPER_ARM_ID,
  FRONT_LOWER_ARM_ID,
  FRONT_UPPER_LEG_ID,
  FRONT_LOWER_LEG_ID,
  CHEST_POSITION,
  HEAD_POSITION,
  BACK_LEG_POSITION,
  FRONT_LEG_POSITION,
  BACK_ARM_POSITION,
  FRONT_ARM_POSITION,
  LOWER_LIMB_POSITION,
  CHEST_ANCHOR,
  HEAD_ANCHOR,
  LIMB_ANCHOR,
} from './constants';

const BONES: Array<HPSkeletalBone> = [
  {
    id: BACK_UPPER_ARM_ID,
    anchor: LIMB_ANCHOR,
    position: BACK_ARM_POSITION,
    children: [
      {
        id: BACK_LOWER_ARM_ID,
        anchor: LIMB_ANCHOR,
        position: LOWER_LIMB_POSITION,
      },
    ]
  },
  {
    id: BACK_UPPER_LEG_ID,
    anchor: LIMB_ANCHOR,
    position: BACK_LEG_POSITION,
    children: [
      {
        id: BACK_LOWER_LEG_ID,
        anchor: LIMB_ANCHOR,
        position: LOWER_LIMB_POSITION,
      },
    ]
  },
  {
    id: CHEST_ID,
    anchor: CHEST_ANCHOR,
    position: CHEST_POSITION,
  },
  {
    id: HEAD_ID,
    anchor: HEAD_ANCHOR,
    position: HEAD_POSITION,
  },
  {
    id: FRONT_UPPER_LEG_ID,
    anchor: LIMB_ANCHOR,
    position: FRONT_LEG_POSITION,
    children: [
      {
        id: FRONT_LOWER_LEG_ID,
        anchor: LIMB_ANCHOR,
        position: LOWER_LIMB_POSITION,
      },
    ]
  },
  {
    id: FRONT_UPPER_ARM_ID,
    anchor: LIMB_ANCHOR,
    position: FRONT_ARM_POSITION,
    children: [
      {
        id: FRONT_LOWER_ARM_ID,
        anchor: LIMB_ANCHOR,
        position: LOWER_LIMB_POSITION,
      },
    ]
  },
];

export default BONES;
