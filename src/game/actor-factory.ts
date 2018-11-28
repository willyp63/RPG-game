import HPActorData from "../engine/services/data/actor-data";
import TGWall from "./actors/walls/wall";
import HPVector from "../engine/physics/vector";
import TGWanderingTarget from "./actors/enemies/wandering-target";
import HPActorFactory from "../engine/core/actor-factory";

const TGActorFactory: HPActorFactory = {
  [TGWall.id]: (data: HPActorData) => {
    return new TGWall(
      HPVector.from(data.position),
      HPVector.from(data.props['size']),
    );
  },
  [TGWanderingTarget.id]: (data: HPActorData) => {
    return new TGWanderingTarget(
      HPVector.from(data.position),
    );
  },
};

export default TGActorFactory;
