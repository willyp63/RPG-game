import { SkeletalAnimation } from "../../../../engine/pixi/skeletal-animated-pixi-entity";
import slashing1 from "./frames/slashing/slashing-1";
import slashing2 from "./frames/slashing/slashing-2";

export default () => new SkeletalAnimation([
  slashing1,
  slashing2,
]);
