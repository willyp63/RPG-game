import { HPSkeletalFrame } from '../../../../engine/actors/skeletal-actor';
import {
  BACK_UPPER_ARM_ID,
  BACK_LOWER_ARM_ID,
  BACK_UPPER_LEG_ID,
  BACK_LOWER_LEG_ID,
  FRONT_UPPER_ARM_ID,
  FRONT_LOWER_ARM_ID,
  FRONT_UPPER_LEG_ID,
  FRONT_LOWER_LEG_ID,
} from '../constants';


const RUN_FRAME_1: HPSkeletalFrame = {
  pivots: {
    [FRONT_UPPER_ARM_ID]: Math.PI / 3,
    [FRONT_LOWER_ARM_ID]: Math.PI / -2,
    [BACK_UPPER_ARM_ID]: Math.PI / -3,
    [BACK_LOWER_ARM_ID]: Math.PI / -2,
    [FRONT_UPPER_LEG_ID]: Math.PI / -3,
    [FRONT_LOWER_LEG_ID]: Math.PI / 3,
    [BACK_UPPER_LEG_ID]: Math.PI / 3,
    [BACK_LOWER_LEG_ID]: Math.PI / 3,
  },
};

export default RUN_FRAME_1;
