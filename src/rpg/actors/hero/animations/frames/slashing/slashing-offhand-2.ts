import { SkeletalAnimationFrame, SkeletalAnimationJointPivot } from "../../../../../../engine/pixi/skeletal-animated-pixi-entity";

export default new SkeletalAnimationFrame([
  new SkeletalAnimationJointPivot('back-upper-arm', Math.PI / 3),
  new SkeletalAnimationJointPivot('back-lower-arm', 0),
  new SkeletalAnimationJointPivot('off-hand-weapon', Math.PI / -3),
]);
