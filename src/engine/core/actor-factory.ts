import HPActorData from "../services/data/actor-data";
import HPActor from "./actor";

export default interface HPActorFactory {
  (data: HPActorData): HPActor | undefined;
}
