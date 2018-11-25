import HPActorData from "../engine/services/data/actor-data";
import HPActor from "../engine/core/actor";
import TGWall from "./actors/wall";
import HPVector from "../engine/physics/vector";
import TGWanderingTarget from "./actors/wandering-target";

const TGActorFactory = (data: HPActorData): HPActor | undefined => {
  if (data.type === TGWall.type) {
    return new TGWall(
      HPVector.fromData(data.position),
      HPVector.fromData(data.props['size']),
    );
  } else if (data.type === TGWanderingTarget.type) {
    return new TGWanderingTarget(
      HPVector.fromData(data.position),
    );
  }
  return undefined;
};

export default TGActorFactory;
