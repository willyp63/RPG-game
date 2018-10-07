import { SkeletalAnimationFrame, SkeletalAnimationJointPivot } from "../../../../../../engine/pixi/skeletal-animated-pixi-entity";

export default new SkeletalAnimationFrame([
  new SkeletalAnimationJointPivot('front-upper-arm', 0),
  new SkeletalAnimationJointPivot('front-lower-arm', Math.PI / -2),
  new SkeletalAnimationJointPivot('main-hand-weapon', Math.PI / -3),
]);
