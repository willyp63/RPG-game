import { SkeletalAnimation } from "../../../../engine/pixi/skeletal-animated-pixi-entity";
import rolling1 from "./frames/rolling/rolling-1";
import rolling2 from "./frames/rolling/rolling-2";

export default () => new SkeletalAnimation([
  rolling1,
  rolling2,
]);
