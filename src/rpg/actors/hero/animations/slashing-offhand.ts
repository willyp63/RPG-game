import { SkeletalAnimation } from "../../../../engine/pixi/skeletal-animated-pixi-entity";
import slashingOffhand1 from "./frames/slashing/slashing-offhand-1";
import slashingOffhand2 from "./frames/slashing/slashing-offhand-2";

export default () => new SkeletalAnimation([
  slashingOffhand1,
  slashingOffhand2,
]);
