import HPVector from "../../../engine/physics/vector";
import HPStaticShapeActor from "../../../engine/actors/static-shape-actor";

export default class TGWall extends HPStaticShapeActor {

  static get id() { return 'Wall'; }

  get size() { return this._size; }
  get isWall() { return true; }
  get isWallBound() { return false; }
  get gravityBoundCoefficient() { return 0; }
  get isAirFrictionBound() { return false; }
  get color() { return 0x333333; }
  get borderWidth() { return 2; }
  get borderColor() { return 0x757575; }

  constructor(
    position: HPVector,
    private _size: HPVector,
  ) {
    // when creating a wall you specify the upper-left point, not the center
    super(position.plus(_size.times(0.5)));
  }

}
