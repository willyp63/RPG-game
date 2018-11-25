import HPActorData from "../engine/services/data/actor-data";
import HPActor from "../engine/core/actor";
import TGWall from "./actors/wall";
import HPVector from "../engine/physics/vector";

const TGActorFactory = (data: HPActorData): HPActor | undefined => {
  if (data.type === TGWall.type) {
    return new TGWall(
      HPVector.fromData(data.position),
      HPVector.fromData(data.props['size']),
    );
  }
  return undefined;
};

export default TGActorFactory;
