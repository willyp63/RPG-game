import HPVector from "../../engine/physics/vector";
import HPStaticShapeActor from "../../engine/actors/static-shape-actor";

export default class TGWall extends HPStaticShapeActor {

  static get id() { return 'Wall'; }

  get size() { return this._size; }
  get isWall() { return true; }
  get isWallBound() { return false; }
  get isGravityBound() { return false; }
  get isAirFrictionBound() { return false; }

  constructor(
    position: HPVector,
    private _size: HPVector,
  ) {
    super(
      position.plus(_size.times(0.5)), // when creating a wall you specify the upper-left point, not the center
      {
        color: 0x333333,
        borderWidth: 2,
        borderColor: 0x757575,
      },
    );
  }

}
