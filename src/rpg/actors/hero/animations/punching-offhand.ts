import { SkeletalAnimation } from "../../../../engine/pixi/skeletal-animated-pixi-entity";
import punchingOffhand1 from "./frames/punching/punching-offhand-1";
import punchingOffhand2 from "./frames/punching/punching-offhand-2";

export default () => new SkeletalAnimation([
  punchingOffhand1,
  punchingOffhand2
]);
