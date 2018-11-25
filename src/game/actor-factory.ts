import HPActorData from "../engine/services/data/actor-data";
import TGWall from "./actors/wall";
import HPVector from "../engine/physics/vector";
import TGWanderingTarget from "./actors/wandering-target";
import HPActorFactory from "../engine/core/actor-factory";

const TGActorFactory: HPActorFactory = {
  [TGWall.id]: (data: HPActorData) => {
    return new TGWall(
      HPVector.fromData(data.position),
      HPVector.fromData(data.props['size']),
    );
  },
  [TGWanderingTarget.id]: (data: HPActorData) => {
    return new TGWanderingTarget(
      HPVector.fromData(data.position),
    );
  },
};

export default TGActorFactory;
