import { SkeletalAnimationFrame, SkeletalAnimationJointPivot } from "../../../../../engine/pixi/skeletal-animated-pixi-entity";

export default new SkeletalAnimationFrame([
  new SkeletalAnimationJointPivot('#root', 0),
  new SkeletalAnimationJointPivot('front-upper-arm', Math.PI / 2),
  new SkeletalAnimationJointPivot('front-lower-arm', 0),
  new SkeletalAnimationJointPivot('main-hand-weapon', Math.PI / -2),
  new SkeletalAnimationJointPivot('back-upper-arm', Math.PI / 2),
  new SkeletalAnimationJointPivot('back-lower-arm', 0),
  new SkeletalAnimationJointPivot('off-hand-weapon', Math.PI / -2),
  new SkeletalAnimationJointPivot('front-upper-leg', 0),
  new SkeletalAnimationJointPivot('front-lower-leg', 0),
  new SkeletalAnimationJointPivot('back-upper-leg', 0),
  new SkeletalAnimationJointPivot('back-lower-leg', 0),
]);
