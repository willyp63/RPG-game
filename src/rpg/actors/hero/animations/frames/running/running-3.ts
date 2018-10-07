import { SkeletalAnimationFrame, SkeletalAnimationJointPivot } from "../../../../../../engine/pixi/skeletal-animated-pixi-entity";

export default new SkeletalAnimationFrame([
  new SkeletalAnimationJointPivot('front-upper-arm', Math.PI / 3),
  new SkeletalAnimationJointPivot('front-lower-arm', Math.PI / -2),
  new SkeletalAnimationJointPivot('back-upper-arm', Math.PI * 2 / 3),
  new SkeletalAnimationJointPivot('back-lower-arm', Math.PI / -2),
  new SkeletalAnimationJointPivot('front-upper-leg', Math.PI / 3),
  new SkeletalAnimationJointPivot('front-lower-leg', Math.PI / 3),
  new SkeletalAnimationJointPivot('back-upper-leg', Math.PI / -3),
  new SkeletalAnimationJointPivot('back-lower-leg', Math.PI / 3),
]);
