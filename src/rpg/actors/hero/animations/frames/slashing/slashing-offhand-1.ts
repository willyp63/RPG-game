import { SkeletalAnimationFrame, SkeletalAnimationJointPivot } from "../../../../../../engine/pixi/skeletal-animated-pixi-entity";

export default new SkeletalAnimationFrame([
  new SkeletalAnimationJointPivot('back-upper-arm', 0),
  new SkeletalAnimationJointPivot('back-lower-arm', Math.PI / -2),
  new SkeletalAnimationJointPivot('off-hand-weapon', Math.PI / -3),
]);
