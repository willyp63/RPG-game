import HPVectorData from "./vector-data";
import HPActorData from "./actor-data";

export default interface HPAreaData {
  size: HPVectorData;
  actors: Array<HPActorData>;
}
