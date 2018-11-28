import HPActorData from "../services/data/actor-data";
import HPActor from "./actor";

export default interface HPActorFactory {
  [index: string]: (data: HPActorData) => HPActor;
}
