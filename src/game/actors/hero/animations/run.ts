import { HPSkeletalAnimation } from "../../../../engine/actors/skeletal-actor";
import RUN_FRAME_1 from "../frames/run-1";
import RESTING_FRAME from "../frames/resting";
import RUN_FRAME_2 from "../frames/run-2";

const RUN_ANIMATION: HPSkeletalAnimation = {
  frames: [
    RUN_FRAME_1,
    RESTING_FRAME,
    RUN_FRAME_2,
    RESTING_FRAME,
  ],
  speed: 0.1,
};

export default RUN_ANIMATION;
