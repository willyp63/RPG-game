import { SkeletalAnimationFrame, SkeletalAnimationJointPivot } from "../../../../../../engine/pixi/skeletal-animated-pixi-entity";

export default new SkeletalAnimationFrame([
  new SkeletalAnimationJointPivot('#root', Math.PI * 2 / 3),
  new SkeletalAnimationJointPivot('front-lower-arm', Math.PI / -2),
  new SkeletalAnimationJointPivot('back-lower-arm', Math.PI / -2),
  new SkeletalAnimationJointPivot('front-upper-leg', Math.PI * -2 / 3),
  new SkeletalAnimationJointPivot('back-upper-leg', Math.PI * -2 / 3),
]);
