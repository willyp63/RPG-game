import { SkeletalAnimationFrame, SkeletalAnimationJointPivot } from "../../../../../../engine/pixi/skeletal-animated-pixi-entity";

export default new SkeletalAnimationFrame([
  new SkeletalAnimationJointPivot('front-upper-arm', Math.PI / 9),
  new SkeletalAnimationJointPivot('front-lower-arm', Math.PI / -9),
  new SkeletalAnimationJointPivot('main-hand-weapon', Math.PI / -6),
  new SkeletalAnimationJointPivot('back-upper-arm', Math.PI * 2 / 3),
  new SkeletalAnimationJointPivot('back-lower-arm', Math.PI * -2 / 3),
]);
