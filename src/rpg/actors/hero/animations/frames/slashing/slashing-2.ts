import { SkeletalAnimationFrame, SkeletalAnimationJointPivot } from "../../../../../../engine/pixi/skeletal-animated-pixi-entity";

export default new SkeletalAnimationFrame([
  new SkeletalAnimationJointPivot('front-upper-arm', Math.PI / 3),
  new SkeletalAnimationJointPivot('front-lower-arm', 0),
  new SkeletalAnimationJointPivot('main-hand-weapon', Math.PI / -3),
]);
