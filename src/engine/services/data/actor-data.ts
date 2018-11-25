import HPVectorData from "./vector-data";

export default interface HPActorData {
  type: string;
  position: HPVectorData;
  props: {[index:string]: any};
}
