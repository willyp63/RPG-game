import HPActorData from "../services/data/actor-data";
import HPActor from "./actor";
import HPWall from "../actors/wall";
import HPVector from "../physics/vector";

export default class HPActorFactory {

  createFromData(data: HPActorData): HPActor  {
    const actor = this._createFromData(data);
    if (actor === undefined) throw new Error(`Failed to return actor for data: ${JSON.stringify(data)}`);
    return actor;
  }

  protected _createFromData(data: HPActorData): HPActor | undefined {
    if (data.type === HPWall.type) {
      return new HPWall(
        HPVector.fromData(data.position),
        HPVector.fromData(data.props['size']),
      );
    }

    return undefined;
  }

}
