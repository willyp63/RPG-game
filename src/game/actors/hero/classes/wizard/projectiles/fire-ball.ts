import HPStaticShapeActor from "../../../../../../engine/actors/static-shape-actor";
import HPVector from "../../../../../../engine/physics/vector";

export default class TGFireBall extends HPStaticShapeActor {

  get size() { return new HPVector(20, 20); }

  get color() { return 0xEF6D09; }
  get borderWidth() { return 1; }
  get borderColor() { return 0x000000; }
  get isRound() { return true; }

  constructor(position: HPVector) {
    super(position);
  }

}
