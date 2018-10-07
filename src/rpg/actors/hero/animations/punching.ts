import { SkeletalAnimation } from "../../../../engine/pixi/skeletal-animated-pixi-entity";
import punching1 from "./frames/punching/punching-1";
import punching2 from "./frames/punching/punching-2";

export default () => new SkeletalAnimation([
  punching1,
  punching2,
]);
