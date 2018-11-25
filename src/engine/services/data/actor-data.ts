import HPVectorData from "./vector-data";

export default interface HPActorData {
  id: string;
  position: HPVectorData;
  props: {[index:string]: any};
}
