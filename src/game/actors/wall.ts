import HPVector from "../../engine/physics/vector";
import HPStaticShapeActor from "../../engine/actors/static-shape-actor";

export default class TGWall extends HPStaticShapeActor {

  static get id() { return 'Wall'; }

  constructor(
    position: HPVector,
    size: HPVector,
  ) {
    super(
      // when creating a wall you specify the upper-left point, not the center
      position.plus(size.times(0.5)),
      size,
      {
        isWall: true,
        isWallBound: false,
        isGravityBound: false,
        isAirFrictionBound: false,
        color: 0x333333,
        borderWidth: 2,
        borderColor: 0x757575,
      },
    );
  }

}
