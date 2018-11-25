import HPVector from "./vector";
import HPWallContactMap from "./wall-contact-map";

export default interface HPEntity {
  size: HPVector;
  position: HPVector;
  velocity: HPVector;
  acceleration: HPVector;

  isWall: boolean;
  isWallBound: boolean;
  isGravityBound: boolean;
  isAirFrictionBound: boolean;

  bounciness: number;
  slipperiness: number;
  weight: number;
  maxVelocity: number;

  wallContact: HPWallContactMap;

  push(force: HPVector): void;
}
