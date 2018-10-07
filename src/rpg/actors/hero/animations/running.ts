import { SkeletalAnimation } from "../../../../engine/pixi/skeletal-animated-pixi-entity";
import running1 from "./frames/running/running-1";
import standing from "./frames/standing";
import running3 from "./frames/running/running-3";

export default () => new SkeletalAnimation([
  running1,
  standing,
  running3,
  standing,
]);
